const antispam = new Map()

function isSpam(jid, limit = 5, window = 10000) {
    const now = Date.now()
    if (!antispam.has(jid)) {
        antispam.set(jid, [])
    }
    const times = antispam.get(jid).filter(t => now - t < time)
    times.push(now)
    antispam.set(jid, times)
    return times.length > limit
}

module.exports = { isSpam }
