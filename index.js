const { modul } = require('./module');
const moment = require('moment-timezone');
const { baileys, boom, chalk, fs, figlet, FileType, path, pino, process, PhoneNumber, axios, yargs, _, qrcodeterminal } = modul;
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

// Global log/error interceptors to dynamically heal WhatsApp session decryption / Bad MAC errors in real-time
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

function checkAndHealError(msg) {
    if (msg.includes('Bad MAC') || msg.includes('Failed to decrypt') || msg.includes('decryption') || msg.includes('session error')) {
        originalConsoleLog('[AutoHeal-Signal] Intercepted crypto/decryption error. Triggering cache purge...');
        
        // Extract JIDs to purge specific session files
        const jidRegex = /[0-9\-_]+@s\.whatsapp\.net|[0-9\-_]+@g\.us/g;
        const matches = msg.match(jidRegex);
        if (matches && global.authDir) {
            for (const jid of matches) {
                originalConsoleLog(`[AutoHeal-Signal] Dynamically purging desynced session for JID: ${jid}`);
                purgeJidSession(global.authDir, jid);
            }
        }
        
        // Clear in-memory keys cache if XeonBotInc is defined
        if (global.XeonBotInc && global.XeonBotInc.authState?.keys?.clear) {
            global.XeonBotInc.authState.keys.clear().catch(() => {});
            originalConsoleLog('[AutoHeal-Signal] Flushed in-memory key cache successfully.');
        }
    }
}

console.error = function (...args) {
    originalConsoleError.apply(console, args);
    try {
        const msg = args.map(arg => (arg instanceof Error ? arg.message + ' ' + arg.stack : String(arg))).join(' ');
        checkAndHealError(msg);
    } catch (_) {}
};

console.warn = function (...args) {
    originalConsoleWarn.apply(console, args);
    try {
        const msg = args.map(arg => (arg instanceof Error ? arg.message + ' ' + arg.stack : String(arg))).join(' ');
        checkAndHealError(msg);
    } catch (_) {}
};

console.log = function (...args) {
    originalConsoleLog.apply(console, args);
    try {
        const msg = args.map(arg => String(arg)).join(' ');
        if (msg.includes('Bad MAC') || msg.includes('Failed to decrypt')) {
            checkAndHealError(msg);
        }
    } catch (_) {}
};

const prefix = ''

const botStartupTime = Math.floor(Date.now() / 1000)

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

// Lightweight HTTP server on process.env.PORT || 3000 for platform health check & preview
const httpApp = express()
const PORT = process.env.PORT || 3000

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

httpApp.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cheems Bot MD - Authentication</title>
  <style>
    body { background: #0d1117; color: #e6edf3; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 16px; box-sizing: border-box; }
    .card { background: #161b22; padding: 28px 36px; border-radius: 12px; border: 1px solid #30363d; text-align: center; max-width: 460px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    h1 { color: #3fb950; margin: 0 0 12px 0; font-size: 22px; }
    p { color: #8b949e; font-size: 14px; line-height: 1.4; margin: 6px 0; }
    .tab-btn { background: #21262d; border: 1px solid #30363d; color: #c9d1d9; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; margin: 4px; }
    .tab-btn.active { background: #238636; border-color: #2e9e44; color: #fff; }
    .qr-container { margin: 16px 0; padding: 14px; background: #ffffff; border-radius: 10px; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .qr-container img { display: block; width: 280px; height: 280px; margin: 0 auto; border: none; }
    .status { font-weight: 600; font-size: 15px; margin-top: 10px; }
    .badge { display: inline-block; background: #238636; color: #fff; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; margin-top: 14px; }
    .pair-box { margin-top: 16px; text-align: left; }
    .pair-input { width: 100%; padding: 10px 12px; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; color: #fff; font-size: 14px; box-sizing: border-box; margin-bottom: 10px; }
    .pair-btn { width: 100%; padding: 10px; background: #238636; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; }
    .code-display { background: #0d1117; border: 1px solid #238636; color: #3fb950; font-family: monospace; font-size: 24px; font-weight: bold; letter-spacing: 2px; padding: 12px; border-radius: 6px; text-align: center; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🤖 Cheems Bot MD</h1>
    <div id="statusText" class="status">Connecting...</div>

    <div style="margin-top: 14px;">
      <button id="tabQrBtn" class="tab-btn active" onclick="switchTab('qr')">QR Scan</button>
      <button id="tabPairBtn" class="tab-btn" onclick="switchTab('pair')">Pairing Code</button>
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

    <div class="badge">BOT ACTIVE</div>
  </div>

  <script>
    function switchTab(mode) {
      document.getElementById('tabQrBtn').classList.toggle('active', mode === 'qr');
      document.getElementById('tabPairBtn').classList.toggle('active', mode === 'pair');
      document.getElementById('qrSection').style.display = mode === 'qr' ? 'block' : 'none';
      document.getElementById('pairSection').style.display = mode === 'pair' ? 'block' : 'none';
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
	if (global.reconnecting) return
	global.reconnecting = true
	const authDir = path.join(__dirname, global.sessionName || 'session')
	global.authDir = authDir
	const backupCredsPath = path.join(__dirname, 'database', 'session_creds_backup.json')

	// Auto-restore credentials from persistent backup if main session creds is missing or empty
	try {
		if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true })
		const mainCredsPath = path.join(authDir, 'creds.json')
		if ((!fs.existsSync(mainCredsPath) || fs.statSync(mainCredsPath).size === 0) && fs.existsSync(backupCredsPath)) {
			console.log(color('[Session Restore] Restoring credentials from persistent backup...', 'cyan'))
			fs.copyFileSync(backupCredsPath, mainCredsPath)
		}
	} catch (e) {
		console.log('[Session Backup Restore Error]', e?.message || e)
	}

	try {
		repairSessionFolder(authDir, { prunePreKeys: true })
	} catch (e) {
		console.log('[Session Init Cleaner]', e?.message || e)
	}
	const { saveCreds, state } = await useMultiFileAuthState(authDir)
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
	const usePairingCode = global.usePairingCode !== false || process.argv.includes('--pairing-code')
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

    if (!storeBound) {
        store.bind(XeonBotInc.ev)
        storeBound = true
    }
    XeonBotInc.public = true

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
				console.log(`Bad Session File, Purging and Starting Fresh...`);
				botStatus = 'Bad Session File'
				try {
					fs.rmSync(authDir, { recursive: true, force: true })
					fs.mkdirSync(authDir, { recursive: true })
					if (fs.existsSync(backupCredsPath)) fs.unlinkSync(backupCredsPath)
				} catch (e) {}
			} else if (reason === DisconnectReason.connectionClosed) {
				console.log("Connection closed, reconnecting....");
				botStatus = 'Connection closed, reconnecting...'
			} else if (reason === DisconnectReason.connectionLost) {
				console.log("Connection Lost from Server, reconnecting...");
				botStatus = 'Connection Lost, reconnecting...'
			} else if (reason === DisconnectReason.connectionReplaced) {
				console.log("Connection Replaced, Another New Session Opened. Purging local state and restarting fresh...");
				botStatus = 'Session Replaced'
				try {
					fs.rmSync(authDir, { recursive: true, force: true })
					fs.mkdirSync(authDir, { recursive: true })
					if (fs.existsSync(backupCredsPath)) fs.unlinkSync(backupCredsPath)
				} catch (e) {}
			} else if (reason === DisconnectReason.loggedOut) {
				console.log(`Device Logged Out, Purging Session and Restarting...`);
				botStatus = 'Device Logged Out'
				try {
					fs.rmSync(authDir, { recursive: true, force: true })
					fs.mkdirSync(authDir, { recursive: true })
					if (fs.existsSync(backupCredsPath)) fs.unlinkSync(backupCredsPath)
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

let pairingRequested = false

XeonBotInc.ev.on('connection.update', async (update) => {
	if (update.qr && !pairingRequested && !XeonBotInc.authState?.creds?.registered) {
		pairingRequested = true
		try {
			const number = (global.ownernumber || '').replace(/\D/g, '')
			const pairingCode = number ? await XeonBotInc.requestPairingCode(number) : null
			if (pairingCode) {
				console.log(color(`\n🔗 Pairing code: ${pairingCode}`, 'green'))
				console.log(color('Open WhatsApp > Link a device > Link with phone number instead of QR.', 'yellow'))
			}
		} catch (err) {
			console.log(color('Pairing code request failed: ' + err.message, 'yellow'))
		}
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
        for (const kay of chatUpdate.messages) {
            if (!kay) continue

            // Check if message was sent before bot startup to prevent offline spam backlog processing
            const msgTime = kay.messageTimestamp 
                ? (typeof kay.messageTimestamp === 'object' && typeof kay.messageTimestamp.toNumber === 'function' 
                    ? kay.messageTimestamp.toNumber() 
                    : Number(kay.messageTimestamp))
                : null
            if (msgTime && (botStartupTime - msgTime) > 15) {
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

            if (kay.key && kay.key.remoteJid === 'status@broadcast') {
                await XeonBotInc.readMessages([kay.key])
                continue
            }
            if (!XeonBotInc.public && !kay.key?.fromMe && chatUpdate.type === 'notify') continue
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

XeonBotInc.ev.on('contacts.update', update => {
for (let contact of update) {
let id = XeonBotInc.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
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
