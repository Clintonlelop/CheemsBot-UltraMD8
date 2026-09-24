global.process.env.TZ = global.process.env.TZ || 'Africa/Lagos';
const { modul } = require('./module');
global.serverLogs = [];
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

function formatLogItem(args) {
    return args.map(arg => {
        if (typeof arg === 'object') {
            try { return JSON.stringify(arg); } catch(e) { return String(arg); }
        }
        return String(arg);
    }).join(' ').replace(/\u001b\[\d+m/g, ''); // Strip colors
}

console.log = (...args) => {
    originalLog(...args);
    const text = formatLogItem(args);
    global.serverLogs.push({ time: new Date().toLocaleTimeString(), level: 'INFO', text });
    if (global.serverLogs.length > 300) global.serverLogs.shift();
};
console.error = (...args) => {
    originalError(...args);
    const text = formatLogItem(args);
    global.serverLogs.push({ time: new Date().toLocaleTimeString(), level: 'ERROR', text });
    if (global.serverLogs.length > 300) global.serverLogs.shift();
};
console.warn = (...args) => {
    originalWarn(...args);
    const text = formatLogItem(args);
    global.serverLogs.push({ time: new Date().toLocaleTimeString(), level: 'WARN', text });
    if (global.serverLogs.length > 300) global.serverLogs.shift();
};

const moment = require('moment-timezone');
const { baileys, boom, chalk, fs, figlet, FileType, path, pino, PhoneNumber, axios, yargs, _, qrcodeterminal } = modul;
const { Boom } = boom
const NodeCache = require('node-cache')
const { makeInMemoryStore } = require('./lib/store')
const {
	default: XeonBotIncConnect,
	BufferJSON,
	initInMemoryKeyStore,
	DisconnectReason,
	AnyMessageContent,
	makeCacheableSignalKeyStore,
	useMultiFileAuthState,
	delay,
	fetchLatestBaileysVersion,
	generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    getAggregateVotesInPollMessage,
    proto,
    Browsers
} = require("@whiskeysockets/baileys")
const { color, bgcolor } = require('./lib/color')
const colors = require('colors')
const { start } = require('./lib/spinner')
const { uncache, nocache } = require('./lib/loader')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, sleep, reSize } = require('./lib/myfunc')
const { repairSessionFolder, purgeJidSession } = require('./lib/sessionCleaner')
const { handleAutoViewOnce, handleAntiDelete } = require('./lib/viewonce-antidelete')
const express = require('express')
const QRCode = require('qrcode')
const readline = require('readline')

const question = (text, timeoutMs = 60000) => {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        let resolved = false;
        
        const timer = setTimeout(() => {
            if (!resolved) {
                resolved = true;
                rl.close();
                resolve('timeout');
            }
        }, timeoutMs);

        rl.question(text, (value) => {
            if (!resolved) {
                resolved = true;
                clearTimeout(timer);
                rl.close();
                resolve(value);
            }
        });
    });
};

// Global log/error interceptors to dynamically heal WhatsApp session decryption / Bad MAC errors in real-time
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

function checkAndHealError(msg) {
    if (msg.includes('Bad MAC') || msg.includes('Failed to decrypt') || msg.includes('decryption') || msg.includes('session error')) {
        // Extract JIDs to purge specific session files
        const jidRegex = /[0-9\-_]+@s\.whatsapp\.net|[0-9\-_]+@g\.us|[0-9\-_]+@lid/g;
        const matches = msg.match(jidRegex);
        if (matches && global.authDir) {
            for (const jid of matches) {
                purgeJidSession(global.authDir, jid);
            }
        }
        
        // Clear in-memory keys cache if XeonBotInc is defined
        if (global.XeonBotInc && global.XeonBotInc.authState?.keys?.clear) {
            global.XeonBotInc.authState.keys.clear().catch(() => {});
        }
    }
}

console.error = function (...args) {
    try {
        const msg = args.map(arg => (arg instanceof Error ? arg.message + ' ' + arg.stack : String(arg))).join(' ');
        // Suppress expected internal Signal decryption retries & Bad MAC so they do not crash or flood stderr
        if (msg.includes('Bad MAC') || msg.includes('Failed to decrypt message with any known session') || msg.includes('No matching sessions found') || msg.includes('Session error:Error: Bad MAC')) {
            checkAndHealError(msg);
            return;
        }
        checkAndHealError(msg);
    } catch (_) {}
    originalConsoleError.apply(console, args);
};

console.warn = function (...args) {
    try {
        const msg = args.map(arg => (arg instanceof Error ? arg.message + ' ' + arg.stack : String(arg))).join(' ');
        if (msg.includes('Bad MAC') || msg.includes('Failed to decrypt message with any known session') || msg.includes('No matching sessions found')) {
            checkAndHealError(msg);
            return;
        }
        checkAndHealError(msg);
    } catch (_) {}
    originalConsoleWarn.apply(console, args);
};

console.log = function (...args) {
    try {
        const msg = args.map(arg => String(arg)).join(' ');
        if (msg.includes('Bad MAC') || msg.includes('Failed to decrypt')) {
            checkAndHealError(msg);
        }
    } catch (_) {}
    originalConsoleLog.apply(console, args);
};

const prefix = ''

let botStartupTime = Math.floor(Date.now() / 1000)

// Global message ID deduplication cache (keeps IDs for 3 minutes)
const processedMessageIds = new NodeCache({ stdTTL: 180, checkperiod: 60 })

let rawDb = {}
try {
  const dbPath = path.join(__dirname, 'database', 'database.json')
  if (fs.existsSync(dbPath)) rawDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
} catch (e) {}

global.db = {
  sticker: {},
  database: {}, 
  game: {},
  others: {},
  users: {},
  chats: {},
  settings: {},
  ...(rawDb || {})
}

let owner = []
try {
  const ownerPath = path.join(__dirname, 'database', 'owner.json')
  if (fs.existsSync(ownerPath)) owner = JSON.parse(fs.readFileSync(ownerPath, 'utf8'))
} catch (e) {}

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

require('./XeonCheems8.js')
nocache('./XeonCheems8.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Updated'))

// Lightweight HTTP server on port 3000 for platform health check & preview
const httpApp = express()
const PORT = process.env.APP_PORT || 3000

httpApp.get('/qr-image', (req, res) => {
  if (!currentQr) {
    return res.status(404).send('No active QR code')
  }
  QRCode.toBuffer(currentQr, { type: 'png', margin: 2, width: 400 }, (err, buffer) => {
    if (err || !buffer) return res.status(500).send('Error generating QR image')
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': buffer.length,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
    })
    res.end(buffer)
  })
})

httpApp.get('/qr-data', (req, res) => {
  res.json({
    qr: !!currentQr,
    status: botStatus,
    user: connectedUser
  })
})

httpApp.get('/pair', async (req, res) => {
  let phoneNumber = req.query.number || req.query.phone
  if (!phoneNumber) return res.status(400).json({ error: 'Please enter a phone number' })
  let cleanNum = phoneNumber.replace(/[^0-9]/g, '')
  if (cleanNum.length < 8) return res.status(400).json({ error: 'Phone number must be at least 8 digits with country code' })

  if (!global.XeonBotInc) {
    return res.status(503).json({ error: 'Bot is still initializing, please wait...' })
  }
  if (global.XeonBotInc?.authState?.creds?.registered) {
    return res.status(400).json({ error: 'Bot is already linked and connected!' })
  }

  try {
    let code = await global.XeonBotInc.requestPairingCode(cleanNum)
    code = code?.match(/.{1,4}/g)?.join("-") || code
    console.log(color(`\n[PAIRING CODE] Real Baileys pairing code generated for ${cleanNum}: ${code}\n`, 'green'))
    return res.json({ success: true, code, number: cleanNum })
  } catch (err) {
    console.error('[PAIRING CODE ERROR]', err?.message || err)
    return res.status(500).json({ error: err?.message || 'Failed to generate pairing code' })
  }
})

httpApp.get('/logs', (req, res) => {
  res.json(global.serverLogs || [])
})

httpApp.get('/cheemspic.jpg', (req, res) => {
  const p = path.join(__dirname, 'XeonMedia', 'theme', 'cheemspic.jpg')
  if (fs.existsSync(p)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    return res.sendFile(p)
  }
  res.status(404).send('Banner not found')
})

httpApp.post('/upload-cheemspic', express.json({ limit: '50mb' }), (req, res) => {
  try {
    const base64Data = req.body.image
    if (!base64Data) return res.status(400).json({ error: 'No image data provided' })
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(cleanBase64, 'base64')
    const targetPath = path.join(__dirname, 'XeonMedia', 'theme', 'cheemspic.jpg')
    const targetDir = path.dirname(targetPath)
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
    fs.writeFileSync(targetPath, buffer)
    global.thum = buffer
    global.thumb = buffer
    console.log(color('\n[THEME BANNER] cheemspic.jpg successfully updated from web dashboard!\n', 'green'))
    res.json({ success: true, message: 'cheemspic.jpg successfully updated!' })
  } catch (err) {
    console.error('[THEME BANNER ERROR]', err)
    res.status(500).json({ error: err?.message || 'Failed to update cheemspic' })
  }
})

const handleUploadSession = async (req, res) => {
  try {
    const authDir = path.join(__dirname, global.sessionName || 'session');
    const dbDir = path.join(__dirname, 'database');
    const backupCredsPath = path.join(dbDir, 'session_creds_backup.json');
    if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

    const cleanStaleKeys = () => {
      try {
        const files = fs.readdirSync(authDir);
        for (const file of files) {
          if (file.startsWith('pre-key') || file.startsWith('session-') || file.startsWith('sender-key')) {
            try { fs.unlinkSync(path.join(authDir, file)); } catch (_) {}
          }
        }
      } catch (_) {}
    };

    const extractCreds = (input) => {
      if (!input) return null;
      let obj = input;
      if (typeof obj === 'string') {
        const trimmed = obj.trim();
        // Check if raw JSON
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
          try { obj = JSON.parse(trimmed); } catch (_) {}
        }
        // Check if Base64 string
        if (typeof obj === 'string') {
          try {
            const decoded = Buffer.from(trimmed.replace(/^data:.*?;base64,/, ''), 'base64').toString('utf8');
            if (decoded.trim().startsWith('{')) obj = JSON.parse(decoded);
          } catch (_) {}
        }
      }
      if (obj && typeof obj === 'object') {
        if (obj.creds && typeof obj.creds === 'object') return obj.creds;
        if (obj.session && typeof obj.session === 'object') return obj.session;
        if (obj.data && typeof obj.data === 'object') return obj.data;
        if (obj.noiseKey || obj.signedIdentityKey || obj.registrationId || obj.me) return obj;
      }
      return null;
    };

    // 1. Multiple Files / Entire Session Folder Upload
    if (Array.isArray(req.body.files) && req.body.files.length > 0) {
      let savedCount = 0;
      let credsFound = null;

      cleanStaleKeys();

      for (const item of req.body.files) {
        if (!item || !item.name) continue;
        const cleanName = path.basename(item.name);
        const targetPath = path.join(authDir, cleanName);
        let fileBuffer;
        if (item.data) {
          const raw = String(item.data).replace(/^data:.*?;base64,/, '');
          fileBuffer = Buffer.from(raw, item.isBase64 ? 'base64' : 'utf8');
        } else if (item.content) {
          fileBuffer = Buffer.from(item.content, 'utf8');
        }
        if (fileBuffer) {
          fs.writeFileSync(targetPath, fileBuffer);
          savedCount++;
          if (cleanName === 'creds.json') {
            credsFound = extractCreds(fileBuffer.toString('utf8'));
          }
        }
      }

      if (credsFound) {
        fs.writeFileSync(backupCredsPath, JSON.stringify(credsFound, null, 2));
      }

      console.log(color(`\n[SESSION IMPORT] Folder import: ${savedCount} files saved into session/!\n`, 'green'));
    }
    // 2. Direct creds / session text or JSON
    else if (req.body.creds || req.body.session) {
      const credsObj = extractCreds(req.body.creds || req.body.session);
      if (!credsObj) {
        return res.status(400).json({ success: false, error: 'Could not extract valid WhatsApp credentials from the input' });
      }

      cleanStaleKeys();
      fs.writeFileSync(path.join(authDir, 'creds.json'), JSON.stringify(credsObj, null, 2));
      fs.writeFileSync(backupCredsPath, JSON.stringify(credsObj, null, 2));
      console.log(color('\n[SESSION IMPORT] creds.json imported and backed up successfully!\n', 'green'));
    } 
    // 3. Uploaded Single File (JSON or ZIP)
    else if (req.body.fileData && req.body.fileName) {
      const fileName = (req.body.fileName || '').toLowerCase();
      const base64Data = String(req.body.fileData).replace(/^data:.*?;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      if (fileName.endsWith('.zip')) {
        const os = require('os');
        const tmpZip = path.join(os.tmpdir(), `session_upload_${Date.now()}.zip`);
        fs.writeFileSync(tmpZip, buffer);
        try {
          const { execSync } = require('child_process');
          cleanStaleKeys();
          execSync(`unzip -o -q "${tmpZip}" -d "${authDir}"`);
          // Hoist nested session folder if present
          const extractedFiles = fs.readdirSync(authDir);
          const nestedSession = extractedFiles.find(f => {
            const p = path.join(authDir, f);
            return fs.statSync(p).isDirectory() && (f.toLowerCase() === 'session' || f.toLowerCase().includes('session'));
          });
          if (nestedSession) {
            const nestedPath = path.join(authDir, nestedSession);
            for (const item of fs.readdirSync(nestedPath)) {
              fs.renameSync(path.join(nestedPath, item), path.join(authDir, item));
            }
          }

          // Backup creds.json if present
          const mainCredsPath = path.join(authDir, 'creds.json');
          if (fs.existsSync(mainCredsPath)) {
            try {
              const parsed = JSON.parse(fs.readFileSync(mainCredsPath, 'utf8'));
              if (parsed.noiseKey || parsed.me) {
                fs.writeFileSync(backupCredsPath, JSON.stringify(parsed, null, 2));
              }
            } catch (_) {}
          }
          console.log(color('\n[SESSION IMPORT] session.zip successfully unpacked into session/ folder!\n', 'green'));
        } finally {
          try { fs.unlinkSync(tmpZip); } catch (e) {}
        }
      } else if (fileName.endsWith('.json')) {
        const strContent = buffer.toString('utf8');
        const credsObj = extractCreds(strContent);
        if (credsObj) {
          cleanStaleKeys();
          fs.writeFileSync(path.join(authDir, 'creds.json'), JSON.stringify(credsObj, null, 2));
          fs.writeFileSync(backupCredsPath, JSON.stringify(credsObj, null, 2));
          console.log(color(`\n[SESSION IMPORT] creds.json verified and saved into session/!\n`, 'green'));
        } else {
          // Normal json file
          fs.writeFileSync(path.join(authDir, req.body.fileName), buffer);
          console.log(color(`\n[SESSION IMPORT] ${req.body.fileName} saved into session/!\n`, 'green'));
        }
      } else {
        return res.status(400).json({ success: false, error: 'Please upload a .json file, a .zip archive, or a session folder' });
      }
    } else {
      return res.status(400).json({ success: false, error: 'No session data provided' });
    }

    // Terminate existing Baileys socket so it reconnects with the newly imported session
    if (global.activeSocket || global.XeonBotInc) {
      try {
        if (global.activeSocket?.end) global.activeSocket.end(new Error('New session imported'));
        if (global.XeonBotInc?.ws?.close) global.XeonBotInc.ws.close();
      } catch (e) {}
      global.activeSocket = null;
    }

    botStatus = 'New session imported. Connecting to WhatsApp...';
    global.reconnecting = false;

    // Trigger bot connection
    setTimeout(() => {
      XeonBotIncBot().catch(console.error);
    }, 1000);

    return res.json({ success: true, message: 'Session imported successfully! Connecting to WhatsApp...' });
  } catch (err) {
    console.error('[SESSION IMPORT ERROR]', err);
    return res.status(500).json({ success: false, error: err?.message || 'Failed to import session' });
  }
};

httpApp.post('/upload-session', express.json({ limit: '100mb' }), handleUploadSession);
httpApp.post('/api/upload-session', express.json({ limit: '100mb' }), handleUploadSession);

const handleResetSession = async (req, res) => {
  try {
    console.log(color('\n[SESSION RESET] Complete session purge requested. Deleting session directory and preventing auto-restore...', 'yellow'))
    
    // Clean up active socket
    if (global.activeSocket || global.XeonBotInc) {
      try {
        if (global.activeSocket?.end) global.activeSocket.end(new Error('Session reset requested'))
        if (global.XeonBotInc?.ws?.close) global.XeonBotInc.ws.close()
      } catch (e) {}
      global.activeSocket = null
    }

    const authDir = path.join(__dirname, global.sessionName || 'session')
    const backupCredsPath = path.join(__dirname, 'database', 'session_creds_backup.json')

    try {
      if (fs.existsSync(authDir)) fs.rmSync(authDir, { recursive: true, force: true })
      fs.mkdirSync(authDir, { recursive: true })
    } catch (e) {
      console.error('[Session Reset AuthDir Error]', e?.message || e)
    }

    try {
      if (fs.existsSync(backupCredsPath)) fs.unlinkSync(backupCredsPath)
    } catch (e) {
      console.error('[Session Reset Backup Error]', e?.message || e)
    }

    currentQr = ''
    connectedUser = null
    botStatus = 'Session wiped clean. Ready for new QR scan, pairing code, or session import.'
    global.reconnecting = false

    // Trigger restart
    setTimeout(() => {
      XeonBotIncBot().catch(console.error)
    }, 1000)

    return res.json({ success: true, message: 'Session deleted completely. Bot is starting afresh.' })
  } catch (err) {
    console.error('[SESSION RESET ERROR]', err?.message || err)
    return res.status(500).json({ success: false, error: err?.message || 'Failed to reset session' })
  }
};

httpApp.all('/reset-session', handleResetSession);
httpApp.all('/api/reset-session', handleResetSession);
httpApp.all('/delete-session', handleResetSession);

httpApp.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cheems Bot MD - Authentication & Dashboard</title>
  <style>
    body { background: #0d1117; color: #e6edf3; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 16px; box-sizing: border-box; }
    .card { background: #161b22; padding: 28px 36px; border-radius: 12px; border: 1px solid #30363d; text-align: center; max-width: 680px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    h1 { color: #3fb950; margin: 0 0 12px 0; font-size: 22px; }
    p { color: #8b949e; font-size: 14px; line-height: 1.4; margin: 6px 0; }
    .tab-btn { background: #21262d; border: 1px solid #30363d; color: #c9d1d9; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; margin: 3px; transition: 0.15s; }
    .tab-btn:hover { background: #30363d; }
    .tab-btn.active { background: #238636; border-color: #2e9e44; color: #fff; }
    .qr-container { margin: 16px 0; padding: 14px; background: #ffffff; border-radius: 10px; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .qr-container img { display: block; width: 280px; height: 280px; margin: 0 auto; border: none; }
    .status { font-weight: 600; font-size: 15px; margin-top: 10px; }
    .badge { display: inline-block; background: #238636; color: #fff; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; }
    .pair-box { margin-top: 16px; text-align: left; }
    .pair-input { width: 100%; padding: 10px 12px; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; color: #fff; font-size: 14px; box-sizing: border-box; margin-bottom: 10px; }
    .pair-btn { width: 100%; padding: 10px; background: #238636; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; transition: 0.15s; }
    .pair-btn:hover { opacity: 0.9; }
    .code-display { background: #0d1117; border: 1px solid #238636; color: #3fb950; font-family: monospace; font-size: 24px; font-weight: bold; letter-spacing: 2px; padding: 12px; border-radius: 6px; text-align: center; margin-top: 12px; }
    
    /* Logs Panel styling */
    .logs-panel { margin-top: 16px; text-align: left; background: #0d1117; border: 1px solid #30363d; border-radius: 8px; padding: 12px; box-sizing: border-box; }
    .logs-container { height: 260px; overflow-y: auto; font-family: monospace; font-size: 12px; line-height: 1.5; color: #8b949e; white-space: pre-wrap; word-break: break-all; }
    .log-line { border-bottom: 1px solid #1f242c; padding: 4px 0; }
    .log-line.error { color: #f85149; }
    .log-line.warn { color: #d29922; }
    .log-line.info { color: #8b949e; }
    .log-time { color: #58a6ff; margin-right: 6px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🤖 Cheems Bot MD</h1>
    <div id="statusText" class="status">Connecting...</div>

    <div style="margin-top: 14px; display: flex; flex-wrap: wrap; justify-content: center; gap: 4px;">
      <button id="tabQrBtn" class="tab-btn active" onclick="switchTab('qr')">QR Scan</button>
      <button id="tabPairBtn" class="tab-btn" onclick="switchTab('pair')">Pairing Code</button>
      <button id="tabSessionBtn" class="tab-btn" onclick="switchTab('session')">📂 Import Session</button>
      <button id="tabThemeBtn" class="tab-btn" onclick="switchTab('theme')">🖼️ Replace Cheemspic</button>
      <button id="tabLogsBtn" class="tab-btn" onclick="switchTab('logs')">Live Logs</button>
    </div>

    <!-- QR Section -->
    <div id="qrSection">
      <div id="qrContainer" class="qr-container" style="display: none;">
        <img id="qrImg" src="" alt="WhatsApp QR Code" />
      </div>
      <p style="margin-top: 10px;">Open WhatsApp &gt; Linked Devices &gt; Link a Device to scan.</p>
    </div>

    <!-- Pairing Code Section -->
    <div id="pairSection" style="display: none;">
      <div class="pair-box">
        <p style="margin-bottom: 8px;">Enter phone number with country code (e.g. 2348160208114):</p>
        <input type="text" id="phoneInput" class="pair-input" placeholder="e.g. 2348160208114" />
        <button onclick="requestPairCode()" class="pair-btn">Get Pairing Code</button>
        <div id="pairResult"></div>
      </div>
    </div>

    <!-- Import Session Section -->
    <div id="sessionSection" style="display: none;">
      <div style="background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 18px; text-align: left; margin-top: 14px;">
        <h3 style="color: #58a6ff; margin: 0 0 6px 0; font-size: 16px;">📂 Import Session Directly</h3>
        <p style="font-size: 13px; color: #8b949e; margin-bottom: 14px;">
          Import your session directly into the bot folder without scanning. Upload a <code>creds.json</code> file, a <code>session.zip</code> archive, or paste the raw JSON below.
        </p>

        <!-- Method 1: File Upload -->
        <div style="border: 1px dashed #30363d; border-radius: 8px; padding: 14px; text-align: center; background: #0d1117; margin-bottom: 14px;">
          <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #c9d1d9;">Option 1: Upload <code>creds.json</code> or <code>session.zip</code></p>
          <input type="file" id="sessionFileInput" accept=".json,.zip" style="display: none;" onchange="handleSessionFileSelected(event)" />
          <button onclick="document.getElementById('sessionFileInput').click()" class="tab-btn" style="background: #238636; border-color: #2ea043; color: white; padding: 8px 18px; font-weight: 600;">📁 Select Single File (.json / .zip)</button>
          <div id="sessionFileStatus" style="margin-top: 8px; font-size: 12px; color: #58a6ff;"></div>
        </div>

        <!-- Method 2: Entire Folder Upload -->
        <div style="border: 1px dashed #30363d; border-radius: 8px; padding: 14px; text-align: center; background: #0d1117; margin-bottom: 14px;">
          <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #c9d1d9;">Option 2: Upload Entire <code>session</code> Folder</p>
          <input type="file" id="sessionFolderInput" webkitdirectory directory multiple style="display: none;" onchange="handleSessionFolderSelected(event)" />
          <button onclick="document.getElementById('sessionFolderInput').click()" class="tab-btn" style="background: #1f6feb; border-color: #388bfd; color: white; padding: 8px 18px; font-weight: 600;">📂 Select Entire Session Folder</button>
          <div id="sessionFolderStatus" style="margin-top: 8px; font-size: 12px; color: #58a6ff;"></div>
        </div>

        <!-- Method 3: Paste JSON -->
        <div style="margin-bottom: 14px;">
          <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #c9d1d9;">Option 3: Paste Raw <code>creds.json</code> Content / Session String</p>
          <textarea id="sessionJsonInput" style="width: 100%; height: 110px; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; color: #7ee787; font-family: monospace; font-size: 12px; padding: 10px; box-sizing: border-box; resize: vertical;" placeholder='{"noiseKey": {"private": ...}, "me": {"id": ...}}'></textarea>
          <button onclick="submitPastedSession()" class="pair-btn" style="margin-top: 8px; background: #238636;">💾 Save &amp; Connect Session</button>
          <div id="sessionPasteStatus" style="margin-top: 8px; font-size: 12px;"></div>
        </div>

        <div style="border-top: 1px solid #30363d; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <span style="font-size: 12px; color: #8b949e;">Want a fresh start?</span>
          <button onclick="resetSession()" style="background: rgba(248, 81, 73, 0.15); border: 1px solid rgba(248, 81, 73, 0.4); color: #f85149; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 6px; cursor: pointer;">🗑️ Wipe Session &amp; Start Afresh</button>
        </div>
      </div>
    </div>

    <!-- Theme Banner (Cheemspic) Section -->
    <div id="themeSection" style="display: none;">
      <div style="background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 16px; text-align: center; margin-top: 14px;">
        <h3 style="color: #3fb950; margin: 0 0 6px 0; font-size: 16px;">🖼️ Replace Cheemspic (Bot Banner)</h3>
        <p style="font-size: 13px; color: #8b949e; margin-bottom: 12px;">Current banner (<code>XeonMedia/theme/cheemspic.jpg</code>):</p>
        <div style="border-radius: 8px; overflow: hidden; border: 1px solid #30363d; display: inline-block; max-width: 100%; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
          <img id="currentBannerImg" src="/cheemspic.jpg" alt="Bot Banner" style="max-width: 100%; max-height: 220px; display: block; object-fit: contain; margin: 0 auto;" />
        </div>
        <div style="margin-top: 14px;">
          <input type="file" id="bannerFileInput" accept="image/*" style="display: none;" onchange="handleBannerSelected(event)" />
          <button onclick="document.getElementById('bannerFileInput').click()" class="tab-btn" style="background: #238636; border-color: #2ea043; color: white; padding: 9px 18px; font-weight: 600;">📁 Upload New Cheemspic Image</button>
          <div id="uploadStatusMsg" style="margin-top: 8px; font-size: 12px; color: #58a6ff;"></div>
        </div>
        <p style="font-size: 11px; color: #8b949e; margin-top: 12px;">💡 <em>You can also send or reply to any photo on WhatsApp with <b>.setthumb</b> or <b>.setcheemspic</b></em></p>
      </div>
    </div>

    <!-- Live Logs Section -->
    <div id="logsSection" style="display: none;">
      <div class="logs-panel">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 13px; font-weight: 600; color: #58a6ff;">Console Log Stream</span>
          <button onclick="clearLogsUI()" style="background: none; border: none; color: #f85149; font-size: 11px; cursor: pointer; text-decoration: underline;">Clear Display</button>
        </div>
        <div id="logsContainer" class="logs-container">Loading log stream...</div>
      </div>
    </div>

    <div style="margin-top: 18px; display: flex; justify-content: center; gap: 10px; align-items: center; flex-wrap: wrap;">
      <div class="badge">BOT ACTIVE</div>
      <button onclick="resetSession()" style="background: rgba(248, 81, 73, 0.15); border: 1px solid rgba(248, 81, 73, 0.4); color: #f85149; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='rgba(248, 81, 73, 0.3)'" onmouseout="this.style.background='rgba(248, 81, 73, 0.15)'">🗑️ Wipe Session &amp; Start Afresh</button>
    </div>
  </div>

  <script>
    let lastLogCount = 0;

    async function resetSession() {
      if (!confirm('Are you sure you want to completely delete the session folder and start afresh?')) return;
      const statusEl = document.getElementById('statusText');
      statusEl.innerText = 'Deleting session and restarting...';
      statusEl.style.color = '#f85149';
      try {
        const res = await fetch('/reset-session', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          statusEl.innerText = 'Session wiped clean! Waiting for new QR / pairing code...';
          setTimeout(checkQR, 2000);
        } else {
          alert('Error: ' + (data.error || 'Failed to reset'));
        }
      } catch (err) {
        alert('Network error resetting session');
      }
    }

    function switchTab(mode) {
      document.getElementById('tabQrBtn').classList.toggle('active', mode === 'qr');
      document.getElementById('tabPairBtn').classList.toggle('active', mode === 'pair');
      document.getElementById('tabSessionBtn').classList.toggle('active', mode === 'session');
      document.getElementById('tabThemeBtn').classList.toggle('active', mode === 'theme');
      document.getElementById('tabLogsBtn').classList.toggle('active', mode === 'logs');
      
      document.getElementById('qrSection').style.display = mode === 'qr' ? 'block' : 'none';
      document.getElementById('pairSection').style.display = mode === 'pair' ? 'block' : 'none';
      document.getElementById('sessionSection').style.display = mode === 'session' ? 'block' : 'none';
      document.getElementById('themeSection').style.display = mode === 'theme' ? 'block' : 'none';
      document.getElementById('logsSection').style.display = mode === 'logs' ? 'block' : 'none';
      
      if (mode === 'logs') {
        fetchLogs();
      }
    }

    async function handleBannerSelected(e) {
      const file = e.target.files[0];
      if (!file) return;
      const statusMsg = document.getElementById('uploadStatusMsg');
      statusMsg.innerText = 'Uploading ' + file.name + '...';
      statusMsg.style.color = '#58a6ff';
      
      const reader = new FileReader();
      reader.onload = async function(evt) {
        try {
          const res = await fetch('/upload-cheemspic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: evt.target.result })
          });
          const json = await res.json();
          if (json.success) {
            statusMsg.innerText = '✅ Banner updated successfully! (cheemspic.jpg active)';
            statusMsg.style.color = '#3fb950';
            document.getElementById('currentBannerImg').src = '/cheemspic.jpg?t=' + Date.now();
          } else {
            statusMsg.innerText = '⚠️ Error: ' + (json.error || 'Upload failed');
            statusMsg.style.color = '#f85149';
          }
        } catch (err) {
          statusMsg.innerText = '⚠️ Network error uploading banner';
          statusMsg.style.color = '#f85149';
        }
      };
      reader.readAsDataURL(file);
    }

    async function handleSessionFileSelected(e) {
      const file = e.target.files[0];
      if (!file) return;
      const statusMsg = document.getElementById('sessionFileStatus');
      statusMsg.innerText = 'Uploading ' + file.name + '...';
      statusMsg.style.color = '#58a6ff';

      const isJson = file.name.toLowerCase().endsWith('.json');
      const reader = new FileReader();

      reader.onload = async function(evt) {
        try {
          const payload = isJson 
            ? { creds: evt.target.result, fileName: file.name }
            : { fileName: file.name, fileData: evt.target.result };

          const res = await fetch('/upload-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const json = await res.json();
          if (json.success) {
            statusMsg.innerText = '✅ ' + json.message;
            statusMsg.style.color = '#3fb950';
            setTimeout(checkQR, 2000);
          } else {
            statusMsg.innerText = '⚠️ Error: ' + (json.error || 'Import failed');
            statusMsg.style.color = '#f85149';
          }
        } catch (err) {
          statusMsg.innerText = '⚠️ Network error uploading session file';
          statusMsg.style.color = '#f85149';
        }
      };

      if (isJson) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    }

    async function handleSessionFolderSelected(e) {
      const files = Array.from(e.target.files || []);
      if (!files || files.length === 0) return;
      const statusMsg = document.getElementById('sessionFolderStatus');
      statusMsg.innerText = 'Preparing ' + files.length + ' session files...';
      statusMsg.style.color = '#58a6ff';

      try {
        const filePromises = files.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(evt) {
              resolve({
                name: file.name,
                data: evt.target.result,
                isBase64: true
              });
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
          });
        });

        const preparedFiles = (await Promise.all(filePromises)).filter(Boolean);
        statusMsg.innerText = 'Uploading ' + preparedFiles.length + ' files into session/ folder...';

        const res = await fetch('/upload-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files: preparedFiles })
        });
        const json = await res.json();
        if (json.success) {
          statusMsg.innerText = '✅ ' + json.message;
          statusMsg.style.color = '#3fb950';
          setTimeout(checkQR, 2000);
        } else {
          statusMsg.innerText = '⚠️ Error: ' + (json.error || 'Folder import failed');
          statusMsg.style.color = '#f85149';
        }
      } catch (err) {
        statusMsg.innerText = '⚠️ Network error uploading folder';
        statusMsg.style.color = '#f85149';
      }
    }

    async function submitPastedSession() {
      const text = document.getElementById('sessionJsonInput').value.trim();
      const statusMsg = document.getElementById('sessionPasteStatus');
      if (!text) {
        statusMsg.innerText = 'Please paste session JSON first!';
        statusMsg.style.color = '#f85149';
        return;
      }
      statusMsg.innerText = 'Saving and connecting session...';
      statusMsg.style.color = '#58a6ff';

      try {
        const res = await fetch('/upload-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ creds: text })
        });
        const json = await res.json();
        if (json.success) {
          statusMsg.innerText = '✅ ' + json.message;
          statusMsg.style.color = '#3fb950';
          setTimeout(checkQR, 2000);
        } else {
          statusMsg.innerText = '⚠️ Error: ' + (json.error || 'Import failed');
          statusMsg.style.color = '#f85149';
        }
      } catch (err) {
        statusMsg.innerText = '⚠️ Network error importing session';
        statusMsg.style.color = '#f85149';
      }
    }

    function clearLogsUI() {
      document.getElementById('logsContainer').innerHTML = '<div style="color: #8b949e; text-align: center; margin-top: 40px;">Display cleared. Waiting for new logs...</div>';
    }

    async function fetchLogs() {
      try {
        const res = await fetch('/logs');
        const logs = await res.json();
        const container = document.getElementById('logsContainer');
        if (!logs || logs.length === 0) {
          container.innerHTML = '<div style="color: #8b949e; text-align: center; margin-top: 40px;">No console logs available yet. Try executing commands!</div>';
          return;
        }
        
        let html = '';
        logs.forEach(log => {
          let lvlClass = 'info';
          if (log.level === 'ERROR') lvlClass = 'error';
          if (log.level === 'WARN') lvlClass = 'warn';
          
          html += '<div class="log-line ' + lvlClass + '">' +
                  '<span class="log-time">[' + log.time + ']</span>' +
                  '<span>' + escapeHTML(log.text) + '</span>' +
                  '</div>';
        });
        
        container.innerHTML = html;
        if (logs.length !== lastLogCount) {
          container.scrollTop = container.scrollHeight;
          lastLogCount = logs.length;
        }
      } catch (err) {}
    }

    function escapeHTML(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    async function checkQR() {
      try {
        const res = await fetch('/qr-data');
        const data = await res.json();
        const imgEl = document.getElementById('qrImg');
        const statusEl = document.getElementById('statusText');
        const qrBox = document.getElementById('qrContainer');

        if (data.qr) {
          qrBox.style.display = 'inline-block';
          imgEl.src = '/qr-image?t=' + Date.now();
          statusEl.innerText = 'Scan QR code or use Pairing Code';
          statusEl.style.color = '#3fb950';
        } else if (data.user) {
          qrBox.style.display = 'none';
          statusEl.innerText = 'Connected as ' + (data.user.name || data.user.id || 'WhatsApp Bot');
          statusEl.style.color = '#58a6ff';
        } else {
          qrBox.style.display = 'none';
          statusEl.innerText = data.status || 'Initializing...';
          statusEl.style.color = '#8b949e';
        }
      } catch (e) {}
    }

    async function requestPairCode() {
      const num = document.getElementById('phoneInput').value.trim();
      const resBox = document.getElementById('pairResult');
      if (!num) {
        resBox.innerHTML = '<p style="color: #f85149;">Please enter a phone number!</p>';
        return;
      }
      resBox.innerHTML = '<p style="color: #d29922;">Requesting code from WhatsApp...</p>';
      try {
        const res = await fetch('/pair?number=' + encodeURIComponent(num));
        const data = await res.json();
        if (data.success && data.code) {
          resBox.innerHTML = '<div class="code-display">' + data.code + '</div><p style="margin-top: 8px;">Enter this code in WhatsApp &gt; Linked Devices &gt; Link with phone number instead.</p>';
        } else {
          resBox.innerHTML = '<p style="color: #f85149;">Error: ' + (data.error || 'Failed to get pairing code') + '</p>';
        }
      } catch (err) {
        resBox.innerHTML = '<p style="color: #f85149;">Network error requesting pairing code.</p>';
      }
    }

    setInterval(checkQR, 3000);
    setInterval(fetchLogs, 2000);
    checkQR();
  </script>
</body>
</html>`)
})

httpApp.listen(PORT, '0.0.0.0', () => {
  console.log(color(`[HTTP Health Server] Listening on 0.0.0.0:${PORT}`, 'cyan'))
}).on('error', (err) => {
  if (err.code !== 'EADDRINUSE') console.error('[HTTP Server Error]', err)
})

global.reconnecting = false
let reconnectAttempts = 0
let currentQr = ''
let botStatus = 'Initializing...'
let connectedUser = null
let qrLinkPrinted = false
let pairingCodeRequested = false
let storeBound = false

async function XeonBotIncBot() {
	global.XeonBotIncBot = XeonBotIncBot
	if (global.activeSocket) {
		try {
			console.log('[Connection Manager] Found active socket instance. Ending connection to prevent duplicate instances...');
			global.activeSocket.ev?.removeAllListeners();
			try { global.activeSocket.ws?.close(); } catch (_) {}
			try { global.activeSocket.end(); } catch (_) {}
		} catch (e) {
			console.log('[Connection Manager] Error cleaning up previous socket:', e.message);
		}
		global.activeSocket = null;
	}
	if (global.reconnecting) return
	global.reconnecting = true
	const authDir = path.join(__dirname, global.sessionName || 'session')
	const backupCredsPath = path.join(__dirname, 'database', 'session_creds_backup.json')
	const mainCredsPath = path.join(authDir, 'creds.json')
	global.authDir = authDir
	try {
		if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true })
	} catch (e) {}

	// Auto-restore creds.json from backup if missing or empty, or from project root session file
	try {
		const rootCredsCandidates = [
			path.join(__dirname, 'creds.json'),
			path.join(__dirname, 'session.json'),
			path.join(__dirname, 'session_creds.json')
		]
		for (const cand of rootCredsCandidates) {
			if (fs.existsSync(cand) && fs.statSync(cand).isFile() && fs.statSync(cand).size > 10) {
				try {
					const cData = fs.readFileSync(cand, 'utf8')
					const cParsed = JSON.parse(cData)
					if (cParsed.noiseKey || cParsed.me) {
						console.log(color(`\n[SESSION AUTO-DETECT] Found session credentials at ${path.basename(cand)}! Syncing to session/creds.json...\n`, 'green'))
						fs.writeFileSync(mainCredsPath, cData)
						fs.writeFileSync(backupCredsPath, cData)
						break
					}
				} catch (_) {}
			}
		}

		const isCredsMissing = !fs.existsSync(mainCredsPath) || fs.statSync(mainCredsPath).size < 10
		if (isCredsMissing && fs.existsSync(backupCredsPath) && fs.statSync(backupCredsPath).size > 10) {
			const bData = fs.readFileSync(backupCredsPath, 'utf8')
			try {
				const bParsed = JSON.parse(bData)
				if (bParsed.noiseKey || bParsed.signedIdentityKey || bParsed.registrationId || bParsed.me) {
					console.log(color('\n[SESSION AUTO-RESTORE] Restoring creds.json from persistent backup!\n', 'green'))
					fs.writeFileSync(mainCredsPath, bData)
				}
			} catch (_) {}
		}
	} catch (e) {
		console.log('[SESSION AUTO-RESTORE ERROR]', e?.message || e)
	}

	try {
		repairSessionFolder(authDir, { prunePreKeys: false })
	} catch (e) {
		console.log('[Session Init Cleaner]', e?.message || e)
	}
	const { saveCreds, state } = await useMultiFileAuthState(authDir)

	let connectionOption = 'qr'
	let phoneNumberToPair = ''

	if (!state.creds.registered) {
		if (process.stdin.isTTY) {
			console.log(color('\n==================================================', 'cyan'))
			console.log(color('🤖 CLINTON BOT CONNECTION MENU', 'green'))
			console.log(color('==================================================', 'cyan'))
			console.log(color('1. Scan with QR Code (prints in terminal & shows on web)', 'yellow'))
			console.log(color('2. Use Pairing Code (prompts for number & prints code)', 'yellow'))
			console.log(color('==================================================\n', 'cyan'))

			const choice = await question(color('Choose option (1 or 2, defaults to 1 after 30 seconds): ', 'green'), 30000)
			
			if (choice === 'timeout') {
				console.log(color('\n[Timeout] No input received within 30s. Defaulting to QR Code mode.', 'yellow'))
				connectionOption = 'qr'
			} else if (choice.trim() === '2') {
				connectionOption = 'pairing'
				const num = await question(color('\nOkay, input your phone number (with country code, e.g., 2348160208114): ', 'green'), 45000)
				if (num === 'timeout' || !num.trim()) {
					console.log(color('\nNo number entered. Defaulting to QR Code mode.', 'yellow'))
					connectionOption = 'qr'
				} else {
					phoneNumberToPair = num.replace(/[^0-9]/g, '')
					if (!phoneNumberToPair || phoneNumberToPair.length < 8) {
						console.log(color('\nInvalid phone number. Defaulting to QR Code mode.', 'red'))
						connectionOption = 'qr'
					} else {
						console.log(color(`\nSelected Pairing Code connection for: +${phoneNumberToPair}`, 'green'))
					}
				}
			} else {
				console.log(color('\nSelected QR Code connection.', 'green'))
				connectionOption = 'qr'
			}
		} else {
			// Non-interactive / web server environment: default to QR immediately so web UI displays QR code instantly
			connectionOption = 'qr'
		}
	} else {
		connectionOption = 'registered'
	}

	const usePairingCode = (connectionOption === 'pairing')
	const groupMetadataCache = new Map()
	const welcomeGroupsPath = path.join(__dirname, 'database', 'welcome.json')
	const goodbyeGroupsPath = path.join(__dirname, 'database', 'goodbye.json')
	const isWelcomeEnabled = (jid) => {
		try {
			if (!fs.existsSync(welcomeGroupsPath)) return false
			const groups = JSON.parse(fs.readFileSync(welcomeGroupsPath, 'utf8'))
			return Array.isArray(groups) && groups.includes(jid)
		} catch (_) { return false }
	}
	const isGoodbyeEnabled = (jid) => {
		try {
			if (!fs.existsSync(goodbyeGroupsPath)) return false
			const groups = JSON.parse(fs.readFileSync(goodbyeGroupsPath, 'utf8'))
			return Array.isArray(groups) && groups.includes(jid)
		} catch (_) { return false }
	}
	const refreshGroupMetadata = async (jid) => {
		if (!jid || !jid.endsWith('@g.us')) return null
		try {
			const metadata = await XeonBotInc.groupMetadata(jid)
			groupMetadataCache.set(jid, metadata)
			return metadata
		} catch (err) {
			return groupMetadataCache.get(jid) || null
		}
	}
	const { version } = await fetchLatestBaileysVersion()
    	const msgRetryCounterCache = new NodeCache({ stdTTL: 300, checkperiod: 60 })
    	const XeonBotInc = XeonBotIncConnect({
        logger: pino({ level: 'silent' }),
        version,
        printQRInTerminal: !usePairingCode,
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        auth: { ...state, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
        msgRetryCounterCache,
        retryRequestDelayMs: 350,
        maxMsgRetryCount: 5,
        cachedGroupMetadata: async (jid) => groupMetadataCache.get(jid),
        syncFullHistory: false,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id)
                return msg?.message || undefined
            }
            return undefined
        }
    })

    global.XeonBotInc = XeonBotInc
    global.activeSocket = XeonBotInc

    if (!storeBound) {
        store.bind(XeonBotInc.ev)
        storeBound = true
    }
    XeonBotInc.public = true

    // Request pairing code if pairing mode is chosen and not registered
    if (connectionOption === 'pairing' && phoneNumberToPair && !state.creds.registered) {
        setTimeout(async () => {
            try {
                let code = await XeonBotInc.requestPairingCode(phoneNumberToPair);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(color(`\n==================================================`, 'cyan'));
                console.log(color(`🔑 YOUR PAIRING CODE: ${code}`, 'green'));
                console.log(color(`==================================================\n`, 'cyan'));
            } catch (err) {
                console.error(color('[Pairing Error] Failed to generate pairing code:', 'red'), err?.message || err);
            }
        }, 3000);
    }

XeonBotInc.ev.on('connection.update', async (update) => {
	const {
		connection,
		lastDisconnect,
		qr
	} = update
try{
		if (qr) {
			const isNewQr = currentQr !== qr
			currentQr = qr
			botStatus = 'Scan QR Code or Enter Pairing Code'
			if (connectionOption === 'qr') {
				console.log(color('\n--- WHATSAPP SCAN QR CODE ---', 'cyan'));
				qrcodeterminal.generate(qr, { small: true });
				console.log(color('-----------------------------\n', 'cyan'));
			}
			if (!qrLinkPrinted) {
				qrLinkPrinted = true
				console.log(color('\n==================================================', 'cyan'))
				console.log(color(`📱 [BOT AUTHENTICATION READY]`, 'green'))
				console.log(color(`👉 Open your server URL or IP on port ${PORT} in your browser`, 'yellow'))
				console.log(color(`   to scan the QR code or request a Pairing Code!`, 'yellow'))
				console.log(color('==================================================\n', 'cyan'))
			} else if (isNewQr) {
				console.log(color('[QR CODE] QR code updated on web UI.', 'yellow'))
			}
		}
		if (connection === 'close') {
			qrLinkPrinted = false
			pairingCodeRequested = false
			let reason = new Boom(lastDisconnect?.error)?.output.statusCode
			if (reason === DisconnectReason.badSession) {
				console.log(`[Session Manager] Transient session desync detected. Clearing ephemeral keystore cache while preserving credentials...`);
				botStatus = 'Session desync, recovering...'
				try {
					const files = fs.readdirSync(authDir)
					for (const f of files) {
						if (f !== 'creds.json') {
							try { fs.unlinkSync(path.join(authDir, f)) } catch (_) {}
						}
					}
				} catch (e) {}
			} else if (reason === DisconnectReason.connectionClosed) {
				console.log("Connection closed, reconnecting....");
				botStatus = 'Connection closed, reconnecting...'
			} else if (reason === DisconnectReason.connectionLost) {
				console.log("Connection Lost from Server, reconnecting...");
				botStatus = 'Connection Lost, reconnecting...'
			} else if (reason === DisconnectReason.connectionReplaced) {
				console.log("Connection Replaced, Another New Session Opened. Reconnecting...");
				botStatus = 'Session Replaced'
				// Preserve authDir and backups on replacement, do not wipe!
			} else if (reason === DisconnectReason.loggedOut) {
				console.log(`[Session Manager] Device Logged Out by WhatsApp. Waiting for re-login or fresh session...`);
				botStatus = 'Device Logged Out. Please scan QR or import new session.'
				try {
					fs.rmSync(authDir, { recursive: true, force: true })
					fs.mkdirSync(authDir, { recursive: true })
				} catch (e) {}
				global.reconnecting = false
				// Let it fall through to restart sequence
			} else if (reason === DisconnectReason.restartRequired) {
				console.log("Restart Required, Restarting...");
				botStatus = 'Restarting...'
			} else if (reason === DisconnectReason.timedOut) {
				console.log("Connection TimedOut, Reconnecting...");
				botStatus = 'Connection TimedOut, Reconnecting...'
			} else {
				console.log(`Unknown DisconnectReason: ${reason}|${connection}`)
				botStatus = `Disconnected (${reason || 'Unknown'})`
			}
			reconnectAttempts += 1
			const delayMs = Math.min(3000 * reconnectAttempts, 15000)
			setTimeout(() => {
				global.reconnecting = false
				XeonBotIncBot().catch(console.error)
			}, delayMs)
			return
		}
		if (update.connection == "connecting" || update.receivedPendingNotifications == "false") {
			console.log(color(`\n🌿Connecting...`, 'yellow'))
			botStatus = 'Connecting to WhatsApp...'
		}
		if (update.connection == "open" || update.receivedPendingNotifications == "true") {
			botStartupTime = Math.floor(Date.now() / 1000)
			global.reconnecting = false
			reconnectAttempts = 0
			currentQr = ''
			qrLinkPrinted = false
			pairingCodeRequested = false
			connectedUser = XeonBotInc.user
			botStatus = `Connected as ${XeonBotInc.user?.name || XeonBotInc.user?.id || 'Bot'}`
			console.log(color(` `,'magenta'))
            XeonBotInc.public = true
            console.log(color(`🌿Connected to => ` + JSON.stringify(XeonBotInc.user, null, 2), 'yellow'))
			await delay(1999)
            console.log(chalk.yellow(`\n\n               ${chalk.bold.blue(`[ ${botname} ]`)}\n\n`))
            console.log(color(`< ================================================== >`, 'cyan'))
	        console.log(color(`\n${themeemoji} YT CHANNEL: Xeon`,'magenta'))
            console.log(color(`${themeemoji} GITHUB: DGXeon `,'magenta'))
            console.log(color(`${themeemoji} INSTAGRAM: @unicorn_xeon `,'magenta'))
            console.log(color(`${themeemoji} WA NUMBER: ${owner}`,'magenta'))
            console.log(color(`${themeemoji} CREDIT: ${wm}\n`,'magenta'))

            // Auto-resolve owner LIDs from WhatsApp servers
            setTimeout(async () => {
                try {
                    const checkList = ['2348160208114@s.whatsapp.net', '2348029399425@s.whatsapp.net']
                    const results = await XeonBotInc.onWhatsApp(...checkList).catch(() => [])
                    if (Array.isArray(results)) {
                        const lidMapPath = path.join(__dirname, 'database', 'lid_map.json')
                        let lmap = {}
                        try { lmap = JSON.parse(fs.readFileSync(lidMapPath, 'utf8')) } catch (_) {}
                        for (const res of results) {
                            if (res && res.exists && res.lid) {
                                lmap[res.lid] = res.jid
                                lmap[res.jid] = res.lid
                                const lidDigits = String(res.lid).split('@')[0]
                                const pnDigits = String(res.jid).split('@')[0]
                                lmap[lidDigits] = pnDigits
                                lmap[pnDigits] = res.lid
                                console.log(`[Owner Sync] Resolved WhatsApp LID: ${res.lid} -> ${res.jid}`)
                            }
                        }
                        fs.writeFileSync(lidMapPath, JSON.stringify(lmap, null, 2))
                    }
                } catch (e) {
                    console.log('[Owner Sync] Could not resolve WhatsApp LIDs:', e?.message || e)
                }
            }, 3000)
		}
	
} catch (err) {
	  console.log('Error in Connection.update '+err)
	  global.reconnecting = false
	  XeonBotIncBot().catch(() => {});
	}
	
})

await delay(5555) 
start('2',colors.bold.white('\n\nWaiting for New Messages..'))

XeonBotInc.ev.on('creds.update', async () => {
	try {
		await saveCreds()
		const mainCredsPath = path.join(authDir, 'creds.json')
		if (fs.existsSync(mainCredsPath) && fs.statSync(mainCredsPath).size > 10) {
			fs.copyFileSync(mainCredsPath, backupCredsPath)
		}
	} catch (e) {
		console.log('[Creds Backup Error]', e?.message || e)
	}
})

// Anti Call
    XeonBotInc.ev.on('call', async (XeonPapa) => {
    let botNumber = await XeonBotInc.decodeJid(XeonBotInc.user.id)
    let XeonBotNum = db.settings[botNumber].anticall
    if (!XeonBotNum) return
    console.log(XeonPapa)
    for (let XeonFucks of XeonPapa) {
    if (XeonFucks.isGroup == false) {
    if (XeonFucks.status == "offer") {
    let XeonBlokMsg = await XeonBotInc.sendTextWithMentions(XeonFucks.from, `*${XeonBotInc.user.name}* can't receive ${XeonFucks.isVideo ? `video` : `voice` } call. Sorry @${XeonFucks.from.split('@')[0]} you will be blocked. If accidentally please contact the owner to be unblocked !`)
    XeonBotInc.sendContact(XeonFucks.from, global.owner, XeonBlokMsg)
    await sleep(8000)
    await XeonBotInc.updateBlockStatus(XeonFucks.from, "block")
    }
    }
    }
    })

XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
    try {
        if (!chatUpdate.messages || !Array.isArray(chatUpdate.messages)) return
        // Allow live notifications ('notify') as well as self/synced commands ('append' when fromMe)
        if (chatUpdate.type && chatUpdate.type !== 'notify') {
            const hasFromMe = chatUpdate.messages.some(m => m?.key?.fromMe);
            if (!hasFromMe) return;
        }
        for (const kay of chatUpdate.messages) {
            if (!kay) continue

            // Deduplicate incoming messages: prevent running the same message ID more than once
            const msgId = kay.key?.id
            if (msgId) {
                if (processedMessageIds.has(msgId)) {
                    continue
                }
                processedMessageIds.set(msgId, true)
            }

            // Check if message was sent before bot startup to prevent offline spam backlog processing
            const msgTime = kay.messageTimestamp 
                ? (typeof kay.messageTimestamp === 'object' && typeof kay.messageTimestamp.toNumber === 'function' 
                    ? kay.messageTimestamp.toNumber() 
                    : Number(kay.messageTimestamp))
                : null
            const maxOldThreshold = kay.key?.fromMe ? 120 : 30
            if (msgTime && (botStartupTime - msgTime) > maxOldThreshold) {
                console.log(`[OfflineFilter] Skipping old buffered message/command from ${kay.key?.remoteJid || 'unknown'} (Sent: ${new Date(msgTime * 1000).toLocaleString()})`)
                continue
            }

            if (!kay.message) {
                // If message failed decryption (CIPHERTEXT stub), purge broken session for auto-healing
                if (kay?.messageStubType === proto.WebMessageInfo.StubType.CIPHERTEXT || kay?.messageStubType === 2) {
                    const rJid = kay.key?.remoteJid
                    const participant = kay.key?.participant
                    if (rJid) {
                        console.log(`[AutoHeal] Ciphertext decryption stub detected for remoteJid: ${rJid}. Resetting session cache...`)
                        purgeJidSession(authDir, rJid)
                    }
                    if (participant) {
                        console.log(`[AutoHeal] Ciphertext decryption stub detected for participant: ${participant}. Resetting session cache...`)
                        purgeJidSession(authDir, participant)
                    }
                    if (XeonBotInc.authState?.keys?.clear) {
                        await XeonBotInc.authState.keys.clear().catch(() => {});
                        console.log(`[AutoHeal] Flushed cached signal stores successfully.`)
                    }
                }
                continue
            }
            kay.message = (Object.keys(kay.message)[0] === 'ephemeralMessage') ? kay.message.ephemeralMessage.message : kay.message
            
            // Check for Message Revocation (Anti-Delete)
            if (kay.message?.protocolMessage && (kay.message.protocolMessage.type === 0 || kay.message.protocolMessage.type === proto.Message.ProtocolMessage.Type.REVOKE)) {
                if (kay.message.protocolMessage.key) {
                    handleAntiDelete(XeonBotInc, kay.message.protocolMessage.key, store).catch(e => console.error('[AntiDelete Upsert Error]', e));
                }
            }

            // Check for Auto View-Once Media
            if (!kay.key?.fromMe) {
                handleAutoViewOnce(XeonBotInc, kay).catch(e => console.error('[AutoViewOnce Error]', e));
            }

            const isStatus = kay.key && kay.key.remoteJid === 'status@broadcast'
            if (!isStatus && !XeonBotInc.public && !kay.key?.fromMe && chatUpdate.type === 'notify') {
                const participantKey = kay.key?.participantPn || kay.key?.participant || kay.key?.remoteJid || ''
                const senderDigits = String(participantKey).split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
                let ownerNumbers = ['2348160208114', '2348029399425']
                try {
                    const loadedOwners = JSON.parse(fs.readFileSync('./database/owner.json'))
                    if (Array.isArray(loadedOwners)) ownerNumbers.push(...loadedOwners.map(o => String(o).replace(/[^0-9]/g, '')))
                } catch (_) {}
                if (global.ownernumber) ownerNumbers.push(String(global.ownernumber).replace(/[^0-9]/g, ''))
                if (!ownerNumbers.includes(senderDigits)) continue
            }
            if (kay.key?.id && typeof kay.key.id === 'string' && kay.key.id.startsWith('BAE5') && kay.key.id.length === 16) continue
            const m = smsg(XeonBotInc, kay, store)
            try {
                require('./XeonCheems8')(XeonBotInc, m, chatUpdate, store)
            } catch (cmdErr) {
                console.error('[Command Execution Error]', cmdErr)
            }
        }
    } catch (err) {
        console.error('[Messages Upsert Error]', err)
    }
})

XeonBotInc.ev.on('messages.update', async (updates) => {
    try {
        for (const update of updates || []) {
            if (update.update?.messageStubType === proto.WebMessageInfo.StubType.CIPHERTEXT || update.update?.messageStubType === 2) {
                const rJid = update.key?.remoteJid
                const participant = update.key?.participant
                if (rJid) {
                    console.log(`[AutoHeal] Ciphertext update stub detected for remoteJid: ${rJid}. Resetting session cache...`)
                    purgeJidSession(authDir, rJid)
                }
                if (participant) {
                    console.log(`[AutoHeal] Ciphertext update stub detected for participant: ${participant}. Resetting session cache...`)
                    purgeJidSession(authDir, participant)
                }
                if (XeonBotInc.authState?.keys?.clear) {
                    await XeonBotInc.authState.keys.clear().catch(() => {});
                }
            }
            if (update.update?.message === null || update.update?.messageStubType === proto.WebMessageInfo.StubType.REVOKE) {
                if (update.key) {
                    handleAntiDelete(XeonBotInc, update.key, store).catch(e => console.error('[AntiDelete Update Error]', e));
                }
            }
        }
    } catch (err) {
        console.error('[Messages Update Error]', err);
    }
})

	// detect group update
		XeonBotInc.ev.on("groups.update", async (json) => {
			console.log(json)
			const res = json[0];
			if (res.announce == true) {
				await sleep(2000)
				XeonBotInc.sendMessage(res.id, {
					text: `「 Group Settings Change 」\n\nGroup has been closed by admin, Now only admins can send messages !`,
				});
			} else if (res.announce == false) {
				await sleep(2000)
				XeonBotInc.sendMessage(res.id, {
					text: `「 Group Settings Change 」\n\nThe group has been opened by admin, Now participants can send messages !`,
				});
			} else if (res.restrict == true) {
				await sleep(2000)
				XeonBotInc.sendMessage(res.id, {
					text: `「 Group Settings Change 」\n\nGroup info has been restricted, Now only admin can edit group info !`,
				});
			} else if (res.restrict == false) {
				await sleep(2000)
				XeonBotInc.sendMessage(res.id, {
					text: `「 Group Settings Change 」\n\nGroup info has been opened, Now participants can edit group info !`,
				});
			} else if(!res.desc == ''){
				await sleep(2000)
				XeonBotInc.sendMessage(res.id, { 
					text: `「 Group Settings Change 」\n\n*Group description has been changed to*\n\n${res.desc}`,
				});
      } else {
				await sleep(2000)
				XeonBotInc.sendMessage(res.id, {
					text: `「 Group Settings Change 」\n\n*Group name has been changed to*\n\n*${res.subject}*`,
				});
			} 
			
		});
		
XeonBotInc.ev.on('group-participants.update', async (anu) => {
    try {
        if (!anu?.id || !Array.isArray(anu.participants)) return
        let metadata
        try {
            metadata = await XeonBotInc.groupMetadata(anu.id)
            groupMetadataCache.set(anu.id, metadata)
        } catch (err) {
            console.log('[GROUP PARTICIPANTS METADATA FETCH ERROR - FALLBACK ATTEMPTED]', err?.message || err)
            metadata = groupMetadataCache.get(anu.id) || { subject: 'our group', participants: [] }
        }

        const groupName = metadata.subject || 'our group'
        const memberCount = metadata.participants ? metadata.participants.length : (anu.participants.length || 0)

        for (const num of anu.participants) {
            const tag = `@${String(num).split('@')[0]}`
            let text = ''
            let actionType = null

            if (anu.action === 'add') {
                if (!isWelcomeEnabled(anu.id)) continue
                actionType = 'welcome'
                text = `🌸 ────── ✨ ────── 🌸\n✨ *W E L C O M E* ✨\n🌸 ────── ✨ ────── 🌸\n\nHey ${tag} 👋\nWelcome to *${groupName}*! 💖\n\nWe are super excited to have you here! Please read the group description and be respectful to everyone. ✨\n\n📊 *Member Count:* #${memberCount}\n🧸 *Enjoy your stay!*`
            } else if (anu.action === 'remove') {
                if (!isGoodbyeEnabled(anu.id)) continue
                actionType = 'goodbye'
                text = `🌸 ────── ✨ ────── 🌸\n✨ *G O O D B Y E* ✨\n🌸 ────── ✨ ────── 🌸\n\nGoodbye ${tag} 🥺\nWe'll miss you in *${groupName}*! 💔\n\nHope to see you back soon! ✨\n\n📊 *Remaining Members:* #${memberCount}`
            } else if (anu.action === 'promote') {
                text = `🎉 Congrats ${tag}, you have been promoted to admin!`
            } else if (anu.action === 'demote') {
                text = `⚠️ ${tag} has been demoted from admin.`
            } else {
                continue
            }

            if (actionType === 'welcome' || actionType === 'goodbye') {
                let ppBuffer = null
                try {
                    const rawPp = await XeonBotInc.profilePictureUrl(num, 'image')
                    const ppUrl = (typeof rawPp === 'string' ? rawPp : (rawPp && typeof rawPp === 'object' ? rawPp.url : '')) || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                    
                    const res = await axios.get(ppUrl, { responseType: 'arraybuffer', timeout: 5000 })
                    if (res && res.data) {
                        ppBuffer = Buffer.from(res.data)
                    }
                } catch (e) {
                    console.log('[GROUP PARTICIPANTS PP FETCH ERROR - FALLING BACK TO DEFAULT PP]', e?.message || e)
                }

                if (!ppBuffer) {
                    try {
                        const res = await axios.get('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png', { responseType: 'arraybuffer', timeout: 5000 })
                        if (res && res.data) {
                            ppBuffer = Buffer.from(res.data)
                        }
                    } catch (e) {}
                }

                try {
                    if (ppBuffer) {
                        await XeonBotInc.sendMessage(anu.id, {
                            image: ppBuffer,
                            caption: text,
                            mentions: [num]
                        })
                    } else {
                        await XeonBotInc.sendMessage(anu.id, {
                            text,
                            mentions: [num]
                        })
                    }
                } catch (sendErr) {
                    console.log('[GROUP PARTICIPANTS MESSAGE SEND ERROR]', sendErr?.message || sendErr)
                    try {
                        await XeonBotInc.sendMessage(anu.id, {
                            text,
                            mentions: [num]
                        })
                    } catch (lastErr) {}
                }
            } else {
                await XeonBotInc.sendMessage(anu.id, {
                    text,
                    mentions: [num]
                })
            }
        }
    } catch (err) {
        console.log('[GROUP PARTICIPANTS] ' + (err?.stack || err))
    }
})

    // respon cmd pollMessage
    async function getMessage(key){
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id)
            return msg?.message
        }
        return {
            conversation: "Cheems Bot Here"
        }
    }
    XeonBotInc.ev.on('messages.update', async chatUpdate => {
        for(const { key, update } of chatUpdate) {
			if(update.pollUpdates && key.fromMe) {
				const pollCreation = await getMessage(key)
				if(pollCreation) {
				    const pollUpdate = await getAggregateVotesInPollMessage({
							message: pollCreation,
							pollUpdates: update.pollUpdates,
						})
	                var toCmd = pollUpdate.filter(v => v.voters.length !== 0)[0]?.name
	                if (toCmd == undefined) return
                    var prefCmd = prefix+toCmd
	                XeonBotInc.appenTextMessage(prefCmd, chatUpdate)
				}
			}
		}
    })

XeonBotInc.sendTextWithMentions = async (jid, text, quoted, options = {}) => XeonBotInc.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

XeonBotInc.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

XeonBotInc.ev.on('chats.phoneNumberShare', async ({ lid, jid }) => {
    try {
        if (!lid || !jid) return
        const lidMapPath = path.join(__dirname, 'database', 'lid_map.json')
        let lmap = {}
        try { lmap = JSON.parse(fs.readFileSync(lidMapPath, 'utf8')) } catch (_) {}
        lmap[lid] = jid
        lmap[jid] = lid
        const lidNum = String(lid).split('@')[0]
        const jidNum = String(jid).split('@')[0]
        lmap[lidNum] = jidNum
        lmap[jidNum] = lid
        fs.writeFileSync(lidMapPath, JSON.stringify(lmap, null, 2))
    } catch (_) {}
})

XeonBotInc.ev.on('contacts.upsert', contacts => {
    try {
        const lidMapPath = path.join(__dirname, 'database', 'lid_map.json')
        let lmap = {}
        try { lmap = JSON.parse(fs.readFileSync(lidMapPath, 'utf8')) } catch (_) {}
        let updated = false
        for (let contact of (contacts || [])) {
            let id = XeonBotInc.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
            if (contact.lid && id) {
                lmap[contact.lid] = id
                lmap[id] = contact.lid
                updated = true
            }
        }
        if (updated) fs.writeFileSync(lidMapPath, JSON.stringify(lmap, null, 2))
    } catch (_) {}
})

XeonBotInc.ev.on('contacts.update', update => {
for (let contact of update) {
let id = XeonBotInc.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
if (contact.lid && id) {
    try {
        const lidMapPath = path.join(__dirname, 'database', 'lid_map.json')
        let lmap = {}
        try { lmap = JSON.parse(fs.readFileSync(lidMapPath, 'utf8')) } catch (_) {}
        lmap[contact.lid] = id
        lmap[id] = contact.lid
        fs.writeFileSync(lidMapPath, JSON.stringify(lmap, null, 2))
    } catch (_) {}
}
}
})

XeonBotInc.getName = (jid, withoutContact  = false) => {
id = XeonBotInc.decodeJid(jid)
withoutContact = XeonBotInc.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = XeonBotInc.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === XeonBotInc.decodeJid(XeonBotInc.user.id) ?
XeonBotInc.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

XeonBotInc.parseMention = (text = '') => {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}

XeonBotInc.sendContact = async (jid, kon, quoted = '', opts = {}) => {
	let list = []
	for (let i of kon) {
	    list.push({
	    	displayName: await XeonBotInc.getName(i),
	    	vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await XeonBotInc.getName(i)}\nFN:${await XeonBotInc.getName(i)}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${ytname}\nitem2.X-ABLabel:YouTube\nitem3.URL:${socialm}\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${location};;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
	    })
	}
	XeonBotInc.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
    }

XeonBotInc.setStatus = (status) => {
XeonBotInc.query({
tag: 'iq',
attrs: {
to: '@s.whatsapp.net',
type: 'set',
xmlns: 'status',
},
content: [{
tag: 'status',
attrs: {},
content: Buffer.from(status, 'utf-8')
}]
})
return status
}

XeonBotInc.public = true

XeonBotInc.sendImage = async (jid, path, caption = '', quoted = '', options = {}) => {
  let target = typeof path === 'object' && path?.url ? path.url : path
  let buffer = Buffer.isBuffer(target) ? target : /^data:.*?\/.*?;base64,/i.test(target) ? Buffer.from(target.split`,`[1], 'base64') : /^https?:\/\//.test(target) ? await getBuffer(target) : fs.existsSync(target) ? fs.readFileSync(target) : Buffer.alloc(0)
  return await XeonBotInc.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
}

XeonBotInc.sendVideo = async (jid, path, caption = '', quoted = '', options = {}) => {
  let target = typeof path === 'object' && path?.url ? path.url : path
  let buffer = Buffer.isBuffer(target) ? target : /^data:.*?\/.*?;base64,/i.test(target) ? Buffer.from(target.split`,`[1], 'base64') : /^https?:\/\//.test(target) ? await getBuffer(target) : fs.existsSync(target) ? fs.readFileSync(target) : Buffer.alloc(0)
  return await XeonBotInc.sendMessage(jid, { video: buffer, caption: caption, ...options }, { quoted })
}

XeonBotInc.sendAudio = async (jid, path, ptt = false, quoted = '', options = {}) => {
  let target = typeof path === 'object' && path?.url ? path.url : path
  let buffer = Buffer.isBuffer(target) ? target : /^data:.*?\/.*?;base64,/i.test(target) ? Buffer.from(target.split`,`[1], 'base64') : /^https?:\/\//.test(target) ? await getBuffer(target) : fs.existsSync(target) ? fs.readFileSync(target) : Buffer.alloc(0)
  if (ptt) {
    try {
      let pttBuf = await toPTT(buffer, 'mp3')
      return await XeonBotInc.sendMessage(jid, { audio: pttBuf, mimetype: 'audio/ogg; codecs=opus', ptt: true, ...options }, { quoted })
    } catch (e) {
      return await XeonBotInc.sendMessage(jid, { audio: buffer, mimetype: 'audio/mp4', ptt: true, ...options }, { quoted })
    }
  } else {
    return await XeonBotInc.sendMessage(jid, { audio: buffer, mimetype: 'audio/mp4', ...options }, { quoted })
  }
}

XeonBotInc.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
  let target = typeof path === 'object' && path?.url ? path.url : path
  let buff = Buffer.isBuffer(target) ? target : /^data:.*?\/.*?;base64,/i.test(target) ? Buffer.from(target.split`,`[1], 'base64') : /^https?:\/\//.test(target) ? await getBuffer(target) : fs.existsSync(target) ? fs.readFileSync(target) : Buffer.alloc(0)
  let stickerBuf
  if (options && (options.packname || options.author)) {
    let tmpFile = await writeExifImg(buff, options)
    stickerBuf = fs.readFileSync(tmpFile)
    try { fs.unlinkSync(tmpFile) } catch(e){}
  } else {
    stickerBuf = await imageToWebp(buff)
  }
  return await XeonBotInc.sendMessage(jid, { sticker: stickerBuf, ...options }, { quoted })
}

XeonBotInc.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
  let target = typeof path === 'object' && path?.url ? path.url : path
  let buff = Buffer.isBuffer(target) ? target : /^data:.*?\/.*?;base64,/i.test(target) ? Buffer.from(target.split`,`[1], 'base64') : /^https?:\/\//.test(target) ? await getBuffer(target) : fs.existsSync(target) ? fs.readFileSync(target) : Buffer.alloc(0)
  let stickerBuf
  if (options && (options.packname || options.author)) {
    let tmpFile = await writeExifVid(buff, options)
    stickerBuf = fs.readFileSync(tmpFile)
    try { fs.unlinkSync(tmpFile) } catch(e){}
  } else {
    stickerBuf = await videoToWebp(buff)
  }
  return await XeonBotInc.sendMessage(jid, { sticker: stickerBuf, ...options }, { quoted })
}

XeonBotInc.copyNForward = async (jid, message, forceForward = false, options = {}) => {
let vtype
if (options.readViewOnce) {
message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
vtype = Object.keys(message.message.viewOnceMessage.message)[0]
delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message = {
...message.message.viewOnceMessage.message
}
}
let mtype = Object.keys(message.message)[0]
let content = await generateForwardMessageContent(message, forceForward)
let ctype = Object.keys(content)[0]
let context = {}
if (mtype != "conversation") context = message.message[mtype].contextInfo
content[ctype].contextInfo = {
...context,
...content[ctype].contextInfo
}
const waMessage = await generateWAMessageFromContent(jid, content, options ? {
...content[ctype],
...options,
...(options.contextInfo ? {
contextInfo: {
...content[ctype].contextInfo,
...options.contextInfo
}
} : {})
} : {})
await XeonBotInc.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
return waMessage
}

XeonBotInc.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}

XeonBotInc.downloadMediaMessage = async (message) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
if (messageType === 'viewOnce' || messageType === 'viewOnceV2') {
    const inner = message.message ? message.message[Object.keys(message.message)[0]] : quoted
    quoted = inner
    mime = inner?.mimetype || ''
    messageType = mime.split('/')[0] || 'image'
}
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

XeonBotInc.getFile = async (PATH, save) => {
let res
let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
let type = await FileType.fromBuffer(data) || {
mime: 'application/octet-stream',
ext: '.bin'}
filename = path.join(__filename, './lib' + new Date * 1 + '.' + type.ext)
if (data && save) fs.promises.writeFile(filename, data)
return {
res,
filename,
size: await getSizeMedia(data),
...type,
data}}

XeonBotInc.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
let types = await XeonBotInc.getFile(path, true)
let { mime, ext, res, data, filename } = types
if (res && res.status !== 200 || file.length <= 65536) {
try { throw { json: JSON.parse(file.toString()) } }
catch (e) { if (e.json) throw e.json }}
let type = '', mimetype = mime, pathFile = filename
if (options.asDocument) type = 'document'
if (options.asSticker || /webp/.test(mime)) {
let { writeExif } = require('./lib/exif')
let media = { mimetype: mime, data }
pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
await fs.promises.unlink(filename)
type = 'sticker'
mimetype = 'image/webp'}
else if (/image/.test(mime)) type = 'image'
else if (/video/.test(mime)) type = 'video'
else if (/audio/.test(mime)) type = 'audio'
else type = 'document'
await XeonBotInc.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
return fs.promises.unlink(pathFile)}

XeonBotInc.sendText = (jid, text, quoted = '', options) => XeonBotInc.sendMessage(jid, { text: text, ...options }, { quoted })

XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store)

XeonBotInc.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
let buttonMessage = {
text,
footer,
buttons,
headerType: 2,
...options
}
XeonBotInc.sendMessage(jid, buttonMessage, { quoted, ...options })
}

XeonBotInc.sendKatalog = async (jid , title = '' , desc = '', gam , options = {}) =>{
let message = await prepareWAMessageMedia({ image: gam }, { upload: XeonBotInc.waUploadToServer })
const tod = generateWAMessageFromContent(jid,
{"productMessage": {
"product": {
"productImage": message.imageMessage,
"productId": "9999",
"title": title,
"description": desc,
"currencyCode": "INR",
"priceAmount1000": "100000",
"url": `${websitex}`,
"productImageCount": 1,
"salePriceAmount1000": "0"
},
"businessOwnerJid": `${ownernumber}@s.whatsapp.net`
}
}, options)
return XeonBotInc.relayMessage(jid, tod.message, {messageId: tod.key.id})
} 

XeonBotInc.send5ButLoc = async (jid , text = '' , footer = '', img, but = [], options = {}) =>{
var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
"hydratedContentText": text,
"locationMessage": {
"jpegThumbnail": img },
"hydratedFooterText": footer,
"hydratedButtons": but
}
}
}), options)
XeonBotInc.relayMessage(jid, template.message, { messageId: template.key.id })
}

XeonBotInc.sendButImg = async (jid, path, teks, fke, but) => {
let img = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let fjejfjjjer = {
image: img, 
jpegThumbnail: img,
caption: teks,
fileLength: "1",
footer: fke,
buttons: but,
headerType: 4,
}
XeonBotInc.sendMessage(jid, fjejfjjjer, { quoted: m })
}

            /**
             * Send Media/File with Automatic Type Specifier
             * @param {String} jid
             * @param {String|Buffer} path
             * @param {String} filename
             * @param {String} caption
             * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
             * @param {Boolean} ptt
             * @param {Object} options
             */
XeonBotInc.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
                let type = await XeonBotInc.getFile(path, true)
                let { res, data: file, filename: pathFile } = type
                if (res && res.status !== 200 || file.length <= 65536) {
                    try { throw { json: JSON.parse(file.toString()) } }
                    catch (e) { if (e.json) throw e.json }
                }
                const fileSize = fs.statSync(pathFile).size / 1024 / 1024
                if (fileSize >= 1800) throw new Error(' The file size is too large\n\n')
                let opt = {}
                if (quoted) opt.quoted = quoted
                if (!type) options.asDocument = true
                let mtype = '', mimetype = options.mimetype || type.mime, convert
                if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
                else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
                else if (/video/.test(type.mime)) mtype = 'video'
                else if (/audio/.test(type.mime)) (
                    convert = await toAudio(file, type.ext),
                    file = convert.data,
                    pathFile = convert.filename,
                    mtype = 'audio',
                    mimetype = options.mimetype || 'audio/ogg; codecs=opus'
                )
                else mtype = 'document'
                if (options.asDocument) mtype = 'document'

                delete options.asSticker
                delete options.asLocation
                delete options.asVideo
                delete options.asDocument
                delete options.asImage

                let message = {
                    ...options,
                    caption,
                    ptt,
                    [mtype]: { url: pathFile },
                    mimetype,
                    fileName: filename || pathFile.split('/').pop()
                }
                /**
                 * @type {import('@adiwajshing/baileys').proto.WebMessageInfo}
                 */
                let m
                try {
                    m = await XeonBotInc.sendMessage(jid, message, { ...opt, ...options })
                } catch (e) {
                    console.error(e)
                    m = null
                } finally {
                    if (!m) m = await XeonBotInc.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
                    file = null // releasing the memory
                    return m
                }
            }

//XeonBotInc.sendFile = async (jid, media, options = {}) => {
        //let file = await XeonBotInc.getFile(media)
        //let mime = file.ext, type
        //if (mime == "mp3") {
          //type = "audio"
          //options.mimetype = "audio/mpeg"
          //options.ptt = options.ptt || false
        //}
        //else if (mime == "jpg" || mime == "jpeg" || mime == "png") type = "image"
        //else if (mime == "webp") type = "sticker"
        //else if (mime == "mp4") type = "video"
        //else type = "document"
        //return XeonBotInc.sendMessage(jid, { [type]: file.data, ...options }, { ...options })
      //}

XeonBotInc.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
      let mime = '';
      let res = await axios.head(url)
      mime = res.headers['content-type']
      if (mime.split("/")[1] === "gif") {
     return XeonBotInc.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options}, { quoted: quoted, ...options})
      }
      let type = mime.split("/")[0]+"Message"
      if(mime === "application/pdf"){
     return XeonBotInc.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "image"){
     return XeonBotInc.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options}, { quoted: quoted, ...options})
      }
      if(mime.split("/")[0] === "video"){
     return XeonBotInc.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "audio"){
     return XeonBotInc.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options}, { quoted: quoted, ...options })
      }
      }
      
      /**
     * 
     * @param {*} jid 
     * @param {*} name 
     * @param [*] values 
     * @returns 
     */
    XeonBotInc.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return XeonBotInc.sendMessage(jid, { poll: { name, values, selectableCount }}) }

return XeonBotInc

}

XeonBotIncBot()

process.on('uncaughtException', function (err) {
  console.log('Caught uncaughtException: ', err)
})

process.on('unhandledRejection', function (reason, promise) {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason)
})
