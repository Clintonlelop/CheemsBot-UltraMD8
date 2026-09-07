/**
 * Modern In-Memory Store Polyfill for Baileys v6+
 */
const makeInMemoryStore = ({ logger } = {}) => {
  const chats = new Map()
  const messages = {}
  const contacts = {}
  const groupMetadata = {}
  const idMap = new Map()

  return {
    chats,
    messages,
    contacts,
    groupMetadata,
    bind: (ev) => {
      ev.on('messages.upsert', ({ messages: msgs }) => {
        for (const msg of msgs || []) {
          const jid = msg.key?.remoteJid
          const id = msg.key?.id
          if (!jid || !msg.message) continue
          
          if (!messages[jid]) messages[jid] = []
          messages[jid].push(msg)
          if (id) {
            idMap.set(id, msg)
            if (idMap.size > 5000) {
              const firstKey = idMap.keys().next().value
              idMap.delete(firstKey)
            }
          }
          if (messages[jid].length > 1000) messages[jid].shift()
        }
      })
      ev.on('contacts.upsert', (newContacts) => {
        for (const contact of newContacts || []) {
          if (!contact.id) continue
          contacts[contact.id] = Object.assign(contacts[contact.id] || {}, contact)
        }
      })
      ev.on('groups.update', (updates) => {
        for (const update of updates || []) {
          if (!update.id) continue
          groupMetadata[update.id] = Object.assign(groupMetadata[update.id] || {}, update)
        }
      })
    },
    loadMessage: async (jid, id) => {
      if (id && idMap.has(id)) {
        return idMap.get(id)
      }
      const list = messages[jid] || []
      return list.find(m => m.key?.id === id) || null
    },
    writeToFile: () => {},
    readFromFile: () => {}
  }
}

module.exports = { makeInMemoryStore }
