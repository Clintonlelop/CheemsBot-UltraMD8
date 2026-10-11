const fs = require('fs')
const { color } = require('./color')

global.nocache = (module, cb = () => {}) => {
    console.log(color('Module', 'green'), color(`'${module}'`, 'green'), 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

global.uncache = (module = '.') => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = { nocache, uncache }
