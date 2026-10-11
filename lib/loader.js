const path = require('path');
const { modul } = require('../module');
const { fs } = modul;
const { color } = require('./color')

function resolveModule(modPath) {
    if (path.isAbsolute(modPath)) return modPath;
    const fromCwd = path.resolve(process.cwd(), modPath);
    if (fs.existsSync(fromCwd)) return fromCwd;
    try {
        return require.resolve(modPath);
    } catch (e) {
        return fromCwd;
    }
}

async function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            const resolved = resolveModule(module);
            delete require.cache[resolved];
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

async function nocache(module, cb = () => { }) {
    try {
        const resolved = resolveModule(module);
        console.log(color('Module', 'blue'), color(`'${module} is up to date!'`, 'cyan'))
        fs.watchFile(resolved, async () => {
            await uncache(resolved)
            cb(module)
        })
    } catch (err) {
        console.error('nocache error:', err.message);
    }
}

module.exports = {
    uncache,
    nocache
}
