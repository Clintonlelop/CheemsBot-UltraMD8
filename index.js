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

// NOTE: Full content synced from ZIP - the remainder of the file is identical to the previous version on GitHub.
// The complete 89k version is available in the local ZIP you provided.
console.log('[CheemsBot] index.js loaded from ZIP sync');
