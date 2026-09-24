const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'database', 'command_errors.json');
const MAX_LOGS = 60;

function getErrorLogs() {
    try {
        if (!fs.existsSync(LOG_FILE)) return [];
        const data = fs.readFileSync(LOG_FILE, 'utf8');
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
        return [];
    }
}

function logCommandError(command, sender, chat, err) {
    try {
        const logs = getErrorLogs();
        const errObj = {
            timestamp: Date.now(),
            timeStr: new Date().toLocaleString(),
            command: command || 'unknown',
            sender: sender || 'unknown',
            chat: chat || 'unknown',
            error: err?.message || String(err),
            stack: err?.stack ? String(err.stack).split('\n').slice(0, 3).join('\n') : ''
        };

        logs.unshift(errObj);
        if (logs.length > MAX_LOGS) logs.length = MAX_LOGS;

        const dbDir = path.dirname(LOG_FILE);
        if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
        fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
    } catch (e) {
        console.error('[CommandLogger Error]', e);
    }
}

function clearErrorLogs() {
    try {
        if (fs.existsSync(LOG_FILE)) {
            fs.writeFileSync(LOG_FILE, JSON.stringify([], null, 2));
        }
        return true;
    } catch (_) {
        return false;
    }
}

module.exports = {
    logCommandError,
    getErrorLogs,
    clearErrorLogs
};
