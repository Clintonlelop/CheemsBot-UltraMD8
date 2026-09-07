const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage, proto, getContentType } = require('@whiskeysockets/baileys');

const VIEWONCE_CONFIG_FILE = path.join(__dirname, '..', 'database', 'viewonce.json');
const ANTIDELETE_CONFIG_FILE = path.join(__dirname, '..', 'database', 'antidelete.json');
const OWNER_FILE = path.join(__dirname, '..', 'database', 'owner.json');

// Ensure database directory exists
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
    try { fs.mkdirSync(dbDir, { recursive: true }); } catch (e) {}
}

/**
 * Load View-Once Configuration
 */
function loadViewOnceConfig() {
    try {
        if (!fs.existsSync(VIEWONCE_CONFIG_FILE)) {
            const initial = {
                enabled: true,
                revealInChat: true, // Reveal directly in group/chat where sent
                forwardToDm: true    // Forward secretly to owner DM
            };
            fs.writeFileSync(VIEWONCE_CONFIG_FILE, JSON.stringify(initial, null, 2));
            return initial;
        }
        const cfg = JSON.parse(fs.readFileSync(VIEWONCE_CONFIG_FILE, 'utf8'));
        if (cfg.enabled === undefined) cfg.enabled = true;
        if (cfg.revealInChat === undefined) cfg.revealInChat = true;
        if (cfg.forwardToDm === undefined) cfg.forwardToDm = true;
        return cfg;
    } catch (e) {
        return { enabled: true, revealInChat: true, forwardToDm: true };
    }
}

/**
 * Save View-Once Configuration
 */
function saveViewOnceConfig(config) {
    try {
        fs.writeFileSync(VIEWONCE_CONFIG_FILE, JSON.stringify(config, null, 2));
        return true;
    } catch (e) {
        console.error('[ViewOnce Config Error]', e);
        return false;
    }
}

/**
 * Load Anti-Delete Configuration
 */
function loadAntiDeleteConfig() {
    try {
        if (!fs.existsSync(ANTIDELETE_CONFIG_FILE)) {
            const initial = {
                enabled: true,
                revealInChat: true, // Resend deleted message in the group/chat
                forwardToDm: false  // Forward deleted message to owner DM
            };
            fs.writeFileSync(ANTIDELETE_CONFIG_FILE, JSON.stringify(initial, null, 2));
            return initial;
        }
        const cfg = JSON.parse(fs.readFileSync(ANTIDELETE_CONFIG_FILE, 'utf8'));
        if (cfg.enabled === undefined) cfg.enabled = true;
        if (cfg.revealInChat === undefined) cfg.revealInChat = true;
        if (cfg.forwardToDm === undefined) cfg.forwardToDm = false;
        return cfg;
    } catch (e) {
        return { enabled: true, revealInChat: true, forwardToDm: false };
    }
}

/**
 * Save Anti-Delete Configuration
 */
function saveAntiDeleteConfig(config) {
    try {
        fs.writeFileSync(ANTIDELETE_CONFIG_FILE, JSON.stringify(config, null, 2));
        return true;
    } catch (e) {
        console.error('[AntiDelete Config Error]', e);
        return false;
    }
}

/**
 * Get Primary Owner JID
 */
function getOwnerJid() {
    try {
        if (fs.existsSync(OWNER_FILE)) {
            const owners = JSON.parse(fs.readFileSync(OWNER_FILE, 'utf8'));
            if (Array.isArray(owners) && owners.length > 0) {
                const clean = String(owners[0]).replace(/\D/g, '');
                if (clean) return clean + '@s.whatsapp.net';
            }
        }
        if (global.owner && Array.isArray(global.owner) && global.owner.length > 0) {
            const clean = String(global.owner[0]).replace(/\D/g, '');
            if (clean) return clean + '@s.whatsapp.net';
        }
    } catch (e) {}
    return null;
}

/**
 * Extract Media Stream into Buffer
 */
async function downloadMediaBuffer(mediaMsg, mediaType) {
    try {
        const stream = await downloadContentFromMessage(mediaMsg, mediaType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
    } catch (err) {
        console.error(`[Download Media Buffer Error (${mediaType})]`, err?.message || err);
        return null;
    }
}

/**
 * Inspect and extract View-Once inner message
 */
function extractViewOnceMessage(rawMessage) {
    if (!rawMessage) return null;
    let msg = rawMessage;
    if (msg.ephemeralMessage) msg = msg.ephemeralMessage.message;
    if (msg.documentWithCaptionMessage) msg = msg.documentWithCaptionMessage.message;

    let voType = null;
    let inner = null;

    if (msg.viewOnceMessage) {
        inner = msg.viewOnceMessage.message;
        voType = 'viewOnceMessage';
    } else if (msg.viewOnceMessageV2) {
        inner = msg.viewOnceMessageV2.message;
        voType = 'viewOnceMessageV2';
    } else if (msg.viewOnceMessageV2Extension) {
        inner = msg.viewOnceMessageV2Extension.message;
        voType = 'viewOnceMessageV2Extension';
    } else if (msg.imageMessage?.viewOnce) {
        inner = { imageMessage: msg.imageMessage };
        voType = 'imageMessage';
    } else if (msg.videoMessage?.viewOnce) {
        inner = { videoMessage: msg.videoMessage };
        voType = 'videoMessage';
    } else if (msg.audioMessage?.viewOnce) {
        inner = { audioMessage: msg.audioMessage };
        voType = 'audioMessage';
    }

    if (!inner) return null;

    const mediaKey = Object.keys(inner)[0];
    const mediaObj = inner[mediaKey];
    if (!mediaObj) return null;

    let type = 'image';
    if (mediaKey.includes('video')) type = 'video';
    else if (mediaKey.includes('audio')) type = 'audio';
    else if (mediaKey.includes('image')) type = 'image';
    else if (mediaKey.includes('document')) type = 'document';

    return {
        voType,
        mediaKey,
        mediaObj,
        type,
        caption: mediaObj.caption || '',
        mimetype: mediaObj.mimetype || (type === 'image' ? 'image/jpeg' : type === 'video' ? 'video/mp4' : 'audio/mp4')
    };
}

/**
 * Handle Auto View Once
 */
async function handleAutoViewOnce(conn, rawMsg) {
    try {
        if (!conn || !rawMsg || !rawMsg.message) return;
        const voData = extractViewOnceMessage(rawMsg.message);
        if (!voData) return;

        const config = loadViewOnceConfig();
        if (!config.enabled) return;
        if (!config.revealInChat && !config.forwardToDm) return;

        const sender = conn.decodeJid(rawMsg.key?.participant || rawMsg.key?.remoteJid || '');
        const chat = rawMsg.key?.remoteJid;
        const isGroup = Boolean(chat && chat.endsWith('@g.us'));
        const buffer = await downloadMediaBuffer(voData.mediaObj, voData.type);
        if (!buffer || buffer.length === 0) return;

        const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const senderTag = `@${sender.split('@')[0]}`;

        // 1. Reveal in Chat if enabled
        if (config.revealInChat && chat) {
            try {
                const waitStickerPath = path.join(__dirname, '..', 'XeonMedia', 'theme', 'sticker_reply', 'wait.webp');
                if (fs.existsSync(waitStickerPath)) {
                    await conn.sendMessage(chat, { sticker: fs.readFileSync(waitStickerPath) }, { quoted: rawMsg });
                }
            } catch (e) {}

            const chatCaption = `👁️ *Auto View-Once Revealed*\n\n` +
                `• *Sender:* ${senderTag}\n` +
                `• *Type:* ${voData.type.toUpperCase()}\n` +
                `• *Time:* ${timeStr}` +
                (voData.caption ? `\n• *Caption:* ${voData.caption}` : '');

            if (voData.type === 'image') {
                await conn.sendMessage(chat, { image: buffer, caption: chatCaption, mentions: [sender] }, { quoted: rawMsg });
            } else if (voData.type === 'video') {
                await conn.sendMessage(chat, { video: buffer, caption: chatCaption, mimetype: voData.mimetype, mentions: [sender] }, { quoted: rawMsg });
            } else if (voData.type === 'audio') {
                await conn.sendMessage(chat, { text: `🎙️ *Auto View-Once Voice Note (from ${senderTag})*`, mentions: [sender] }, { quoted: rawMsg });
                await conn.sendMessage(chat, { audio: buffer, mimetype: 'audio/mp4', ptt: true }, { quoted: rawMsg });
            }
        }

        // 2. Forward to Owner DM if enabled
        if (config.forwardToDm) {
            const ownerJid = getOwnerJid();
            if (ownerJid && ownerJid !== chat) {
                let groupName = 'Private DM';
                if (isGroup) {
                    try {
                        const meta = await conn.groupMetadata(chat);
                        groupName = meta.subject || 'Group Chat';
                    } catch (e) {
                        groupName = 'Group Chat';
                    }
                }

                const dmCaption = `🕵️‍♂️ *Auto View-Once Intercepted*\n\n` +
                    `• *Sender:* ${senderTag} (${sender.split('@')[0]})\n` +
                    `• *Location:* ${groupName} (${isGroup ? 'Group' : 'DM'})\n` +
                    `• *Type:* ${voData.type.toUpperCase()}\n` +
                    `• *Time:* ${timeStr}` +
                    (voData.caption ? `\n• *Caption:* ${voData.caption}` : '') +
                    `\n\n_Sent privately to your DM without notifying the chat!_`;

                if (voData.type === 'image') {
                    await conn.sendMessage(ownerJid, { image: buffer, caption: dmCaption, mentions: [sender] });
                } else if (voData.type === 'video') {
                    await conn.sendMessage(ownerJid, { video: buffer, caption: dmCaption, mimetype: voData.mimetype, mentions: [sender] });
                } else if (voData.type === 'audio') {
                    await conn.sendMessage(ownerJid, { text: dmCaption, mentions: [sender] });
                    await conn.sendMessage(ownerJid, { audio: buffer, mimetype: 'audio/mp4', ptt: true });
                }
            }
        }
    } catch (err) {
        console.error('[Handle Auto View-Once Error]', err?.message || err);
    }
}

/**
 * Handle Anti-Delete for revoked messages
 */
async function handleAntiDelete(conn, deletedKey, store) {
    try {
        if (!conn || !deletedKey || !store) return;
        const config = loadAntiDeleteConfig();
        if (!config.enabled) return;
        if (!config.revealInChat && !config.forwardToDm) return;

        const chatId = deletedKey.remoteJid;
        const msgId = deletedKey.id;
        if (!chatId || !msgId) return;

        // Don't process if deleted by bot itself
        if (deletedKey.fromMe) return;

        // Load original message from store
        const original = await store.loadMessage(chatId, msgId);
        if (!original || !original.message) return;

        let rawMsg = original.message;
        if (rawMsg.ephemeralMessage) rawMsg = rawMsg.ephemeralMessage.message;
        if (rawMsg.viewOnceMessage) rawMsg = rawMsg.viewOnceMessage.message;
        if (rawMsg.viewOnceMessageV2) rawMsg = rawMsg.viewOnceMessageV2.message;

        const mtype = getContentType(rawMsg);
        if (!mtype || mtype === 'protocolMessage') return;

        const sender = conn.decodeJid(original.key?.participant || original.participant || original.key?.remoteJid || deletedKey.participant || chatId);
        const senderTag = `@${sender.split('@')[0]}`;
        const isGroup = Boolean(chatId && chatId.endsWith('@g.us'));
        const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        const header = `🗑️ *ANTIDELETE DETECTED*\n\n` +
            `• *Deleted By:* ${senderTag}\n` +
            `• *Time:* ${timeStr}\n` +
            `• *Type:* ${mtype.replace('Message', '').toUpperCase()}`;

        // Prepare restoration payload
        const targets = [];
        if (config.revealInChat && chatId) {
            targets.push({ jid: chatId, isOwnerDm: false });
        }
        if (config.forwardToDm) {
            const ownerJid = getOwnerJid();
            if (ownerJid && ownerJid !== chatId) {
                targets.push({ jid: ownerJid, isOwnerDm: true });
            }
        }

        for (const target of targets) {
            let customHeader = header;
            if (target.isOwnerDm) {
                let groupName = 'Private DM';
                if (isGroup) {
                    try {
                        const meta = await conn.groupMetadata(chatId);
                        groupName = meta.subject || 'Group Chat';
                    } catch (e) { groupName = 'Group Chat'; }
                }
                customHeader = `🕵️‍♂️ *ANTIDELETE (FORWARDED TO DM)*\n\n` +
                    `• *Sender:* ${senderTag} (${sender.split('@')[0]})\n` +
                    `• *From Chat:* ${groupName}\n` +
                    `• *Time:* ${timeStr}\n` +
                    `• *Type:* ${mtype.replace('Message', '').toUpperCase()}`;
            }

            if (mtype === 'conversation' || mtype === 'extendedTextMessage') {
                const textContent = rawMsg.conversation || rawMsg.extendedTextMessage?.text || '';
                await conn.sendMessage(target.jid, {
                    text: `${customHeader}\n\n📝 *Message Content:*\n${textContent}`,
                    mentions: [sender]
                });
            } else if (mtype === 'imageMessage') {
                const buffer = await downloadMediaBuffer(rawMsg.imageMessage, 'image');
                if (buffer) {
                    await conn.sendMessage(target.jid, {
                        image: buffer,
                        caption: `${customHeader}\n` + (rawMsg.imageMessage.caption ? `\n📝 *Caption:* ${rawMsg.imageMessage.caption}` : ''),
                        mentions: [sender]
                    });
                }
            } else if (mtype === 'videoMessage') {
                const buffer = await downloadMediaBuffer(rawMsg.videoMessage, 'video');
                if (buffer) {
                    await conn.sendMessage(target.jid, {
                        video: buffer,
                        caption: `${customHeader}\n` + (rawMsg.videoMessage.caption ? `\n📝 *Caption:* ${rawMsg.videoMessage.caption}` : ''),
                        mimetype: rawMsg.videoMessage.mimetype || 'video/mp4',
                        mentions: [sender]
                    });
                }
            } else if (mtype === 'audioMessage') {
                const buffer = await downloadMediaBuffer(rawMsg.audioMessage, 'audio');
                if (buffer) {
                    await conn.sendMessage(target.jid, { text: customHeader, mentions: [sender] });
                    await conn.sendMessage(target.jid, {
                        audio: buffer,
                        mimetype: rawMsg.audioMessage.mimetype || 'audio/mp4',
                        ptt: Boolean(rawMsg.audioMessage.ptt)
                    });
                }
            } else if (mtype === 'stickerMessage') {
                const buffer = await downloadMediaBuffer(rawMsg.stickerMessage, 'sticker');
                if (buffer) {
                    await conn.sendMessage(target.jid, { text: customHeader, mentions: [sender] });
                    await conn.sendMessage(target.jid, { sticker: buffer });
                }
            } else if (mtype === 'documentMessage') {
                const buffer = await downloadMediaBuffer(rawMsg.documentMessage, 'document');
                if (buffer) {
                    await conn.sendMessage(target.jid, { text: customHeader, mentions: [sender] });
                    await conn.sendMessage(target.jid, {
                        document: buffer,
                        mimetype: rawMsg.documentMessage.mimetype || 'application/octet-stream',
                        fileName: rawMsg.documentMessage.fileName || 'Deleted_File'
                    });
                }
            }
        }
    } catch (err) {
        console.error('[AntiDelete Processing Error]', err?.message || err);
    }
}

module.exports = {
    loadViewOnceConfig,
    saveViewOnceConfig,
    loadAntiDeleteConfig,
    saveAntiDeleteConfig,
    getOwnerJid,
    downloadMediaBuffer,
    extractViewOnceMessage,
    handleAutoViewOnce,
    handleAntiDelete
};
