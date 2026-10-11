const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

/**
 * Repair / clean session folder by removing stale pre-key and session files
 * while preserving creds.json
 */
function repairSessionFolder(sessionDir = path.join(process.cwd(), 'session')) {
    try {
        if (!fs.existsSync(sessionDir)) {
            fs.mkdirSync(sessionDir, { recursive: true })
            return { cleaned: 0, message: 'Session folder created' }
        }
        const files = fs.readdirSync(sessionDir)
        let cleaned = 0
        for (const file of files) {
            if (
                file.startsWith('pre-key') ||
                file.startsWith('session-') ||
                file.startsWith('sender-key') ||
                file.startsWith('app-state') ||
                file.endsWith('.json') && file !== 'creds.json'
            ) {
                try {
                    fs.unlinkSync(path.join(sessionDir, file))
                    cleaned++
                } catch (e) {}
            }
        }
        return { cleaned, message: `Cleaned ${cleaned} stale session files` }
    } catch (e) {
        return { cleaned: 0, message: e.message }
    }
}

/**
 * Purge all session files related to a specific JID (useful after Bad MAC / decryption failures)
 */
function purgeJidSession(jid, sessionDir = path.join(process.cwd(), 'session')) {
    try {
        if (!fs.existsSync(sessionDir)) return
        const cleanJid = jid.replace(/[^0-9]/g, '')
        const files = fs.readdirSync(sessionDir)
        for (const file of files) {
            if (file.includes(cleanJid) || file.includes(jid.split('@')[0])) {
                try {
                    fs.unlinkSync(path.join(sessionDir, file))
                } catch (e) {}
            }
        }
    } catch (e) {}
}

module.exports = { repairSessionFolder, purgeJidSession }
