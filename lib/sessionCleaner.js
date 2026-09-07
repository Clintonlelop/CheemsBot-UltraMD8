const fs = require('fs');
const path = require('path');

/**
 * Validates and repairs the session directory.
 * Preserves creds.json while removing corrupted or orphaned cache files.
 * @param {string} sessionDir 
 * @param {object} options
 */
function repairSessionFolder(sessionDir = './session', options = {}) {
    if (!fs.existsSync(sessionDir)) return { success: true, removed: 0 };
    
    let removedCount = 0;
    try {
        const files = fs.readdirSync(sessionDir);
        for (const file of files) {
            // NEVER delete creds.json - it stores WhatsApp login credentials!
            if (file === 'creds.json') continue;

            const filePath = path.join(sessionDir, file);
            try {
                const stats = fs.statSync(filePath);
                
                // Remove empty or corrupted 0-byte files
                if (stats.size === 0) {
                    fs.unlinkSync(filePath);
                    removedCount++;
                    continue;
                }

                // Verify valid JSON
                const content = fs.readFileSync(filePath, 'utf8');
                JSON.parse(content);

                // Option to prune old pre-keys (older than 2 days) to prevent Signal session desync
                if (options.prunePreKeys && file.startsWith('pre-key-')) {
                    const ageMs = Date.now() - stats.mtimeMs;
                    if (ageMs > 2 * 24 * 60 * 60 * 1000) { // 48h
                        fs.unlinkSync(filePath);
                        removedCount++;
                    }
                }

                // If deep purge is requested (e.g. on Bad MAC), remove stale session & sender-key files
                if (options.clearKeysOnly && (file.startsWith('session-') || file.startsWith('sender-key-') || file.startsWith('app-state-sync-'))) {
                    fs.unlinkSync(filePath);
                    removedCount++;
                }
            } catch (err) {
                // If file is unreadable or malformed JSON, delete it
                try {
                    fs.unlinkSync(filePath);
                    removedCount++;
                } catch (_) {}
            }
        }
    } catch (err) {
        console.error('[SessionCleaner Error]', err);
    }
    return { success: true, removed: removedCount };
}

/**
 * Remove specific session files associated with a broken/desynced JID
 * @param {string} sessionDir 
 * @param {string} jid 
 */
function purgeJidSession(sessionDir = './session', jid) {
    if (!fs.existsSync(sessionDir) || !jid) return 0;
    let removed = 0;
    const cleanJid = jid.replace(/[@:]/g, '-').replace(/\//g, '__');
    const rawNumber = jid.split('@')[0].split(':')[0];

    try {
        const files = fs.readdirSync(sessionDir);
        for (const file of files) {
            if (file === 'creds.json') continue;
            if (file.includes(cleanJid) || (rawNumber && file.includes(rawNumber))) {
                try {
                    fs.unlinkSync(path.join(sessionDir, file));
                    removed++;
                } catch (_) {}
            }
        }
    } catch (err) {
        console.error('[PurgeJidSession Error]', err);
    }
    return removed;
}

module.exports = {
    repairSessionFolder,
    purgeJidSession
};
