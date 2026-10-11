const chalk = require('chalk')
const fs = require('fs')

global.allmenu = (prefix, hituet) => {
return`┌───「 ⚡ 𝗖𝗟𝗜𝗡𝗧𝗢𝗡 𝗨𝗟𝗧𝗥𝗔 𝗠𝗗𝟴 ⚡ 」───
│ 🖥️ 𝗦𝗬𝗦𝗧𝗘𝗠: ONLINE
│ 👤 𝗢𝗣𝗘𝗥𝗔𝗧𝗢𝗥: Clinton
│ 🔋 𝗧𝗛𝗘𝗠𝗘: Hollow Hexagon
│ 👥 𝗔𝗨𝗧𝗛𝗢𝗥𝗜𝝗𝗔𝗧𝗜𝗢𝗡: Active
└──────────────────────────────┈ ⳹

┌───「 ⚙️ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃  𝐊𝐄𝐘𝐒 」───
│  🅞 = Owner Privilege
│  🅖 = Group Authorized
│  🅕 = General Access
│  🅟 = Premium Access
└──────────────────────────────┈ ⳹


 ───『 OWNER MENU 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*sᴇʟғ* 🅞
│ .${prefix}*ᴘᴜʙʟɪᴄ* 🅞
│ .${prefix}*ᴊᴏɪɴ* 🅞
│ .${prefix}*ʙᴄᴛᴇxᴛ* 🅞
│ .${prefix}*ᴘᴏʟʟ* 🅞
│ .${prefix}*ʙᴄɪᴍᴀɢᴇ* 🅞
│ .${prefix}*ʙᴄᴠɪᴅᴇᴏ* 🅞
│ .${prefix}*ᴄʀᴇᴀᴛᴇɢᴄ* 🅞
│ .${prefix}*sᴇᴛᴇxɪғ* 🅞
│ .${prefix}*ᴜsᴇʀᴊɪᴅ* 🅞
│ .${prefix}*sᴇᴛʙᴏᴛɴᴀᴍᴇ* 🅞
│ .${prefix}*sᴇᴛʙᴏᴛʙɪᴏ* 🅞
│ .${prefix}*ᴅᴇʟᴘᴘʙᴏᴛ* 🅞
│ .${prefix}*sʜᴜᴛᴅᴏᴡɴ* 🅞
│ .${prefix}*sᴇᴛᴘᴘʙᴏᴛ* 🅞
│ .${prefix}*ᴀᴅᴅᴘʀᴇᴍ* 🅞
│ .${prefix}*ᴅᴇʟᴘʀᴇᴍ* 🅞
│ .${prefix}*ᴀᴅᴅᴏᴡɴᴇʀ* 🅞
│ .${prefix}*ᴅᴇʟᴏᴡɴᴇʀ* 🅞
│ .${prefix}*ᴀᴅᴅᴠɴ* 🅞
│ .${prefix}*ᴅᴇʟᴠɴ* 🅞
│ .${prefix}*ᴀᴅᴅsᴛɪᴄᴋᴇʀ* 🅞
│ .${prefix}*ᴅᴇʟsᴛɪᴄᴋᴇʀ* 🅞
│ .${prefix}*ᴀᴅᴅɪᴍᴀɢᴇ* 🅞
│ .${prefix}*ᴅᴇʟɪᴍᴀɢᴇ* 🅞
│ .${prefix}*ᴀᴅᴅᴠɪᴅᴇᴏ* 🅞
│ .${prefix}*ᴅᴇʟᴠɪᴅᴇᴏ* 🅞
│ .${prefix}*ʙʟᴏᴄᴋ* 🅞
│ .${prefix}*ᴜɴʙʟᴏᴄᴋ* del 🅞
│ .${prefix}*ʟᴇᴀᴠᴇɢᴄ* 🅞
│ .${prefix}*ᴘᴜsʜᴄᴏɴᴛᴀᴄᴛ* 🅞
│ .${prefix}*ᴘᴜsʜᴄᴏɴᴛᴀᴄᴛᴠ𝟤* 🅞
│ .${prefix}*ᴀᴜᴛᴏᴠᴠ* 🅞
│ .${prefix}*ᴀɴᴛɪᴅᴇʟᴇᴛᴇ* 🅞
│ TOTAL COMMANDS
│ LIST : 34
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


 ───『 GROUP MENU 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ᴀɴᴛɪʟɪɴᴋ* 🅖
│ .${prefix}*ᴡᴇʟᴄᴏᴍᴇ* 🅖
│ .${prefix}*ɢᴏᴏᴅʙʏᴇ* 🅖
│ .${prefix}*ᴀᴄᴄᴇᴘᴛ* 🅖
│ .${prefix}*ʀᴇᴊᴇᴄᴛ* 🅖
│ .${prefix}*ʟɪsᴛʀᴇǫᴜᴇsᴛs* 🅖
│ .${prefix}*ᴀɴᴛɪᴡᴀᴍᴇ* 🅖
│ .${prefix}*ɢʀᴏᴜᴘʟɪɴᴋ* 🅖
│ .${prefix}*ɪɴᴠɪᴛᴇ* 🅖
│ .${prefix}*ᴇᴘʜᴇᴍᴇʀᴀʟ* 🅖
│ .${prefix}*ᴅᴇʟᴇᴛᴇ* 🅖
│ .${prefix}*sᴇᴛᴘᴘɢʀᴏᴜᴘ* 🅖
│ .${prefix}*ᴅᴇʟᴘᴘɢʀᴏᴜᴘ* 🅖
│ .${prefix}*sᴇᴛɴᴀᴍᴇ* 🅖
│ .${prefix}*sᴇᴛᴅᴇsᴄ* 🅖
│ .${prefix}*ᴀᴅᴅ* 🅖
│ .${prefix}*ᴋɪᴄᴋ* 🅖
│ .${prefix}*ᴘʀᴏᴍᴏᴛᴇ* 🅖
│ .${prefix}*ᴅᴇᴍᴏᴛᴇ* 🅖
│ .${prefix}*ʜɪᴅᴇᴛᴀɢ* 🅖
│ .${prefix}*ᴛᴏᴛᴀɢ* 🅖
│ .${prefix}*ᴛᴀɢᴀʟʟ* 🅖
│ .${prefix}*ᴇᴅɪᴛɪɴғᴏ* 🅖
│ .${prefix}*ᴏᴘᴇɴ* 🅖
│ .${prefix}*ᴄʟᴏsᴇ* 🅖
│ .${prefix}*ᴏᴘᴇɴᴛɪᴍᴇ* 🅖
│ .${prefix}*ᴄʟᴏsᴇᴛɪᴍᴇ* 🅖
│ .${prefix}*ʀᴇsᴇᴛʟɪɴᴋ* 🅖
│ .${prefix}*ɢᴇᴛʙɪᴏ* 🅖
│ .${prefix}*ᴠᴏᴛᴇ* 🅖
│ .${prefix}*ᴜᴘᴠᴏᴛᴇ* 🅖
│ .${prefix}*ᴅᴏᴡɴᴠᴏᴛᴇ* 🅖
│ .${prefix}*ᴄʜᴇᴄᴋᴠᴏᴛᴇ* 🅖
│ .${prefix}*ᴅᴇʟᴠᴏᴛᴇ* 🅖
│ .${prefix}*ᴀᴜᴛᴏsᴛɪᴄᴋᴇʀɢᴄ* 🅖
│ .${prefix}*ᴀɴᴛɪʟɪɴᴋɢᴄ* 🅖
│ .${prefix}*ᴡᴇʟᴄᴏᴍᴇ* 🅖
│ .${prefix}*ɢᴏᴏᴅʙʏᴇ* 🅖
│ .${prefix}*ᴀᴄᴄᴇᴘᴛ* 🅖
│ .${prefix}*ʀᴇᴊᴇᴄᴛ* 🅖
│ .${prefix}*ʟɪsᴛʀᴇǫᴜᴇsᴛs* 🅖
│ .${prefix}*ᴀɴᴛɪᴡᴀᴍᴇ* 🅖
│ .${prefix}*ᴀɴᴛɪʟɪɴᴋᴀʟʟ* 🅖
│ .${prefix}*ᴀɴᴛɪʟɪɴᴋᴛɪᴋᴛᴏᴋ* 🅖
│ .${prefix}*ᴀɴᴛɪʟɪɴᴋғʙ* 🅖
│ .${prefix}*ᴀɴᴛɪʟɪɴᴋᴛᴡɪᴛᴛᴇʀ* 🅖
│ .${prefix}*ᴀɴᴛɪʟɪɴᴋɪɢ* 🅖
│ .${prefix}*ᴀɴᴛɪʟɪɴᴋᴛɢ* 🅖
│ .${prefix}*ᴀɴᴛɪʟɪɴᴋʏᴛᴠɪᴅ* 🅖
│ .${prefix}*ᴀɴᴛɪʟɪɴᴋʏᴛᴄʜ* 🅖
│ .${prefix}*ᴀɴᴛɪᴠɪʀᴜs* 🅖
│ .${prefix}*ᴀɴᴛɪᴛᴏxɪᴄ* 🅖
│ .${prefix}*ᴀɴᴛɪsᴘᴀᴍ* 🅖
│ .${prefix}*ɴsғᴡ* 🅖
│ .${prefix}*ᴀᴄᴛ* 🅖
│ .${prefix}*ᴜᴘʟᴏᴀᴅɢsᴛᴀᴛᴜs* 🅖
│ .${prefix}*ᴅᴇʟᴇᴛᴇɢsᴛᴀᴛᴜs* 🅖
│ TOTAL COMMANDS
│ LIST : 57
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


 ───『 ⚡  DOWNLOAD MENU 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ᴛɪᴋᴛᴏᴋ* 🅕
│ .${prefix}*ᴛɪᴋᴛᴏᴋᴀᴜᴅɪᴏ* 🅕
│ .${prefix}*ᴀᴘᴋ* 🅕
│ .${prefix}*ᴀᴘᴋᴅʟ* 🅕
│ .${prefix}*ᴀᴘᴋᴠᴇʀ* 🅕
│ .${prefix}*ʏᴛsᴇᴀʀᴄʜ* 🅕
│ .${prefix}*ᴘʟᴀʏ* 🅕
│ .${prefix}*ʏᴛᴍᴘ𝟥* 🅕
│ .${prefix}*ʏᴛᴍᴘ𝟦* 🅕
│ .${prefix}*ɢᴏᴏɢʟᴇ* 🅕
│ .${prefix}*ɪᴍᴅʙ* 🅕
│ .${prefix}*ᴡᴇᴀᴛʜᴇʀ* 🅕
│ .${prefix}*ᴡᴀɴᴜᴍʙᴇʀ* 🅕
│ .${prefix}*ɪɴsᴛᴀɪᴍɢ* 🅕
│ .${prefix}*ɪɴsᴛᴀᴠɪᴅ* 🅕
│ .${prefix}*ғʙᴠɪᴅ* 🅕
│ .${prefix}*ᴛᴡɪᴛᴛᴇʀᴠɪᴅ* 🅕
│ .${prefix}*ᴛᴇʟᴇsᴛɪᴄᴋ* 🅟
│ .${prefix}*sᴘᴏᴛɪғʏ* 🅟
│ .${prefix}*ɢɪᴛᴄʟᴏɴᴇ* 🅕
│ .${prefix}*ʜᴀᴘᴘʏᴍᴏᴅ* 🅕
│ .${prefix}*ɢᴅʀɪᴠᴇ* 🅕
│ .${prefix}*ᴘɪɴᴛᴇʀᴇsᴛ* 🅕
│ .${prefix}*ʀɪɴɢᴛᴏɴᴇ* 🅕
│ LIST : 24
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


 ───『 ⚡  RANDOM VIDEO 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ᴛɪᴋᴛᴏᴋɢɪʀʟ* 🅕
│ .${prefix}*ᴛɪᴋᴛᴏᴋɴᴜᴋᴛʜʏ* 🅕
│ .${prefix}*ᴛɪᴋᴛᴏᴋᴋᴀʏᴇs* 🅕
│ .${prefix}*ᴛɪᴋᴛᴏᴋᴘᴀɴʀɪᴋᴀ* 🅕
│ .${prefix}*ᴛɪᴋᴛᴏᴋɴᴏᴛɴᴏᴛ* 🅕
│ .${prefix}*ᴛɪᴋᴛᴏᴋɢʜᴇᴀ* 🅕
│ .${prefix}*ᴛɪᴋᴛᴏᴋsᴀɴᴛᴜʏ* 🅕
│ .${prefix}*ᴛɪᴋᴛᴏᴋʙᴏᴄɪʟ* 🅕
│ TOTAL COMMANDS
│ LIST : 8
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


 ───『 STALKER MENU 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ɢsᴛᴀʟᴋ* 🅕
│ .${prefix}*sᴛᴀʟᴋ* 🅕
│ .${prefix}*ᴍʟsᴛᴀʟᴋ* 🅕
│ .${prefix}*ɴᴘᴍsᴛᴀʟᴋ* 🅕
│ .${prefix}*ɢʜsᴛᴀʟᴋ* 🅕
│ TOTAL COMMANDS
│ LIST : 5
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


 ───『 GEMINI & AI 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ᴄʜᴀᴛʙᴏᴛ* 🅞
│ .${prefix}*ɢᴇᴍɪɴɪ* 🅕
│ .${prefix}*ᴀɪ* 🅕
│ .${prefix}*ɢᴘᴛ* 🅕
│ .${prefix}*ᴄʜᴀᴛɢᴘᴛ* 🅕
│ .${prefix}*ᴏᴘᴇɴᴀɪ* 🅕
│ .${prefix}*ʙᴀʀᴅ* 🅕
│ .${prefix}*ᴀsᴋ* 🅕
│ .${prefix}*ᴀɪᴍᴀɢᴇ* 🅕
│ .${prefix}*ɪᴍᴀɢᴇɴ* 🅕
│ .${prefix}*ɢᴇɴɪᴍᴀɢᴇ* 🅕
│ .${prefix}*ɪᴍᴀɢɪɴᴇ* 🅕
│ .${prefix}*ǫᴡᴇɴ* 🅕
│ .${prefix}*ʀᴇᴍɪɴɪ* 🅕
│ .${prefix}*ᴛʀᴀɴsʟᴀᴛᴇ* 🅕
│ .${prefix}*ᴛʀ* 🅕
│ LIST : 16
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


 ───『 FUN MENU 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ᴅᴇғɪɴᴇ* 🅕
│ .${prefix}*ǫᴄ* 🅕
│ .${prefix}*ʟʏʀɪᴄs* 🅕
│ .${prefix}*sᴜɪᴛ* 🅕
│ .${prefix}*ᴍᴀᴛʜ* 🅕
│ .${prefix}*ᴛɪᴄᴛᴀᴄᴛᴏᴇ* 🅕
│ .${prefix}*ᴀᴄᴛ* 🅕
│ .${prefix}*ᴛʀᴜᴛʜ* 🅕
│ .${prefix}*ᴅᴀʀᴇ* 🅕
│ .${prefix}*ᴄᴏᴜᴘʟᴇ* 🅕
│ .${prefix}*sᴏᴜʟᴍᴀᴛᴇ* 🅕
│ .${prefix}*sᴛᴜᴘɪᴅᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ʜᴀɴᴅsᴏᴍᴇᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ᴜɴᴄʟᴇᴀɴᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ʜᴏᴛᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*sᴍᴀʀᴛᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ɢʀᴇᴀᴛᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ᴇᴠɪʟᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ᴅᴏɢᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ᴄᴏᴏʟᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ᴡᴀɪғᴜᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ᴀᴡᴇsᴏᴍᴇᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ɢᴀʏᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ᴄᴜᴛᴇᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ʟᴇsʙɪᴀɴᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ʜᴏʀɴʏᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ᴘʀᴇᴛᴛʏᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ʟᴏᴠᴇʟʏᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ᴜɢʟʏᴄʜᴇᴄᴋ* 🅕
│ .${prefix}*ᴋɪᴄᴋ* 🅕
│ .${prefix}*ǫᴜᴏᴛᴇs* 🅕
│ .${prefix}*sᴄᴀɴ* 🅕
│ .${prefix}*ɪs* 🅕
│ .${prefix}*ᴡʜᴇɴ* 🅕
│ .${prefix}*ᴡʜᴇʀᴇ* 🅕
│ .${prefix}*ᴡʜᴀᴛ* 🅕
│ .${prefix}*ʜᴏᴡ* 🅕
│ .${prefix}*ʜᴀᴛᴇ* 🅕
│ .${prefix}*ᴄʀʏ* 🅕
│ .${prefix}*ᴋɪʟʟ* 🅕
│ .${prefix}*ʜᴜɢ* 🅕
│ .${prefix}*ᴘᴀᴛ* 🅕
│ .${prefix}*ʟɪᴄᴋ* 🅕
│ .${prefix}*ᴋɪss* 🅕
│ .${prefix}*ʙɪᴛᴇ* 🅕
│ .${prefix}*ʏᴇᴇᴛ* 🅕
│ .${prefix}*ʙᴜʟʟʏ* 🅕
│ .${prefix}*ʙᴏɴᴋ* 🅕
│ .${prefix}*ᴡɪɴᴋ* 🅕
│ .${prefix}*ᴘᴏᴋᴇ* 🅕
│ .${prefix}*ɴᴏᴍ* 🅕
│ .${prefix}*sʟᴀᴘ* 🅕
│ .${prefix}*sᴍɪʟᴇ* 🅕
│ .${prefix}*ᴡᴀᴠᴇ* 🅕
│ .${prefix}*ᴀᴡᴏᴏ* 🅕
│ .${prefix}*ʙʟᴜsʜ* 🅕
│ .${prefix}*sᴍᴜɢ* 🅕
│ .${prefix}*ɢʟᴏᴍᴘ* 🅕
│ .${prefix}*ʜᴀᴘᴘʏ* 🅕
│ .${prefix}*ᴅᴀɴᴄᴇ* 🅕
│ .${prefix}*ᴄʀɪɴɢᴇ* 🅕
│ .${prefix}*ᴄᴜᴅᴅʟᴇ* 🅕
│ .${prefix}*ʜɪɢʜғɪᴠᴇ* 🅕
│ .${prefix}*sʜɪɴᴏʙᴜ* 🅕
│ .${prefix}*ʜᴀɴᴅʜᴏʟᴅ* 🅕
│ .${prefix}*sᴘᴀɴᴋ* 🅕
│ .${prefix}*ᴛɪᴄᴋʟᴇ* 🅕
│ .${prefix}*ᴀᴠᴀᴛᴀʀ* 🅕
│ .${prefix}*𝟥ᴅ* 🅕
│ .${prefix}*ғᴏxɢɪʀʟ* 🅕
│ .${prefix}*ɴᴇᴋᴏ* 🅕
│ .${prefix}*ᴄʜᴇᴄᴋᴍᴇ* 🅕
│ .${prefix}*sᴏᴜɴᴅ𝟣* - sound161 🅕
│ TOTAL COMMANDS
│ LIST : 73
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


 ───『 ⚡  RANDOM PHOTO 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ᴀᴇsᴛʜᴇᴛɪᴄ* 🅕
│ .${prefix}*ᴄᴏғғᴇᴇ* 🅕
│ .${prefix}*ᴡɪᴋɪᴍᴇᴅɪᴀ* 🅕
│ .${prefix}*ᴡᴀʟʟᴘᴀᴘᴇʀ* 🅕
│ .${prefix}*ᴀʀᴛ* 🅕
│ .${prefix}*ʙᴛs* 🅕
│ .${prefix}*ᴅᴏɢᴡᴏᴏғ* 🅕
│ .${prefix}*ᴄᴀᴛᴍᴇᴏᴡ* 🅕
│ .${prefix}*ʟɪᴢᴀʀᴅᴘɪᴄ* 🅕
│ .${prefix}*ɢᴏᴏsᴇʙɪʀᴅ* 🅕
│ .${prefix}*𝟪ʙᴀʟʟᴘᴏᴏʟ* 🅕
│ .${prefix}*ᴄᴏsᴘʟᴀʏ* 🅕
│ .${prefix}*ʜᴀᴄᴋᴇʀ* 🅕
│ .${prefix}*ᴄʏʙᴇʀ* 🅕
│ .${prefix}*ɢᴀᴍᴇᴡᴀʟʟᴘᴀᴘᴇʀ* 🅕
│ .${prefix}*sʟᴀᴍɪᴄ* 🅕
│ .${prefix}*ᴊᴇɴɴɪᴇ* 🅕
│ .${prefix}*ᴊɪsᴏ* 🅕
│ .${prefix}*sᴀᴛᴀɴɪᴄ* 🅕
│ .${prefix}*ᴊᴜsᴛɪɴᴀ* 🅕
│ .${prefix}*ᴄᴀʀᴛᴏᴏɴ* 🅕
│ .${prefix}*ᴘᴇɴᴛᴏʟ* 🅕
│ .${prefix}*ᴄᴀᴛ* 🅕
│ .${prefix}*ᴋᴘᴏᴘ* 🅕
│ .${prefix}*ᴇʀᴏ* 🅕
│ .${prefix}*ʟɪsᴀ* 🅕
│ .${prefix}*sᴘᴀᴄᴇ* 🅕
│ .${prefix}*ᴄᴀʀ* 🅕
│ .${prefix}*ᴛᴇᴄʜɴᴏʟᴏɢʏ* 🅕
│ .${prefix}*ʙɪᴋᴇ* 🅕
│ .${prefix}*sʜᴏʀᴛǫᴜᴏᴛᴇ* 🅕
│ .${prefix}*ᴀɴᴛɪᴡᴏʀᴋ* 🅕
│ .${prefix}*ʜᴀᴄᴋɪɴɢ* 🅕
│ .${prefix}*ʙᴏɴᴇᴋᴀ* 🅕
│ .${prefix}*ʀᴏsᴇ* 🅕
│ .${prefix}*ʏᴜᴊɪɴ* 🅕
│ .${prefix}*ᴜʟᴢᴢᴀɴɢʙᴏʏ* 🅕
│ .${prefix}*ᴜʟᴢᴢᴀɴɢɢɪʀʟ* 🅕
│ .${prefix}*ᴡᴀʟʟᴍʟ* 🅕
│ .${prefix}*ᴡᴀʟʟᴘʜᴏɴᴇ* 🅕
│ .${prefix}*ᴍᴏᴜɴᴛᴀɪɴ* 🅕
│ .${prefix}*ɢᴏᴏsᴇ* 🅕
│ .${prefix}*ᴘʀᴏғɪʟᴇᴘɪᴄ* 🅕
│ .${prefix}*ᴄᴏᴜᴘʟᴇᴘɪᴄ* 🅕
│ .${prefix}*ᴘʀᴏɢʀᴀᴍᴍɪɴɢ* 🅕
│ .${prefix}*ᴘᴜʙɢ* 🅕
│ .${prefix}*ʙʟᴀᴄᴋᴘɪɴᴋ* 🅕
│ .${prefix}*ʀᴀɴᴅᴏᴍʙᴏʏ* 🅕
│ .${prefix}*ʀᴀɴᴅᴏᴍɢɪʀʟ* 🅕
│ .${prefix}*ʜɪᴊᴀʙ* 🅕
│ .${prefix}*ᴄʜɪɴᴇsᴇ* 🅕
│ .${prefix}*ɪɴᴅᴏ* 🅕
│ .${prefix}*ᴊᴀᴘᴀɴᴇsᴇ* 🅕
│ .${prefix}*ᴋᴏʀᴇᴀɴ* 🅕
│ .${prefix}*ᴍᴀʟᴀʏ* 🅕
│ .${prefix}*ᴛʜᴀɪ* 🅕
│ .${prefix}*ᴠɪᴇᴛɴᴀᴍᴇsᴇ* 🅕
│ TOTAL COMMANDS
│ LIST : 57
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


 ───『 ⚡  STICKER 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ɢᴏᴏsᴇ* 🅕
│ .${prefix}*ᴡᴏᴏғ* 🅕
│ .${prefix}*𝟪ʙᴀʟʟ* 🅕
│ .${prefix}*ʟɪᴢᴀʀᴅ* 🅕
│ .${prefix}*ᴍᴇᴏᴡ* 🅕
│ .${prefix}*ɢᴜʀᴀ* 🅕
│ .${prefix}*ᴅᴏɢᴇ* 🅕
│ .${prefix}*ᴘᴀᴛʀɪᴄᴋ* 🅕
│ .${prefix}*ʟᴏᴠᴇsᴛɪᴄᴋ* 🅕
│ TOTAL COMMANDS
│ LIST : 9
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


 ───『 ⚡  ANIME 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ᴀᴋɪʀᴀ* 🅕
│ .${prefix}*ᴀᴋɪʏᴀᴍᴀ* 🅕
│ .${prefix}*ʟᴀɴᴀ* 🅕
│ .${prefix}*ᴀsᴜɴᴀ* 🅕
│ .${prefix}*ᴀʏᴜᴢᴀᴡᴀ* 🅕
│ .${prefix}*ʙᴏʀᴜᴛᴏ* 🅕
│ .${prefix}*ᴄʜɪʜᴏ* 🅕
│ .${prefix}*ᴄʜɪᴛᴏɢᴇ* 🅕
│ .${prefix}*ᴄᴏsᴘʟᴀʏʟᴏʟɪ* 🅕
│ .${prefix}*ᴄᴏsᴘʟᴀʏsᴀɢɪʀɪ* 🅕
│ .${prefix}*ᴅᴇɪᴅᴀʀᴀ* 🅕
│ .${prefix}*ᴅᴏʀᴀᴇᴍᴏɴ* 🅕
│ .${prefix}*ʟᴀɪɴᴀ* 🅕
│ .${prefix}*ᴍɪʟɪᴀ* 🅕
│ .${prefix}*ᴇʀᴢᴀ* 🅕
│ .${prefix}*ɢʀᴇᴍᴏʀʏ* 🅕
│ .${prefix}*ʜᴇsᴛɪᴀ* 🅕
│ .${prefix}*ʜɪɴᴀᴛᴀ* 🅕
│ .${prefix}*ʜᴜsʙᴜ* 🅕
│ .${prefix}*ɪɴᴏʀɪ* 🅕
│ .${prefix}*ɪsᴜᴢᴜ* 🅕
│ .${prefix}*ɪᴛᴀᴄʜɪ* 🅕
│ .${prefix}*ᴛᴏʀɪ* 🅕
│ .${prefix}*ᴋᴀɢᴀ* 🅕
│ .${prefix}*ᴋᴀɢᴜʀᴀ* 🅕
│ .${prefix}*ᴋᴀᴋᴀsɪʜ* 🅕
│ .${prefix}*ᴋᴀᴏʀɪ* 🅕
│ .${prefix}*ᴋᴇɴᴇᴋɪ* 🅕
│ .${prefix}*ᴋᴏᴛᴏʀɪ* 🅕
│ .${prefix}*ᴋᴜʀᴜᴍɪ* 🅕
│ .${prefix}*ʟᴏʟɪ* 🅕
│ .${prefix}*ᴍᴀᴅᴀʀᴀ* 🅕
│ .${prefix}*ᴍᴇɢᴜᴍɪɴ* 🅕
│ .${prefix}*ᴍɪᴋᴀsᴀ* 🅕
│ .${prefix}*ᴍɪᴋᴇʏ* 🅕
│ .${prefix}*ᴍɪᴋᴜ* 🅕
│ .${prefix}*ᴍɪɴᴀᴛᴏ* 🅕
│ .${prefix}*ɴᴀʀᴜᴛᴏ* 🅕
│ .${prefix}*ɴᴇᴋᴏ* 🅕
│ .${prefix}*ɴᴇᴋᴏ𝟤* 🅕
│ .${prefix}*ɴᴇᴋᴏɴɪᴍᴇ* 🅕
│ .${prefix}*ɴᴇᴢᴜᴋᴏ* 🅕
│ .${prefix}*ᴏɴᴇᴘɪᴇᴄᴇ* 🅕
│ .${prefix}*ᴘᴏᴋᴇᴍᴏɴ* 🅕
│ .${prefix}*ʀᴀɴᴅᴏᴍɴɪᴍᴇ* 🅕
│ .${prefix}*ʀᴀɴᴅᴏᴍɴɪᴍᴇ𝟤* 🅕
│ .${prefix}*ᴢᴇ* 🅕
│ .${prefix}*sᴀɢɪʀɪ* 🅕
│ .${prefix}*sᴀᴋᴜʀᴀ* 🅕
│ .${prefix}*sᴀsᴜᴋᴇ* 🅕
│ .${prefix}*sʜɪɴᴀ* 🅕
│ .${prefix}*sʜɪɴᴋᴀ* 🅕
│ .${prefix}*sʜɪɴᴏᴍɪʏᴀ* 🅕
│ .${prefix}*sʜɪᴢᴜᴋᴀ* 🅕
│ .${prefix}*sʜᴏᴛᴀ* 🅕
│ .${prefix}*ᴛᴇᴊɪɴᴀ* 🅕
│ .${prefix}*ᴛᴏᴜᴋᴀᴄʜᴀɴ* 🅕
│ .${prefix}*ᴛsᴜɴᴀᴅᴇ* 🅕
│ .${prefix}*ᴡᴀɪғᴜ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴡᴀʟʟ* 🅕
│ .${prefix}*ʏᴏᴛsᴜʙᴀ* 🅕
│ .${prefix}*ʏᴜᴋɪ* 🅕
│ .${prefix}*ʏᴜʟɪʙᴏᴄɪʟ* 🅕
│ .${prefix}*ʏᴜᴍᴇᴋᴏ* 🅕
│ .${prefix}*𝟪ʙᴀʟʟ* 🅕
│ .${prefix}*ᴛɪᴄᴋʟᴇ* 🅕
│ .${prefix}*ɴᴇᴋᴏ* 🅕
│ .${prefix}*𝟥ᴅ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴀᴡᴏᴏ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴍᴇɢᴜᴍɪɴ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇsʜɪɴᴏʙᴜ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇʜᴀɴᴅʜᴏʟᴅ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇʜɪɢʜғɪᴠᴇ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴄʀɪɴɢᴇ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴅᴀɴᴄᴇ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇʜᴀᴘᴘʏ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇɢʟᴏᴍᴘ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇʙʟᴜsʜ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇsᴍᴜɢ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴡᴀᴠᴇ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇsᴍɪʟᴇ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴘᴏᴋᴇ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴡɪɴᴋ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇʙᴏɴᴋ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇʙᴜʟʟʏ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇʏᴇᴇᴛ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇʙɪᴛᴇ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇʟɪᴄᴋ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴋɪʟʟ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴄʀʏ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴡʟᴘ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴋɪss* 🅕
│ .${prefix}*ᴀɴɪᴍᴇʜᴜɢ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇɴᴇᴋᴏ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴘᴀᴛ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇsʟᴀᴘ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴄᴜᴅᴅʟᴇ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴡᴀɪғᴜ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇɴᴏᴍ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇғᴏxɢɪʀʟ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇɢᴇᴄɢ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴛɪᴄᴋʟᴇ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇғᴇᴇᴅ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇᴀᴠᴀᴛᴀʀ* 🅕
│ .${prefix}*ɢᴇɴsʜɪɴ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇ* 🅕
│ TOTAL COMMANDS
│ LIST : 106
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


 ───『 ⚡  ANIME NSFW 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ʜᴇɴᴛᴀɪ* 🅕
│ .${prefix}*ɢɪғʜᴇɴᴛᴀɪ* 🅕
│ .${prefix}*ɢɪғʙʟᴏᴡᴊᴏʙ* 🅕
│ .${prefix}*ʜᴇɴᴛᴀɪᴠɪᴅ* 🅕
│ .${prefix}*ʜɴᴇᴋᴏ* 🅕
│ .${prefix}*ɴᴡᴀɪғᴜ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇsᴘᴀɴᴋ* 🅕
│ .${prefix}*ᴛʀᴀᴘ* 🅕
│ .${prefix}*ɢᴀsᴍ* 🅕
│ .${prefix}*ᴀʜᴇɢᴀᴏ* 🅕
│ .${prefix}*ᴀss* 🅕
│ .${prefix}*ʙᴅsᴍ* 🅕
│ .${prefix}*ʙʟᴏᴡᴊᴏʙ* 🅕
│ .${prefix}*ᴄᴜᴄᴋᴏʟᴅ* 🅕
│ .${prefix}*ᴄᴜᴍ* 🅕
│ .${prefix}*ᴍɪʟғ* 🅕
│ .${prefix}*ʙᴀ* 🅕
│ .${prefix}*ᴇʀᴏ* 🅕
│ .${prefix}*ғᴇᴍᴅᴏᴍ* 🅕
│ .${prefix}*ʙᴏᴏᴛʏ* 🅕
│ .${prefix}*ɢᴀɴɢʙᴀɴɢ* 🅕
│ .${prefix}*ɢʟᴀssᴇs* 🅕
│ .${prefix}*ᴊᴀʜʏ* 🅕
│ .${prefix}*ᴍᴀsᴛᴜʀʙᴀᴛɪᴏɴ* 🅕
│ .${prefix}*ᴍᴀɴɢᴀ* 🅕
│ .${prefix}*ɴᴇᴋᴏ-ʜᴇɴᴛᴀɪ* 🅕
│ .${prefix}*ɴᴇᴋᴏ-ʜᴇɴᴛᴀɪ𝟤* 🅕
│ .${prefix}*ɴsғᴡʟᴏʟɪ* 🅕
│ .${prefix}*ᴏʀɢʏ* 🅕
│ .${prefix}*ᴘᴀɴᴛɪᴇs* 🅕
│ .${prefix}*ᴘᴜssʏ* 🅕
│ .${prefix}*ᴛᴇɴᴛᴀᴄʟᴇs* 🅕
│ .${prefix}*ᴛʜɪɢʜs* 🅕
│ .${prefix}*ʏᴜʀɪ* 🅕
│ .${prefix}*ᴢᴇᴛᴛᴀɪ* 🅕
│ .${prefix}*ɴxxsᴇᴀʀᴄʜ* 🅟
│ .${prefix}*ɴxxᴅʟ* 🅟
│ TOTAL COMMANDS
│ LIST : 37
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


 ───『 ⚡  TEXTPRO MAKER 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ᴄᴀɴᴅʏ* 🅕
│ .${prefix}*ᴄʜʀɪsᴛᴍᴀs* 🅕
│ .${prefix}*𝟥ᴅᴄʜʀɪsᴛᴍᴀs* 🅕
│ .${prefix}*sᴘᴀʀᴋʟᴇᴄʜʀɪsᴛᴍᴀs* 🅕
│ .${prefix}*ᴅᴇᴇᴘsᴇᴀ* 🅕
│ .${prefix}*sᴄɪғɪ* 🅕
│ .${prefix}*ʀᴀɪɴʙᴏᴡ* 🅕
│ .${prefix}*ᴡᴀᴛᴇʀᴘɪᴘᴇ* 🅕
│ .${prefix}*sᴘᴏᴏᴋʏ* 🅕
│ .${prefix}*ᴘᴇɴᴄɪʟ* 🅕
│ .${prefix}*ᴄɪʀᴄᴜɪᴛ* 🅕
│ .${prefix}*ᴅɪsᴄᴏᴠᴇʀʏ* 🅕
│ .${prefix}*ᴍᴇᴛᴀʟɪᴄ* 🅕
│ .${prefix}*ᴀᴄᴛɪᴏɴ* 🅕
│ .${prefix}*ᴅᴇᴍᴏɴ* 🅕
│ .${prefix}*ᴛʀᴀɴsғᴏʀᴍᴇʀ* 🅕
│ .${prefix}*ʙᴇʀʀʏ* 🅕
│ .${prefix}*ᴛʜᴜɴᴅᴇʀ* 🅕
│ .${prefix}*ᴍᴀɢᴍᴀ* 🅕
│ .${prefix}*𝟥ᴅsᴛᴏɴᴇ* 🅕
│ .${prefix}*ɴᴇᴏɴʟɪɢʜᴛ* 🅕
│ .${prefix}*ɢʟɪᴛᴄʜ* 🅕
│ .${prefix}*ʜᴀʀʀʏᴘᴏᴛᴛᴇʀ* 🅕
│ .${prefix}*ʙʀᴏᴋᴇɴɢʟᴀss* 🅕
│ .${prefix}*ᴘᴀᴘᴇʀᴄᴜᴛ* 🅕
│ .${prefix}*ᴡᴀᴛᴇʀᴄᴏʟᴏʀ* 🅕
│ .${prefix}*ᴍᴜʟᴛɪᴄᴏʟᴏʀ* 🅕
│ .${prefix}*ɴᴇᴏɴᴅᴇᴠɪʟ* 🅕
│ .${prefix}*ᴜɴᴅᴇʀᴡᴀᴛᴇʀ* 🅕
│ .${prefix}*ɢʀᴀғғɪᴛɪʙɪᴋᴇ* 🅕
│ .${prefix}*sɴᴏᴡ* 🅕
│ .${prefix}*ᴄʟᴏᴜᴅ* 🅕
│ .${prefix}*ʜᴏɴᴇʏ* 🅕
│ .${prefix}*ɪᴄᴇ* 🅕
│ .${prefix}*ғʀᴜɪᴛᴊᴜɪᴄᴇ* 🅕
│ .${prefix}*ʙɪsᴄᴜɪᴛ* 🅕
│ .${prefix}*ᴡᴏᴏᴅ* 🅕
│ .${prefix}*ᴄʜᴏᴄᴏʟᴀᴛᴇ* 🅕
│ .${prefix}*sᴛʀᴀᴡʙᴇʀʀʏ* 🅕
│ .${prefix}*ᴍᴀᴛʀɪx* 🅕
│ .${prefix}*ʙʟᴏᴏᴅ* 🅕
│ .${prefix}*ᴅʀᴏᴘᴡᴀᴛᴇʀ* 🅕
│ .${prefix}*ᴛᴏxɪᴄ* 🅕
│ .${prefix}*ʟᴀᴠᴀ* 🅕
│ .${prefix}*ʀᴏᴄᴋ* 🅕
│ .${prefix}*ʙʟᴏᴏᴅɢʟᴀs* 🅕
│ .${prefix}*ʜᴀʟʟᴏᴡᴇɴ* 🅕
│ .${prefix}*ᴅᴀʀᴋɢᴏʟᴅ* 🅕
│ .${prefix}*ᴊᴏᴋᴇʀ* 🅕
│ .${prefix}*ᴡɪᴄᴋᴇʀ* 🅕
│ .${prefix}*ᴡᴏʀᴋ* 🅕
│ .${prefix}*sᴋᴇʟᴇᴛᴏɴ* 🅕
│ .${prefix}*ʙʟᴀᴄᴋᴘɪɴᴋ* 🅕
│ .${prefix}*sᴀɴᴅ* 🅕
│ .${prefix}*ɢʟᴜᴇ* 🅕
│ .${prefix}*𝟣𝟫𝟣𝟩* 🅕
│ .${prefix}*ʟᴇᴀᴠᴇs* 🅕
│ .${prefix}*ʀᴇᴛʀᴏ* 🅕
│ .${prefix}*ᴘᴏʀɴʜᴜʙ* 🅕
│ .${prefix}*𝟪ʙɪᴛ* 🅕
│ .${prefix}*ʙᴀᴛᴍᴀɴ* 🅕
│ .${prefix}*𝟥ᴅʙᴏx* 🅕
│ .${prefix}*ʟɪᴏɴ* 🅕
│ .${prefix}*𝟥ᴅᴀᴠᴇɴɢᴇʀs* 🅕
│ .${prefix}*ᴡɪɴᴅᴏᴡ* 🅕
│ .${prefix}*𝟥ᴅsᴘᴀᴄᴇ* 🅕
│ .${prefix}*ʙᴏᴋᴇʜ* 🅕
│ .${prefix}*ʜᴏʟᴏɢʀᴀᴘʜɪᴄ* 🅕
│ .${prefix}*ᴛʜᴇᴡᴀʟʟ* 🅕
│ .${prefix}*ᴄᴀʀʙᴏɴ* 🅕
│ .${prefix}*ᴡʜɪᴛᴇʙᴇᴀʀ* 🅕
│ .${prefix}*ᴍᴇᴛᴀʟʟɪᴄ* 🅕
│ .${prefix}*sᴛᴇᴇʟ* 🅕
│ .${prefix}*ғᴀʙʀɪᴄ* 🅕
│ .${prefix}*ᴀɴᴄɪᴇɴᴛ* 🅕
│ .${prefix}*ᴍᴀʀᴠᴇʟ* 🅕
│ TOTAL COMMANDS
│ LIST : 76
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


 ───『 ⚡  PHOTOOXY MAKER 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*sʜᴀᴅᴏᴡ* 🅕
│ .${prefix}*ᴡʀɪᴛᴇ* 🅕
│ .${prefix}*ʀᴏᴍᴀɴᴛɪᴄ* 🅕
│ .${prefix}*ʙᴜʀɴᴘᴀᴘᴇʀ* 🅕
│ .${prefix}*sᴍᴏᴋᴇ* 🅕
│ .${prefix}*ɴᴀʀᴜᴛᴏʙᴀɴɴᴇʀ* 🅕
│ .${prefix}*ʟᴏᴠᴇ* 🅕
│ .${prefix}*ᴜɴᴅᴇʀɢʀᴀss* 🅕
│ .${prefix}*ᴅᴏᴜʙʟᴇʟᴏᴠᴇ* 🅕
│ .${prefix}*ᴄᴏғғᴇᴄᴜᴘ* 🅕
│ .${prefix}*ᴜɴᴅᴇʀᴡᴀᴛᴇʀᴏᴄᴇᴀɴ* 🅕
│ .${prefix}*sᴍᴏᴋʏɴᴇᴏɴ* 🅕
│ .${prefix}*sᴛᴀʀsᴛᴇxᴛ* 🅕
│ .${prefix}*ʀᴀɪɴʙᴏᴡᴇғғᴇᴄᴛ* 🅕
│ .${prefix}*ʙᴀʟʟᴏᴏɴᴛᴇxᴛ* 🅕
│ .${prefix}*ᴍᴇᴛᴀʟʟɪᴄᴇғғᴇᴄᴛ* 🅕
│ .${prefix}*ᴇᴍʙʀᴏɪᴅᴇʀʏᴛᴇxᴛ* 🅕
│ .${prefix}*ғʟᴀᴍɪɴɢᴛᴇxᴛ* 🅕
│ .${prefix}*sᴛᴏɴᴇᴛᴇxᴛ* 🅕
│ .${prefix}*ᴡʀɪᴛᴇᴀʀᴛ* 🅕
│ .${prefix}*sᴜᴍᴍᴇʀᴛᴇxᴛ* 🅕
│ .${prefix}*ᴡᴏʟғᴍᴇᴛᴀʟᴛᴇxᴛ* 🅕
│ .${prefix}*ɴᴀᴛᴜʀᴇ𝟥ᴅᴛᴇxᴛ* 🅕
│ .${prefix}*ʀᴏsᴇsᴛᴇxᴛ* 🅕
│ .${prefix}*ɴᴀᴛᴜʀᴇᴛʏᴘᴏɢʀᴀᴘʜʏ* 🅕
│ .${prefix}*ǫᴜᴏᴛᴇsᴜɴᴅᴇʀ* 🅕
│ .${prefix}*sʜɪɴᴇᴛᴇxᴛ* 🅕
│ TOTAL COMMANDS
│ LIST : 27
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


 ───『 ⚡  EPHOTO360 MAKER 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ɢʟɪᴛᴄʜᴛᴇxᴛ* 🅕
│ .${prefix}*ᴡʀɪᴛᴇᴛᴇxᴛ* 🅕
│ .${prefix}*ᴀᴅᴠᴀɴᴄᴇᴅɢʟᴏᴡ* 🅕
│ .${prefix}*ᴛʏᴘᴏɢʀᴀᴘʜʏᴛᴇxᴛ* 🅕
│ .${prefix}*ʟɢʟɪᴛᴄʜ* 🅕
│ .${prefix}*ɴᴇᴏɴɢʟɪᴛᴄʜ* 🅕
│ .${prefix}*ғʟᴀɢᴛᴇxᴛ* 🅕
│ .${prefix}*ғʟᴀɢ𝟥ᴅᴛᴇxᴛ* 🅕
│ .${prefix}*ᴅᴇʟᴇᴛɪɴɢᴛᴇxᴛ* 🅕
│ .${prefix}*ʙʟᴀᴄᴋᴘɪɴᴋsᴛʏʟᴇ* 🅕
│ .${prefix}*ɢʟᴏᴡɪɴɢᴛᴇxᴛ* 🅕
│ .${prefix}*ᴜɴᴅᴇʀᴡᴀᴛᴇʀᴛᴇxᴛ* 🅕
│ .${prefix}*ʟᴏɢᴏᴍᴀᴋᴇʀ* 🅕
│ .${prefix}*ᴄᴀʀᴛᴏᴏɴsᴛʏʟᴇ* 🅕
│ .${prefix}*ᴘᴀᴘᴇʀᴄᴜᴛsᴛʏʟᴇ* 🅕
│ .${prefix}*ᴡᴀᴛᴇʀᴄᴏʟᴏʀᴛᴇxᴛ* 🅕
│ .${prefix}*ᴀʀᴛᴄʟᴏᴜᴅs* 🅕
│ .${prefix}*ʙʟᴀᴄᴋᴘɪɴᴋʟᴏɢᴏ* 🅕
│ .${prefix}*ɢʀᴀᴅɪᴇɴᴛᴛᴇxᴛ* 🅕
│ .${prefix}*sᴜᴍᴍᴇʀʙᴇᴀᴄʜ* 🅕
│ .${prefix}*ʟᴜxᴜʀʏɢᴏʟᴅ* 🅕
│ .${prefix}*ᴍᴜʟᴛɪᴄᴏʟᴏʀᴇᴅɴᴇᴏɴ* 🅕
│ .${prefix}*sᴀɴᴅsᴜᴍᴍᴇʀ* 🅕
│ .${prefix}*ɢᴀʟᴀxʏᴡᴀʟʟᴘᴀᴘᴇʀ* 🅕
│ .${prefix}*𝟣𝟫𝟣𝟩sᴛʏʟᴇ* 🅕
│ .${prefix}*ᴍᴀᴋɪɴɢɴᴇᴏɴ* 🅕
│ .${prefix}*ʀᴏʏᴀʟᴛᴇxᴛ* 🅕
│ .${prefix}*ᴄʀᴇᴀᴛᴇ* 🅕
│ .${prefix}*ɢᴀʟᴀxʏsᴛʏʟᴇ* 🅕
│ .${prefix}*ʟɪɢʜᴛᴇғғᴇᴄᴛs* 🅕
│ TOTAL COMMANDS
│ LIST : 30
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


 ───『 DATABASE MENU 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*sᴇᴛᴄᴍᴅ* 🅕
│ .${prefix}*ᴅᴇʟᴄᴍᴅ* 🅕
│ .${prefix}*ʟɪsᴛᴄᴍᴅ* 🅕
│ .${prefix}*ʟᴏᴄᴋᴄᴍᴅ* 🅕
│ .${prefix}*ᴀᴅᴅᴍsɢ* 🅕
│ .${prefix}*ᴅᴇʟᴍsɢ* 🅕
│ .${prefix}*ɢᴇᴛᴍsɢ* 🅕
│ .${prefix}*ʟɪsᴛᴍsɢ* 🅕
│ TOTAL COMMANDS
│ LIST : 8
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


 ───『 BUG & WAR SYSTEM 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*sᴇᴛᴏᴛᴘ* 🅞
│ .${prefix}*ʙᴜɢᴘ* 🅞
│ .${prefix}*ʙᴜɢʀ* 🅞
│ TOTAL COMMANDS
│ LIST : 3
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


 ───『 ⚡  OTHER MENU 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ᴘɪɴɢ* 🅕
│ .${prefix}*ᴍᴇɴᴜ* 🅕
│ .${prefix}*ᴍʏɪᴘ* 🅕
│ .${prefix}*ʀᴇᴘᴏʀᴛʙᴜɢ* 🅕
│ .${prefix}*ʟɪsᴛᴘᴇᴍ* 🅕
│ .${prefix}*ʟɪsᴛsᴛɪᴄᴋᴇʀ* 🅕
│ .${prefix}*ʟɪsᴛɪᴍᴀɢᴇ* 🅕
│ .${prefix}*ʟɪsᴛᴠɪᴅᴇᴏ* 🅕
│ .${prefix}*ʟɪsᴛᴠɴ* 🅕
│ .${prefix}*ʟɪsᴛʙᴀᴅᴡᴏʀᴅ* 🅕
│ .${prefix}*ʟɪsᴛᴘᴄ* 🅕
│ .${prefix}*ʟɪsᴛɢᴄ* 🅕
│ .${prefix}*ᴏᴡɴᴇʀ* 🅕
│ .${prefix}*ʀᴇɴᴛʙᴏᴛ* 🅕
│ .${prefix}*ʟɪsᴛʀᴇɴᴛʙᴏᴛ* 🅕
│ .${prefix}*ᴅᴏɴᴀᴛᴇ* 🅕
│ .${prefix}*sᴇɴᴅ* 🅕
│ .${prefix}*ᴏʙғᴜsᴄᴀᴛᴇ* 🅕
│ .${prefix}*sᴛʏʟᴇᴛᴇxᴛ* 🅕
│ .${prefix}*ғʟɪᴘᴛᴇxᴛ* 🅕
│ .${prefix}*ᴛᴛs* 🅕
│ .${prefix}*sᴀʏ* 🅕
│ .${prefix}*ᴛᴏɢɪғ* 🅕
│ .${prefix}*ᴛᴏǫʀ* 🅕
│ .${prefix}*ʙᴀss* 🅕
│ .${prefix}*ʙʟᴏᴡɴ* 🅕
│ .${prefix}*ᴅᴇᴇᴘ* 🅕
│ .${prefix}*ᴇᴀʀʀᴀᴘᴇ* 🅕
│ .${prefix}*ғᴀsᴛ* 🅕
│ .${prefix}*ᴘᴀᴛ* 🅕
│ .${prefix}*ɴɪɢʜᴛᴄᴏʀᴇ* 🅕
│ .${prefix}*ᴠᴇʀsᴇ* 🅕
│ .${prefix}*ʀᴏʙᴏᴛ* 🅕
│ .${prefix}*sʟᴏᴡ* 🅕
│ .${prefix}*sᴍᴏᴏᴛʜ* 🅕
│ .${prefix}*sǫᴜɪʀʀᴇʟ* 🅕
│ .${prefix}*ᴛɪɴʏᴜʀʟ* 🅕
│ .${prefix}*ᴛɪɴʏᴜʀʟ* 🅕
│ .${prefix}*ᴛᴏᴠɴ* 🅕
│ .${prefix}*ᴛᴏᴀᴜᴅɪᴏ* 🅕
│ .${prefix}*ᴛᴏᴍᴘ𝟥* 🅕
│ .${prefix}*ᴛᴏᴍᴘ𝟦🅕*
│ .${prefix}*ᴛᴏɪᴍɢ* 🅕
│ .${prefix}*ᴛᴏᴏɴᴄᴇ* 🅕
│ .${prefix}*ᴠᴠ* 🅕
│ .${prefix}*sᴛɪᴄᴋᴇʀ* 🅕
│ .${prefix}*ᴛᴀᴋᴇ* 🅟
│ .${prefix}*ᴍᴏᴊɪ* 🅕
│ .${prefix}*ᴠᴏʟᴜᴍᴇ* 🅕
│ .${prefix}*ʙɪɴᴀʀʏ* 🅕
│ .${prefix}*ᴅʙɪɴᴀʀʏ* 🅕
│ .${prefix}*ssᴡᴇʙ* 🅕
│ .${prefix}*ǫᴜᴏᴛᴇᴅ* 🅕
│ .${prefix}*ʀᴜɴᴛɪᴍᴇ* 🅕
│ LIST : 54
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


───────────────────────────
      ⚡ 𝙇𝙀𝙇𝙊𝙋 ⚡
───────────────────────────`}

global.animemenu = (prefix) => {
return `🌸  *✧ 🎀 ＯＴＡ𝐊Ｕ  ＧＡＲＤＥＮ 🎀 ✧*  🌸
───────────────────────────
✨ _Welcome to the cherry blossom anime gardens!_

🍡  *🎀 𝐀𝐍𝐈𝐌𝐄  𝐒𝐔𝐌𝐌𝐎𝐍𝐒*
  🌸 ${prefix}*ᴀᴋɪʀᴀ* 🅕      | 🌸 ${prefix}*ᴀᴋɪʏᴀᴍᴀ* 🅕
  🌸 ${prefix}*ᴀsᴜɴᴀ* 🅕      | 🌸 ${prefix}*ᴀʏᴜᴢᴀᴡᴀ* 🅕
  🌸 ${prefix}*ʙᴏʀᴜᴛᴏ* 🅕     | 🌸 ${prefix}*ᴄʜɪʜᴏ* 🅕
  🌸 ${prefix}*ᴄʜɪᴛᴏɢᴇ* 🅕    | 🌸 ${prefix}*ᴅᴇɪᴅᴀʀᴀ* 🅕
  🌸 ${prefix}*ᴅᴏʀᴀᴇᴍᴏɴ* 🅕   | 🌸 ${prefix}*ᴇʟᴀɪɴᴀ* 🅕
  🌸 ${prefix}*ᴇᴍɪʟɪᴀ* 🅕     | 🌸 ${prefix}*ᴇʀᴢᴀ* 🅕
  🌸 ${prefix}*ɢʀᴇᴍᴏʀʏ* 🅕    | 🌸 ${prefix}*ʜᴇsᴛɪᴀ* 🅕
  🌸 ${prefix}*ʜɪɴᴀᴛᴀ* 🅕     | 🌸 ${prefix}*ʜᴜsʙᴜ* 🅕
  🌸 ${prefix}*ɪɴᴏʀɪ* 🅕      | 🌸 ${prefix}*ɪsᴜᴢᴜ* 🅕
  🌸 ${prefix}*ɪᴛᴀᴄʜɪ* 🅕     | 🌸 ${prefix}*ɪᴛᴏʀɪ* 🅕
  🌸 ${prefix}*ᴋᴀɢᴀ* 🅕       | 🌸 ${prefix}*ᴋᴀɢᴜʀᴀ* 🅕
  🌸 ${prefix}*ᴋᴀᴋᴀsɪʜ* 🅕    | 🌸 ${prefix}*ᴋᴀᴏʀɪ* 🅕
  🌸 ${prefix}*ᴋᴇɴᴇᴋɪ* 🅕     | 🌸 ${prefix}*ᴋᴏᴛᴏʀɪ* 🅕
  🌸 ${prefix}*ᴋᴜʀᴜᴍɪ* 🅕     | 🌸 ${prefix}*ᴍᴀᴅᴀʀᴀ* 🅕
  🌸 ${prefix}*ᴍᴇɢᴜᴍɪɴ* 🅕    | 🌸 ${prefix}*ᴍɪᴋᴀsᴀ* 🅕
  🌸 ${prefix}*ᴍɪᴋᴇʏ* 🅕      | 🌸 ${prefix}*ɴᴇᴋᴏ* 🅕
  🌸 ${prefix}*ɴᴇᴢᴜᴋᴏ* 🅕     | 🌸 ${prefix}*ᴏɴᴇᴘɪᴇᴄᴇ* 🅕
  🌸 ${prefix}*ᴏʀᴏᴄʜɪᴍᴀʀᴜ* 🅕 | 🌸 ${prefix}*ᴘᴏᴋᴇᴍᴏɴ* 🅕
  🌸 ${prefix}*ʀɪᴢᴇ* 🅕       | 🌸 ${prefix}*sᴀɢɪʀɪ* 🅕
  🌸 ${prefix}*sᴀᴋᴜʀᴀ* 🅕     | 🌸 ${prefix}*sᴀsᴜᴋᴇ* 🅕
  🌸 ${prefix}*sʜɪɴᴀ* 🅕      | 🌸 ${prefix}*sʜɪɴᴋᴀ* 🅕
  🌸 ${prefix}*sʜɪᴢᴜᴋᴀ* 🅕    | 🌸 ${prefix}*sʜᴏᴜᴋᴏ* 🅕
  🌸 ${prefix}*ᴛᴏᴜᴋᴀ* 🅕      | 🌸 ${prefix}*ᴛsᴜɴᴀᴅᴇ* 🅕
  🌸 ${prefix}*ʏᴀᴛᴏɢᴀᴍɪ* 🅕   | 🌸 ${prefix}*ʏᴜᴋɪ* 🅕

🎀  *🌸 𝐂𝐎𝐒𝐏𝐋𝐀𝐘  &  𝐋𝐎𝐋𝐈𝐒*
  🌸 ${prefix}*ʟᴏʟɪ* 🅕
  🌸 ${prefix}*ᴄᴏsᴘʟᴀʏʟᴏʟɪ* 🅕
  🌸 ${prefix}*ᴄᴏsᴘʟᴀʏsᴀɢɪʀɪ* 🅕

🎬  *💫 𝐀𝐍𝐈𝐌𝐄  𝐆𝐈𝐅  𝐑𝐄𝐀𝐂𝐓𝐈𝐎𝐍𝐒 (34 GIFS)*
  ✨ ${prefix}*sʟᴀᴘ* @tag       | ✨ ${prefix}*ʜᴜɢ* @tag
  ✨ ${prefix}*ᴋɪss* @tag       | ✨ ${prefix}*ᴘᴀᴛ* @tag
  ✨ ${prefix}*ᴄᴜᴅᴅʟᴇ* @tag     | ✨ ${prefix}*ʙᴏɴᴋ* @tag
  ✨ ${prefix}*ᴘᴏᴋᴇ* @tag       | ✨ ${prefix}*ʙɪᴛᴇ* @tag
  ✨ ${prefix}*ᴛɪᴄᴋʟᴇ* @tag     | ✨ ${prefix}*ʏᴇᴇᴛ* @tag
  ✨ ${prefix}*ᴋɪʟʟ* @tag       | ✨ ${prefix}*ʙᴜʟʟʏ* @tag
  ✨ ${prefix}*sᴘᴀɴᴋ* @tag      | ✨ ${prefix}*ʟɪᴄᴋ* @tag
  ✨ ${prefix}*ɴᴏᴍ* @tag        | ✨ ${prefix}*ᴄʀʏ*
  ✨ ${prefix}*ᴅᴀɴᴄᴇ*           | ✨ ${prefix}*ʜᴀᴘᴘʏ*
  ✨ ${prefix}*sᴍɪʟᴇ*           | ✨ ${prefix}*ᴡɪɴᴋ*
  ✨ ${prefix}*ᴡᴀᴠᴇ*            | ✨ ${prefix}*sᴍᴜɢ*
  ✨ ${prefix}*ʙʟᴜsʜ*           | ✨ ${prefix}*ᴄʀɪɴɢᴇ*
  ✨ ${prefix}*ɢʟᴏᴍᴘ*           | ✨ ${prefix}*ʜɪɢʜғɪᴠᴇ*
  ✨ ${prefix}*ʜᴀɴᴅʜᴏʟᴅ*        | ✨ ${prefix}*ᴀᴡᴏᴏ*
  ✨ ${prefix}*sʜɪɴᴏʙᴜ*         | ✨ ${prefix}*ғᴇᴇᴅ*
  ✨ ${prefix}*ᴍᴇᴏᴡ*            | ✨ ${prefix}*ᴡᴏᴏғ*
  ✨ ${prefix}*ʟɪᴢᴀʀᴅ*          | ✨ ${prefix}*ɢᴏᴏsᴇ*

🎞️  *⚙️ 𝐆𝐈𝐅  𝐓𝐎𝐎𝐋𝐒*
  🎞️ ${prefix}*ᴛᴏɢɪғ* (Reply to sticker/video/GIF)
───────────────────────────
⭐  _Type commands with prefix to trigger animated GIF reactions!_`}

global.ownermenu = (prefix) => {
return `🖥️  *𝐌𝐀𝐈𝐍𝐅𝐑𝐀𝐌𝐄  𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑  𝐂𝐎𝐍𝐒𝐎𝐋𝐄*  🖥️
───────────────────────────
💻  *SYSTEM:*  [ OVERRIDE GRANTED ]
👤  *Developer Authorization:*  [ LEVEL S ]

🔒  *𝐒𝐘𝐒𝐓𝐄𝐌  𝐎𝐕𝐄𝐑𝐑𝐈𝐃𝐄𝐒*
  🖥️ ${prefix}*sᴇʟғ* 🅞
  🖥️ ${prefix}*ᴘᴜʙʟɪᴄ* 🅞
  🖥️ ${prefix}*ᴄʟᴇᴀʀᴄᴀᴄʜᴇ* 🅞
  🖥️ ${prefix}*ʀᴇsᴛᴀʀᴛ* 🅞
  🖥️ ${prefix}*sʜᴜᴛᴅᴏᴡɴ* 🅞

⚙️  *𝐁𝐎𝐓  𝐂𝐎𝐍𝐅𝐈𝐆𝐔𝐑𝐀𝐓𝐈𝐎𝐍*
  ⚙️ ${prefix}*sᴇᴛᴠᴀʀ* [name]=[value] 🅞
  ⚙️ ${prefix}*ᴀʟʟᴠᴀʀ* 🅞
  ⚙️ ${prefix}*sᴇᴛᴋᴇʏ* [ai]=[key] 🅞
  ⚙️ ${prefix}*sᴇᴛʙᴏᴛɴᴀᴍᴇ* 🅞
  ⚙️ ${prefix}*sᴇᴛʙᴏᴛʙɪᴏ* 🅞
  ⚙️ ${prefix}*sᴇᴛᴘᴘʙᴏᴛ* 🅞
  ⚙️ ${prefix}*ᴅᴇʟᴘᴘʙᴏᴛ* 🅞
  ⚙️ ${prefix}*sᴇᴛᴇxɪғ* 🅞

👁️  *𝐒𝐓𝐀𝐓𝐔𝐒  𝐀𝐔𝐓𝐎𝐌𝐀𝐓𝐈𝐎𝐍𝐒*
  📥 ${prefix}*ᴀᴜᴛᴏsᴛᴀᴛᴜs* [on/off] 🅞
  📤 ${prefix}*sᴛᴀᴛᴜsʀᴇᴘʟʏ* [on/off] 🅞
  📝 ${prefix}*ᴘᴏsᴛ* [text or reply media] 🅞
  🗑️ ${prefix}*ᴅᴇʟᴘᴏsᴛ* [reply to post] 🅞
  ➕ ${prefix}*ᴀᴅᴅᴀᴜᴛᴏᴘᴏsᴛ* <tag/number/reply> 🅞
  ➖ ${prefix}*ᴅᴇʟᴀᴜᴛᴏᴘᴏsᴛ* <tag/number/reply> 🅞
  📋 ${prefix}*ʟɪsᴛᴀᴜᴛᴏᴘᴏsᴛ* 🅞

🛡️  *𝐏𝐄𝐑𝐌𝐈𝐒𝐒𝐈𝐎𝐍  𝐂𝐎𝐍𝐓𝐑𝐎𝐋*
  👑 ${prefix}*ᴄʟᴀɪᴍᴏᴡɴᴇʀ* 🅞
  🔑 ${prefix}*ᴀᴅᴅᴘʀᴇᴍ* 🅞
  🔑 ${prefix}*ᴅᴇʟᴘʀᴇᴍ* 🅞
  🔑 ${prefix}*ᴀᴅᴅᴏᴡɴᴇʀ* 🅞
  🔑 ${prefix}*ᴅᴇʟᴏᴡɴᴇʀ* 🅞

📡  *𝐁𝐑𝐎𝐀𝐃𝐂𝐀𝐒𝐓  &  𝐍𝐄𝐓𝐖𝐎𝐑𝐊*
  📡 ${prefix}*ᴊᴏɪɴ* 🅞
  📡 ${prefix}*ʙᴄᴛᴇxᴛ* 🅞
  📡 ${prefix}*ʙᴄɪᴍᴀɢᴇ* 🅞
  📡 ${prefix}*ʙᴄᴠɪᴅᴇᴏ* 🅞
  📡 ${prefix}*ᴄʀᴇᴀᴛᴇɢᴄ* 🅞

📼  *𝐌𝐄𝐃𝐈𝐀  𝐂𝐀𝐂𝐇𝐄  𝐒𝐓𝐎𝐑𝐀𝐆𝐄*
  📦 ${prefix}*ᴀᴅᴅᴠɴ* 🅞    | 📦 ${prefix}*ᴅᴇʟᴠɴ* 🅞
  📦 ${prefix}*ᴀᴅᴅsᴛɪᴄᴋᴇʀ* 🅞 | 📦 ${prefix}*ᴅᴇʟsᴛɪᴄᴋᴇʀ* 🅞
  📦 ${prefix}*ᴀᴅᴅɪᴍᴀɢᴇ* 🅞  | 📦 ${prefix}*ᴅᴇʟɪᴍᴀɢᴇ* 🅞
  📦 ${prefix}*ᴀᴅᴅᴠɪᴅᴇᴏ* 🅞  | 📦 ${prefix}*ᴅᴇʟᴠɪᴅᴇᴏ* 🅞

🧹  *𝐒𝐄𝐒𝐒𝐈𝐎𝐍  &  𝐒𝐘𝐒𝐓𝐄𝐌  𝐋𝐎𝐆𝐒*
  🧼 ${prefix}*ʀᴇsᴇᴛsᴇssɪᴏɴ* 🅞
  🧼 ${prefix}*ᴄʟᴇᴀʀsᴇssɪᴏɴ* 🅞
  🧼 ${prefix}*ғɪxsᴇssɪᴏɴ* 🅞
  📋 ${prefix}*ᴄᴍᴅʟᴏɢs* 🅞
  🧹 ${prefix}*ᴄʟᴇᴀʀʟᴏɢs* 🅞
───────────────────────────
🤖  _Mainframe status: Nominal_`}

global.othermenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

 ───『 ⚡  OTHER MENU 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ᴘɪɴɢ* 🅕 | .${prefix}*ᴍᴇɴᴜ* 🅕 | .${prefix}*ᴍʏɪᴘ* 🅕
│ .${prefix}*ʀᴇᴘᴏʀᴛʙᴜɢ* 🅕 | .${prefix}*ʟɪsᴛᴘᴇᴍ* 🅕 | .${prefix}*ʟɪsᴛsᴛɪᴄᴋᴇʀ* 🅕
│ .${prefix}*ʟɪsᴛɪᴍᴀɢᴇ* 🅕 | .${prefix}*ʟɪsᴛᴠɪᴅᴇᴏ* 🅕 | .${prefix}*ʟɪsᴛᴠɴ* 🅕
│ .${prefix}*ʟɪsᴛʙᴀᴅᴡᴏʀᴅ* 🅕 | .${prefix}*ʟɪsᴛᴘᴄ* 🅕 | .${prefix}*ʟɪsᴛɢᴄ* 🅕
│ .${prefix}*ᴏᴡɴᴇʀ* 🅕 | .${prefix}*ʀᴇɴᴛʙᴏᴛ* 🅕 | .${prefix}*ʟɪsᴛʀᴇɴᴛʙᴏᴛ* 🅕
│ .${prefix}*ᴅᴏɴᴀᴛᴇ* 🅕 | .${prefix}*sᴇɴᴅ* 🅕 | .${prefix}*ᴏʙғᴜsᴄᴀᴛᴇ* 🅕
│ .${prefix}*sᴛʏʟᴇᴛᴇxᴛ* 🅕 | .${prefix}*ғʟɪᴘᴛᴇxᴛ* 🅕 | .${prefix}*ᴛᴛs* 🅕
│ .${prefix}*sᴀʏ* 🅕 | .${prefix}*ᴛᴏɢɪғ* 🅕 | .${prefix}*ᴛᴏǫʀ* 🅕
│ .${prefix}*ʙᴀss* 🅕 | .${prefix}*ʙʟᴏᴡɴ* 🅕 | .${prefix}*ᴅᴇᴇᴘ* 🅕
│ .${prefix}*ᴇᴀʀʀᴀᴘᴇ* 🅕 | .${prefix}*ғᴀsᴛ* 🅕 | .${prefix}*ᴘᴀᴛ* 🅕
│ .${prefix}*ɴɪɢʜᴛᴄᴏʀᴇ* 🅕 | .${prefix}*ᴠᴇʀsᴇ* 🅕 | .${prefix}*ʀᴏʙᴏᴛ* 🅕
│ .${prefix}*sʟᴏᴡ* 🅕 | .${prefix}*sᴍᴏᴏᴛʜ* 🅕 | .${prefix}*sǫᴜɪʀʀᴇʟ* 🅕
│ .${prefix}*ᴛɪɴʏᴜʀʟ* 🅕 | .${prefix}*ᴛɪɴʏᴜʀʟ* 🅕 | .${prefix}*ᴛᴏᴠɴ* 🅕
│ .${prefix}*ᴛᴏᴀᴜᴅɪᴏ* 🅕 | .${prefix}*ᴛᴏᴍᴘ𝟥* 🅕 | .${prefix}*ᴛᴏᴍᴘ𝟦🅕*
│ .${prefix}*ᴛᴏɪᴍɢ* 🅕 | .${prefix}*ᴛᴏᴏɴᴄᴇ* 🅕 | .${prefix}*ᴠᴠ* 🅕
│ .${prefix}*sᴛɪᴄᴋᴇʀ* 🅕 | .${prefix}*ᴛᴀᴋᴇ* 🅟 | .${prefix}*ᴍᴏᴊɪ* 🅕
│ .${prefix}*ᴠᴏʟᴜᴍᴇ* 🅕 | .${prefix}*ʙɪɴᴀʀʏ* 🅕 | .${prefix}*ᴅʙɪɴᴀʀʏ* 🅕
│ .${prefix}*ssᴡᴇʙ* 🅕 | .${prefix}*ǫᴜᴏᴛᴇᴅ* 🅕 | .${prefix}*ʀᴜɴᴛɪᴍᴇ* 🅕
│ .${prefix}*sᴏᴜɴᴅ𝟣* - sound161 🅕
│ TOTAL COMMANDS
│ LIST : 55
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA

`}

global.downloadmenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

 ───『 ⚡  DOWNLOAD MENU 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ᴛɪᴋᴛᴏᴋ* 🅕 | .${prefix}*ᴛɪᴋᴛᴏᴋᴀᴜᴅɪᴏ* 🅕 | .${prefix}*ᴀᴘᴋ* 🅕
│ .${prefix}*ᴀᴘᴋᴅʟ* 🅕 | .${prefix}*ᴀᴘᴋᴠᴇʀ* 🅕 | .${prefix}*ʏᴛsᴇᴀʀᴄʜ* 🅕
│ .${prefix}*ᴘʟᴀʏ* 🅕 | .${prefix}*ʏᴛᴍᴘ𝟥* 🅕 | .${prefix}*ʏᴛᴍᴘ𝟦* 🅕
│ .${prefix}*ɢᴏᴏɢʟᴇ* 🅕 | .${prefix}*ɪᴍᴅʙ* 🅕 | .${prefix}*ᴡᴇᴀᴛʜᴇʀ* 🅕
│ .${prefix}*ᴡᴀɴᴜᴍʙᴇʀ* 🅕 | .${prefix}*ɪɴsᴛᴀɪᴍɢ* 🅕 | .${prefix}*ɪɴsᴛᴀᴠɪᴅ* 🅕
│ .${prefix}*ғʙᴠɪᴅ* 🅕 | .${prefix}*ᴛᴡɪᴛᴛᴇʀᴠɪᴅ* 🅕 | .${prefix}*ᴛᴇʟᴇsᴛɪᴄᴋ* 🅟
│ .${prefix}*sᴘᴏᴛɪғʏ* 🅟 | .${prefix}*ɢɪᴛᴄʟᴏɴᴇ* 🅕 | .${prefix}*ʜᴀᴘᴘʏᴍᴏᴅ* 🅕
│ .${prefix}*ɢᴅʀɪᴠᴇ* 🅕 | .${prefix}*ᴘɪɴᴛᴇʀᴇsᴛ* 🅕 | .${prefix}*ʀɪɴɢᴛᴏɴᴇ* 🅕
│ LIST : 24
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA

`}

global.groupmenu = (prefix) => {
return `🛡️  *𝐆𝐔𝐈𝐋𝐃  𝐀𝐃𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐓𝐈𝐎𝐍*  🛡️
───────────────────────────
👥  _Management suite for Guild Masters & Moderators_

📢  *𝐆𝐔𝐈𝐋𝐃  𝐁𝐑𝐎𝐀𝐃𝐂𝐀𝐒𝐓*
  ├ ${prefix}*ʜɪᴅᴇᴛᴀɢ* 🅖
  ├ ${prefix}*ᴛᴏᴛᴀɢ* 🅖
  └ ${prefix}*ᴛᴀɢᴀʟʟ* 🅖

🛡️  *𝐆𝐔𝐈𝐋𝐃  𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘*
  ├ ${prefix}*ᴀɴᴛɪʟɪɴᴋ* 🅖
  ├ ${prefix}*ᴀɴᴛɪsᴛᴀᴛᴜs* 🅖
  ├ ${prefix}*ᴀɴᴛɪʟɪɴᴋɢᴄ* 🅖
  ├ ${prefix}*ᴀɴᴛɪʟɪɴᴋᴀʟʟ* 🅖
  ├ ${prefix}*ᴀɴᴛɪᴡᴀᴍᴇ* 🅖
  ├ ${prefix}*ᴀɴᴛɪᴠɪʀᴜs* 🅖
  ├ ${prefix}*ᴀɴᴛɪᴛᴏxɪᴄ* 🅖
  └ ${prefix}*ɴsғᴡ* 🅖

🔗  *𝐆𝐔𝐈𝐋𝐃  𝐋𝐈𝐍𝐊  𝐌𝐈𝐓𝐈𝐆𝐀𝐓𝐈𝐎𝐍*
  ├ ${prefix}*ᴀɴᴛɪʟɪɴᴋᴛɪᴋᴛᴏᴋ* 🅖
  ├ ${prefix}*ᴀɴᴛɪʟɪɴᴋғʙ* 🅖
  ├ ${prefix}*ᴀɴᴛɪʟɪɴᴋᴛᴡɪᴛᴛᴇʀ* 🅖
  ├ ${prefix}*ᴀɴᴛɪʟɪɴᴋɪɢ* 🅖
  ├ ${prefix}*ᴀɴᴛʟɪɴᴋᴛɢ* 🅖
  ├ ${prefix}*ᴀɴᴛɪʟɪɴᴋʏᴛᴠɪᴅ* 🅖
  └ ${prefix}*ᴀɴᴛɪʟɪɴᴋʏᴛᴄʜ* 🅖

💼  *𝐌𝐄𝐌𝐁𝐄𝐑  𝐂𝐎𝐍𝐓𝐑𝐎𝐋*
  ├ ${prefix}*ᴋɪᴄᴋ* 🅖
  ├ ${prefix}*ᴀᴅᴅ* 🅖
  ├ ${prefix}*ᴘʀᴏᴍᴏᴛᴇ* 🅖
  ├ ${prefix}*ᴅᴇᴍᴏᴛᴇ* 🅖
  └ ${prefix}*ɢᴇᴛʙɪᴏ* 🅖

⚙️  *𝐆𝐔𝐈𝐋𝐃  𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*
  ├ ${prefix}*ᴏᴘᴇɴ* 🅖
  ├ ${prefix}*ᴄʟᴏsᴇ* 🅖
  ├ ${prefix}*ᴏᴘᴇɴᴛɪᴍᴇ* 🅖
  ├ ${prefix}*ᴄʟᴏsᴇᴛɪᴍᴇ* 🅖
  ├ ${prefix}*sᴇᴛᴘᴘɢʀᴏᴜᴘ* 🅖
  ├ ${prefix}*ᴅᴇʟᴘᴘɢʀᴏᴜᴘ* 🅖
  ├ ${prefix}*sᴇᴛɴᴀᴍᴇ* 🅖
  ├ ${prefix}*sᴇᴛᴅᴇsᴄ* 🅖
  ├ ${prefix}*ɢʀᴏᴜᴘʟɪɴᴋ* 🅖
  ├ ${prefix}*ʀᴇsᴇᴛʟɪɴᴋ* 🅖
  └ ${prefix}*ᴇᴅɪᴛɪɴғᴏ* 🅖

🎟️  *𝐄𝐍𝐓𝐑𝐘  𝐑𝐄𝐐𝐔𝐄𝐒𝐓𝐒*
  ├ ${prefix}*ʟɪsᴛʀᴇǫᴜᴇsᴛs* 🅖
  ├ ${prefix}*ᴀᴄᴄᴇᴘᴛ* 🅖
  └ ${prefix}*ʀᴇᴊᴇᴄᴛ* 🅖

💬  *𝐂𝐎𝐌𝐌𝐔𝐍𝐈𝐓𝐘  𝐆𝐀𝐓𝐇𝐄𝐑𝐈𝐍𝐆𝐒*
  ├ ${prefix}*ᴠᴏᴛᴇ* 🅖
  ├ ${prefix}*ᴜᴘᴠᴏᴛᴇ* 🅖
  ├ ${prefix}*ᴅᴏᴡɴᴠᴏᴛᴇ* 🅖
  ├ ${prefix}*ᴄʜᴇᴄᴋᴠᴏᴛᴇ* 🅖
  └ ${prefix}*ᴅᴇʟᴠᴏᴛᴇ* 🅖

🌸  *𝐀𝐔𝐓𝐎𝐌𝐀𝐓𝐈𝐎𝐍*
  ├ ${prefix}*ᴡᴇʟᴄᴏᴍᴇ* 🅖
  ├ ${prefix}*ɢᴏᴏᴅʙʏᴇ* 🅖
  ├ ${prefix}*ᴀᴜᴛᴏsᴛɪᴄᴋᴇʀɢᴄ* 🅖
  └ ${prefix}*ʀᴇᴀᴄᴛ* 🅖
───────────────────────────
⭐  _Guild Hall Shielding: Active_`}

global.funmenu = (prefix) => {
return `👑  *𝐂𝐇𝐄𝐄𝐌𝐒  𝐅𝐔𝐍  𝐃𝐀𝐒𝐇𝐁𝐎𝐀𝐑𝐃*  👑
───────────────────────────
📊  *Legend:*
  🟢 🅕 : Free User   |   🟣 🅟 : Premium User
  🔵 🅖 : Group Only  |   👑 🅞 : Bot Owner

🎮  *𝐌𝐈𝐍𝐈  𝐆𝐀𝐌𝐄𝐒*
  ❏ ${prefix}*ᴛɪᴄᴛᴀᴄᴛᴏᴇ* 🅕
  ❏ ${prefix}*sᴜɪᴛ* 🅕
  ❏ ${prefix}*ᴍᴀᴛʜ* 🅕

🃏  *𝐏𝐀𝐑𝐓𝐘  &  𝐃𝐀𝐑𝐄*
  ❏ ${prefix}*ᴛʀᴜᴛʜ* 🅕
  ❏ ${prefix}*ᴅᴀʀᴇ* 🅕
  ❏ ${prefix}*ᴄᴏᴜᴘʟᴇ* 🅕
  ❏ ${prefix}*sᴏᴜʟᴍᴀᴛᴇ* 🅕

📈  *𝐌𝐄𝐓𝐄𝐑  𝐂𝐇𝐄𝐂𝐊𝐄𝐑𝐒*
  ❏ ${prefix}*sᴛᴜᴘɪᴅᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ʜᴀɴᴅsᴏᴍᴇᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ᴜɴᴄʟᴇᴀɴᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ʜᴏᴛᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*sᴍᴀʀᴛᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ɢʀᴇᴀᴛᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ᴇᴠɪʟᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ᴅᴏɢᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ᴄᴏᴏʟᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ᴡᴀɪғᴜᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ᴀᴡᴇsᴏᴍᴇᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ɢᴀʏᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ᴄᴜᴛᴇᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ʟᴇsʙɪᴀɴᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ʜᴏʀɴʏᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ᴘʀᴇᴛᴛʏᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ʟᴏᴠᴇʟʏᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ᴜɢʟʏᴄʜᴇᴄᴋ* 🅕
  ❏ ${prefix}*ᴄʜᴇᴄᴋᴍᴇ* 🅕

🔮  *𝐂𝐎𝐒𝐌𝐈𝐂  𝐎𝐑𝐀𝐂𝐋𝐄*
  ❏ ${prefix}*ᴄᴀɴ* 🅕
  ❏ ${prefix}*ɪs* 🅕
  ❏ ${prefix}*ᴡʜᴇɴ* 🅕
  ❏ ${prefix}*ᴡʜᴇʀᴇ* 🅕
  ❏ ${prefix}*ᴡʜᴀᴛ* 🅕
  ❏ ${prefix}*ʜᴏᴡ* 🅕
  ❏ ${prefix}*ʀᴀᴛᴇ* 🅕

🎭  *𝐀𝐍𝐈𝐌𝐀𝐓𝐄𝐃  𝐑𝐎𝐋𝐄𝐏𝐋𝐀𝐘*
  ❏ ${prefix}*sʟᴀᴘ* 🅕    |  ❏ ${prefix}*ᴋɪss* 🅕
  ❏ ${prefix}*ʜᴜɢ* 🅕     |  ❏ ${prefix}*ᴘᴀᴛ* 🅕
  ❏ ${prefix}*ʟɪᴄᴋ* 🅕    |  ❏ ${prefix}*ʙɪᴛᴇ* 🅕
  ❏ ${prefix}*ᴄʀʏ* 🅕     |  ❏ ${prefix}*ᴋɪʟʟ* 🅕
  ❏ ${prefix}*ʏᴇᴇᴛ* 🅕    |  ❏ ${prefix}*ʙᴜʟʟʏ* 🅕
  ❏ ${prefix}*ʙᴏɴᴋ* 🅕    |  ❏ ${prefix}*ᴡɪɴᴋ* 🅕
  ❏ ${prefix}*ᴘᴏᴋᴇ* 🅕    |  ❏ ${prefix}*ɴᴏᴍ* 🅕
  ❏ ${prefix}*sᴍɪʟᴇ* 🅕   |  ❏ ${prefix}*ᴡᴀᴠᴇ* 🅕
  ❏ ${prefix}*ᴀᴡᴏᴏ* 🅕    |  ❏ ${prefix}*ʙʟᴜsʜ* 🅕
  ❏ ${prefix}*sᴍᴜɢ* 🅕    |  ❏ ${prefix}*ɢʟᴏᴍᴘ* 🅕
  ❏ ${prefix}*ʜᴀᴘᴘʏ* 🅕   |  ❏ ${prefix}*ᴅᴀɴᴄᴇ* 🅕
  ❏ ${prefix}*ᴄʀɪɴɢᴇ* 🅕  |  ❏ ${prefix}*ᴄᴜᴅᴅʟᴇ* 🅕
  ❏ ${prefix}*ʜɪɢʜғɪᴠᴇ* 🅕|  ❏ ${prefix}*sʜɪɴᴏʙᴜ* 🅕
  ❏ ${prefix}*ʜᴀɴᴅʜᴏʟᴅ* 🅕|  ❏ ${prefix}*sᴘᴀɴᴋ* 🅕
  ❏ ${prefix}*ᴛɪᴄᴋʟᴇ* 🅕  |  ❏ ${prefix}*ᴀᴠᴀᴛᴀʀ* 🅕
  ❏ ${prefix}*ғᴇᴇᴅ* 🅕    |  ❏ ${prefix}*ғᴏxɢɪʀʟ* 🅕
  ❏ ${prefix}*ɢᴇᴄɢ* 🅕

🎵  *𝐀𝐔𝐃𝐈𝐎  𝐄𝐅𝐅𝐄𝐂𝐓𝐒*
  ❏ ${prefix}*sᴏᴜɴᴅ1* - sound161 🅕
───────────────────────────
⭐  _Type any command with prefix to start!_`}

global.gamemenu = (prefix) => {
return `🎮  *𝐂𝐇𝐄𝐄𝐌𝐒  𝐆𝐀𝐌𝐄  𝐃𝐀𝐒𝐇𝐁𝐎𝐀𝐑𝐃*  🎮
───────────────────────────
💰  *Play, Win, & Earn Cheems Coins!*

🟢 🅕 : Free User   |   🟣 🅟 : Premium User

🎰  *𝐂𝐀𝐒𝐈𝐍𝐎  &  𝐁𝐄𝐓𝐓𝐈𝐍𝐆*
  ❏ ${prefix}*sʟᴏᴛ* <bet> 🅕
    _Spin the emoji slot machine for 2x - 100x rewards!_
  ❏ ${prefix}*ᴄᴏɪɴғʟɪᴘ* <bet> <heads/tails> 🅕
    _Flip a double-or-nothing coin!_
  ❏ ${prefix}*ʙʟᴀᴄᴋᴊᴀᴄᴋ* <bet> 🅕
    _Play the legendary 21 card game vs the dealer!_
  ❏ ${prefix}*ʀᴏᴜʟᴇᴛᴛᴇ* <bet> <red/black/green> 🅕
    _Bet on the spinning wheel of fortune!_

🧠  *𝐁𝐑𝐀𝐈𝐍  𝐂𝐇𝐀𝐋𝐋𝐄𝐍𝐆𝐄𝐒*
  ❏ ${prefix}*ᴛʀɪᴠɪᴀ* 🅕
    _Answer general knowledge questions to earn coins!_
  ❏ ${prefix}*ᴍᴀᴛʜ* <easy/medium/hard> 🅕
    _Solve fast arithmetic under pressure!_

⚔️  *𝐌𝐔𝐋𝐓𝐈𝐏𝐋𝐀𝐘𝐄𝐑  𝐃𝐔𝐄𝐋𝐒*
  ❏ ${prefix}*ᴛɪᴄᴛᴀᴄᴛᴏᴇ* <room_name> 🅕
    _Classic 3x3 grid duel against a friend!_
  ❏ ${prefix}*sᴜɪᴛ* @mention 🅕
    _Rock-Paper-Scissors PvP showdown!_

👑  *𝐏𝐋𝐀𝐘𝐄𝐑  𝐏𝐑𝐎𝐅𝐈𝐋𝐄*
  ❏ ${prefix}*ᴘʀᴏғɪʟᴇ* 🅕
    _Check your rank, experience (XP), and coin balance!_
  ❏ ${prefix}*ᴄʟᴀɪᴍ* 🅕
    _Claim your daily free 500 coin allowance!_
───────────────────────────
⭐  _Earn coins to unlock premium features and rank up!_`}

global.stalkermenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

 ───『 STALKER MENU 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ɢsᴛᴀʟᴋ* 🅕 | .${prefix}*sᴛᴀʟᴋ* 🅕 | .${prefix}*ᴍʟsᴛᴀʟᴋ* 🅕
│ .${prefix}*ɴᴘᴍsᴛᴀʟᴋ* 🅕 | .${prefix}*ɢʜsᴛᴀʟᴋ* 🅕
│ TOTAL COMMANDS
│ LIST : 5
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA

`}

global.stickermenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

 ───『 ⚡  STICKER 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ɢᴏᴏsᴇ* 🅕 | .${prefix}*ᴡᴏᴏғ* 🅕 | .${prefix}*𝟪ʙᴀʟʟ* 🅕
│ .${prefix}*ʟɪᴢᴀʀᴅ* 🅕 | .${prefix}*ᴍᴇᴏᴡ* 🅕 | .${prefix}*ɢᴜʀᴀ* 🅕
│ .${prefix}*ᴅᴏɢᴇ* 🅕 | .${prefix}*ᴘᴀᴛʀɪᴄᴋ* 🅕 | .${prefix}*ʟᴏᴠᴇsᴛɪᴄᴋ* 🅕
│ TOTAL COMMANDS
│ LIST : 9
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA

`}

global.databasemenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

 ───『 DATABASE MENU 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*sᴇᴛᴄᴍᴅ* 🅕 | .${prefix}*ᴅᴇʟᴄᴍᴅ* 🅕 | .${prefix}*ʟɪsᴛᴄᴍᴅ* 🅕
│ .${prefix}*ʟᴏᴄᴋᴄᴍᴅ* 🅕 | .${prefix}*ᴀᴅᴅᴍsɢ* 🅕 | .${prefix}*ᴅᴇʟᴍsɢ* 🅕
│ .${prefix}*ɢᴇᴛᴍsɢ* 🅕 | .${prefix}*ʟɪsᴛᴍsɢ* 🅕
│ TOTAL COMMANDS
│ LIST : 8
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA

`}

global.aimenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

 ───『 GEMINI & AI 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ᴄʜᴀᴛʙᴏᴛ* 🅞 | .${prefix}*ɢᴇᴍɪɴɪ* 🅕 | .${prefix}*ᴀɪ* 🅕
│ .${prefix}*ɢᴘᴛ* 🅕 | .${prefix}*ᴄʜᴀᴛɢᴘᴛ* 🅕 | .${prefix}*ᴏᴘᴇɴᴀɪ* 🅕
│ .${prefix}*ʙᴀʀᴅ* 🅕 | .${prefix}*ᴀsᴋ* 🅕 | .${prefix}*ᴀɪᴍᴀɢᴇ* 🅕
│ .${prefix}*ɪᴍᴀɢᴇɴ* 🅕 | .${prefix}*ɢᴇɴɪᴍᴀɢᴇ* 🅕 | .${prefix}*ɪᴍᴀɢɪɴᴇ* 🅕
│ .${prefix}*ǫᴡᴇɴ* 🅕 | .${prefix}*ʀᴇᴍɪɴɪ* 🅕
│ LIST : 14
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA

`}

global.bugmenu = (prefix) => {
return `⚔️『 𝘾𝙇𝙄𝙉𝙏𝙊𝙉 𝘽𝙊𝙏 𝙈𝘿8 』⚔️
───────────────────────────
  ☣️ *BUG & WAR SYSTEM*
───────────────────────────
🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

 ───『 BUG & WAR SYSTEM 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*sᴇᴛᴏᴛᴘ* 🅞 | .${prefix}*ʙᴜɢᴘ* 🅞 | .${prefix}*ʙᴜɢʀ* 🅞
│ TOTAL COMMANDS
│ LIST : 3
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA


───────────────────────────
      ⚡ 𝙇𝙀𝙇𝙊𝙋 ⚡
───────────────────────────`}

global.randphotomenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

 ───『 ⚡  RANDOM PHOTO 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ᴀᴇsᴛʜᴇᴛɪᴄ* 🅕 | .${prefix}*ᴄᴏғғᴇᴇ* 🅕 | .${prefix}*ᴡɪᴋɪᴍᴇᴅɪᴀ* 🅕
│ .${prefix}*ᴡᴀʟʟᴘᴀᴘᴇʀ* 🅕 | .${prefix}*ᴀʀᴛ* 🅕 | .${prefix}*ʙᴛs* 🅕
│ .${prefix}*ᴅᴏɢᴡᴏᴏғ* 🅕 | .${prefix}*ᴄᴀᴛᴍᴇᴏᴡ* 🅕 | .${prefix}*ʟɪᴢᴀʀᴅᴘɪᴄ* 🅕
│ .${prefix}*ɢᴏᴏsᴇʙɪʀᴅ* 🅕 | .${prefix}*𝟪ʙᴀʟʟᴘᴏᴏʟ* 🅕 | .${prefix}*ᴄᴏsᴘʟᴀʏ* 🅕
│ .${prefix}*ʜᴀᴄᴋᴇʀ* 🅕 | .${prefix}*ᴄʏʙᴇʀ* 🅕 | .${prefix}*ɢᴀᴍᴇᴡᴀʟʟᴘᴀᴘᴇʀ* 🅕
│ .${prefix}*sʟᴀᴍɪᴄ* 🅕 | .${prefix}*ᴊᴇɴɴɪᴇ* 🅕 | .${prefix}*ᴊɪsᴏ* 🅕
│ .${prefix}*sᴀᴛᴀɴɪᴄ* 🅕 | .${prefix}*ᴊᴜsᴛɪɴᴀ* 🅕 | .${prefix}*ᴄᴀʀᴛᴏᴏɴ* 🅕
│ .${prefix}*ᴘᴇɴᴛᴏʟ* 🅕 | .${prefix}*ᴄᴀᴛ* 🅕 | .${prefix}*ᴋᴘᴏᴘ* 🅕
│ .${prefix}*ᴇʀᴏ* 🅕 | .${prefix}*ʟɪsᴀ* 🅕 | .${prefix}*sᴘᴀᴄᴇ* 🅕
│ .${prefix}*ᴄᴀʀ* 🅕 | .${prefix}*ᴛᴇᴄʜɴᴏʟᴏɢʏ* 🅕 | .${prefix}*ʙɪᴋᴇ* 🅕
│ .${prefix}*sʜᴏʀᴛǫᴜᴏᴛᴇ* 🅕 | .${prefix}*ᴀɴᴛɪᴡᴏʀᴋ* 🅕 | .${prefix}*ʜᴀᴄᴋɪɴɢ* 🅕
│ .${prefix}*ʙᴏɴᴇᴋᴀ* 🅕 | .${prefix}*ʀᴏsᴇ* 🅕 | .${prefix}*ʏᴜᴊɪɴ* 🅕
│ .${prefix}*ᴜʟᴢᴢᴀɴɢʙᴏʏ* 🅕 | .${prefix}*ᴜʟᴢᴢᴀɴɢɢɪʀʟ* 🅕 | .${prefix}*ᴡᴀʟʟᴍʟ* 🅕
│ .${prefix}*ᴡᴀʟʟᴘʜᴏɴᴇ* 🅕 | .${prefix}*ᴍᴏᴜɴᴛᴀɪɴ* 🅕 | .${prefix}*ɢᴏᴏsᴇ* 🅕
│ .${prefix}*ᴘʀᴏғɪʟᴇᴘɪᴄ* 🅕 | .${prefix}*ᴄᴏᴜᴘʟᴇᴘɪᴄ* 🅕 | .${prefix}*ᴘʀᴏɢʀᴀᴍᴍɪɴɢ* 🅕
│ .${prefix}*ᴘᴜʙɢ* 🅕 | .${prefix}*ʙʟᴀᴄᴋᴘɪɴᴋ* 🅕 | .${prefix}*ʀᴀɴᴅᴏᴍʙᴏʏ* 🅕
│ .${prefix}*ʀᴀɴᴅᴏᴍɢɪʀʟ* 🅕 | .${prefix}*ʜɪᴊᴀʙ* 🅕 | .${prefix}*ᴄʜɪɴᴇsᴇ* 🅕
│ .${prefix}*ɪɴᴅᴏ* 🅕 | .${prefix}*ᴊᴀᴘᴀɴᴇsᴇ* 🅕 | .${prefix}*ᴋᴏʀᴇᴀɴ* 🅕
│ .${prefix}*ᴍᴀʟᴀʏ* 🅕 | .${prefix}*ᴛʜᴀɪ* 🅕 | .${prefix}*ᴠɪᴇᴛɴᴀᴍᴇsᴇ* 🅕
│ TOTAL COMMANDS
│ LIST : 57
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA

`}

global.randvideomenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

 ───『 ⚡  RANDOM VIDEO 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ᴛɪᴋᴛᴏᴋɢɪʀʟ* 🅕 | .${prefix}*ᴛɪᴋᴛᴏᴋɴᴜᴋᴛʜʏ* 🅕 | .${prefix}*ᴛɪᴋᴛᴏᴋᴋᴀʏᴇs* 🅕
│ .${prefix}*ᴛɪᴋᴛᴏᴋᴘᴀɴʀɪᴋᴀ* 🅕 | .${prefix}*ᴛɪᴋᴛᴏᴋɴᴏᴛɴᴏᴛ* 🅕 | .${prefix}*ᴛɪᴋᴛᴏᴋɢʜᴇᴀ* 🅕
│ .${prefix}*ᴛɪᴋᴛᴏᴋsᴀɴᴛᴜʏ* 🅕 | .${prefix}*ᴛɪᴋᴛᴏᴋʙᴏᴄɪʟ* 🅕
│ TOTAL COMMANDS
│ LIST : 8
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA

`}

global.textpromenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

 ───『 ⚡  TEXTPRO MAKER 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ᴄᴀɴᴅʏ* 🅕 | .${prefix}*ᴄʜʀɪsᴛᴍᴀs* 🅕 | .${prefix}*𝟥ᴅᴄʜʀɪsᴛᴍᴀs* 🅕
│ .${prefix}*sᴘᴀʀᴋʟᴇᴄʜʀɪsᴛᴍᴀs* 🅕 | .${prefix}*ᴅᴇᴇᴘsᴇᴀ* 🅕 | .${prefix}*sᴄɪғɪ* 🅕
│ .${prefix}*ʀᴀɪɴʙᴏᴡ* 🅕 | .${prefix}*ᴡᴀᴛᴇʀᴘɪᴘᴇ* 🅕 | .${prefix}*sᴘᴏᴏᴋʏ* 🅕
│ .${prefix}*ᴘᴇɴᴄɪʟ* 🅕 | .${prefix}*ᴄɪʀᴄᴜɪᴛ* 🅕 | .${prefix}*ᴅɪsᴄᴏᴠᴇʀʏ* 🅕
│ .${prefix}*ᴍᴇᴛᴀʟɪᴄ* 🅕 | .${prefix}*ᴀᴄᴛɪᴏɴ* 🅕 | .${prefix}*ᴅᴇᴍᴏɴ* 🅕
│ .${prefix}*ᴛʀᴀɴsғᴏʀᴍᴇʀ* 🅕 | .${prefix}*ʙᴇʀʀʏ* 🅕 | .${prefix}*ᴛʜᴜɴᴅᴇʀ* 🅕
│ .${prefix}*ᴍᴀɢᴍᴀ* 🅕 | .${prefix}*𝟥ᴅsᴛᴏɴᴇ* 🅕 | .${prefix}*ɴᴇᴏɴʟɪɢʜᴛ* 🅕
│ .${prefix}*ɢʟɪᴛᴄʜ* 🅕 | .${prefix}*ʜᴀʀʀʏᴘᴏᴛᴛᴇʀ* 🅕 | .${prefix}*ʙʀᴏᴋᴇɴɢʟᴀss* 🅕
│ .${prefix}*ᴘᴀᴘᴇʀᴄᴜᴛ* 🅕 | .${prefix}*ᴡᴀᴛᴇʀᴄᴏʟᴏʀ* 🅕 | .${prefix}*ᴍᴜʟᴛɪᴄᴏʟᴏʀ* 🅕
│ .${prefix}*ɴᴇᴏɴᴅᴇᴠɪʟ* 🅕 | .${prefix}*ᴜɴᴅᴇʀᴡᴀᴛᴇʀ* 🅕 | .${prefix}*ɢʀᴀғғɪᴛɪʙɪᴋᴇ* 🅕
│ .${prefix}*sɴᴏᴡ* 🅕 | .${prefix}*ᴄʟᴏᴜᴅ* 🅕 | .${prefix}*ʜᴏɴᴇʏ* 🅕
│ .${prefix}*ɪᴄᴇ* 🅕 | .${prefix}*ғʀᴜɪᴛᴊᴜɪᴄᴇ* 🅕 | .${prefix}*ʙɪsᴄᴜɪᴛ* 🅕
│ .${prefix}*ᴡᴏᴏᴅ* 🅕 | .${prefix}*ᴄʜᴏᴄᴏʟᴀᴛᴇ* 🅕 | .${prefix}*sᴛʀᴀᴡʙᴇʀʀʏ* 🅕
│ .${prefix}*ᴍᴀᴛʀɪx* 🅕 | .${prefix}*ʙʟᴏᴏᴅ* 🅕 | .${prefix}*ᴅʀᴏᴘᴡᴀᴛᴇʀ* 🅕
│ .${prefix}*ᴛᴏxɪᴄ* 🅕 | .${prefix}*ʟᴀᴠᴀ* 🅕 | .${prefix}*ʀᴏᴄᴋ* 🅕
│ .${prefix}*ʙʟᴏᴏᴅɢʟᴀs* 🅕 | .${prefix}*ʜᴀʟʟᴏᴡᴇɴ* 🅕 | .${prefix}*ᴅᴀʀᴋɢᴏʟᴅ* 🅕
│ .${prefix}*ᴊᴏᴋᴇʀ* 🅕 | .${prefix}*ᴡɪᴄᴋᴇʀ* 🅕 | .${prefix}*ᴡᴏʀᴋ* 🅕
│ .${prefix}*sᴋᴇʟᴇᴛᴏɴ* 🅕 | .${prefix}*ʙʟᴀᴄᴋᴘɪɴᴋ* 🅕 | .${prefix}*sᴀɴᴅ* 🅕
│ .${prefix}*ɢʟᴜᴇ* 🅕 | .${prefix}*𝟣𝟫𝟣𝟩* 🅕 | .${prefix}*ʟᴇᴀᴠᴇs* 🅕
│ .${prefix}*ʀᴇᴛʀᴏ* 🅕 | .${prefix}*ᴘᴏʀɴʜᴜʙ* 🅕 | .${prefix}*𝟪ʙɪᴛ* 🅕
│ .${prefix}*ʙᴀᴛᴍᴀɴ* 🅕 | .${prefix}*𝟥ᴅʙᴏx* 🅕 | .${prefix}*ʟɪᴏɴ* 🅕
│ .${prefix}*𝟥ᴅᴀᴠᴇɴɢᴇʀs* 🅕 | .${prefix}*ᴡɪɴᴅᴏᴡ* 🅕 | .${prefix}*𝟥ᴅsᴘᴀᴄᴇ* 🅕
│ .${prefix}*ʙᴏᴋᴇʜ* 🅕 | .${prefix}*ʜᴏʟᴏɢʀᴀᴘʜɪᴄ* 🅕 | .${prefix}*ᴛʜᴇᴡᴀʟʟ* 🅕
│ .${prefix}*ᴄᴀʀʙᴏɴ* 🅕 | .${prefix}*ᴡʜɪᴛᴇʙᴇᴀʀ* 🅕 | .${prefix}*ᴍᴇᴛᴀʟʟɪᴄ* 🅕
│ .${prefix}*sᴛᴇᴇʟ* 🅕 | .${prefix}*ғᴀʙʀɪᴄ* 🅕 | .${prefix}*ᴀɴᴄɪᴇɴᴛ* 🅕
│ .${prefix}*ᴍᴀʀᴠᴇʟ* 🅕
│ TOTAL COMMANDS
│ LIST : 76
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA

`}

global.photooxymenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

 ───『 ⚡  PHOTOOXY MAKER 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*sʜᴀᴅᴏᴡ* 🅕 | .${prefix}*ᴡʀɪᴛᴇ* 🅕 | .${prefix}*ʀᴏᴍᴀɴᴛɪᴄ* 🅕
│ .${prefix}*ʙᴜʀɴᴘᴀᴘᴇʀ* 🅕 | .${prefix}*sᴍᴏᴋᴇ* 🅕 | .${prefix}*ɴᴀʀᴜᴛᴏʙᴀɴɴᴇʀ* 🅕
│ .${prefix}*ʟᴏᴠᴇ* 🅕 | .${prefix}*ᴜɴᴅᴇʀɢʀᴀss* 🅕 | .${prefix}*ᴅᴏᴜʙʟᴇʟᴏᴠᴇ* 🅕
│ .${prefix}*ᴄᴏғғᴇᴄᴜᴘ* 🅕 | .${prefix}*ᴜɴᴅᴇʀᴡᴀᴛᴇʀᴏᴄᴇᴀɴ* 🅕 | .${prefix}*sᴍᴏᴋʏɴᴇᴏɴ* 🅕
│ .${prefix}*sᴛᴀʀsᴛᴇxᴛ* 🅕 | .${prefix}*ʀᴀɪɴʙᴏᴡᴇғғᴇᴄᴛ* 🅕 | .${prefix}*ʙᴀʟʟᴏᴏɴᴛᴇxᴛ* 🅕
│ .${prefix}*ᴍᴇᴛᴀʟʟɪᴄᴇғғᴇᴄᴛ* 🅕 | .${prefix}*ᴇᴍʙʀᴏɪᴅᴇʀʏᴛᴇxᴛ* 🅕 | .${prefix}*ғʟᴀᴍɪɴɢᴛᴇxᴛ* 🅕
│ .${prefix}*sᴛᴏɴᴇᴛᴇxᴛ* 🅕 | .${prefix}*ᴡʀɪᴛᴇᴀʀᴛ* 🅕 | .${prefix}*sᴜᴍᴍᴇʀᴛᴇxᴛ??*
│ .${prefix}*ᴡᴏʟғᴍᴇᴛᴀʟᴛᴇxᴛ* 🅕 | .${prefix}*ɴᴀᴛᴜʀᴇ𝟥ᴅᴛᴇxᴛ* 🅕 | .${prefix}*ʀᴏsᴇsᴛᴇxᴛ* 🅕
│ .${prefix}*ɴᴀᴛᴜʀᴇᴛʏᴘᴏɢʀᴀᴘʜʏ* 🅕 | .${prefix}*ǫᴜᴏᴛᴇsᴜɴᴅᴇʀ* 🅕 | .${prefix}*sʜɪɴᴇᴛᴇxᴛ* 🅕
│ TOTAL COMMANDS
│ LIST : 27
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA

`}

global.ephoto360menu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

 ───『 ⚡  EPHOTO360 MAKER 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ɢʟɪᴛᴄʜᴛᴇxᴛ* 🅕 | .${prefix}*ᴡʀɪᴛᴇᴛᴇxᴛ* 🅕 | .${prefix}*ᴀᴅᴠᴀɴᴄᴇᴅɢʟᴏᴡ* 🅕
│ .${prefix}*ᴛʏᴘᴏɢʀᴀᴘʜʏᴛᴇxᴛ* 🅕 | .${prefix}*ʟɢʟɪᴛᴄʜ* 🅕 | .${prefix}*ɴᴇᴏɴɢʟɪᴛᴄʜ* 🅕
│ .${prefix}*ғʟᴀɢᴛᴇxᴛ* 🅕 | .${prefix}*ғʟᴀɢ𝟥ᴅᴛᴇxᴛ* 🅕 | .${prefix}*ᴅᴇʟᴇᴛɪɴɢᴛᴇxᴛ* 🅕
│ .${prefix}*ʙʟᴀᴄᴋᴘɪɴᴋsᴛʏʟᴇ* 🅕 | .${prefix}*ɢʟᴏᴡɪɴɢᴛᴇxᴛ* 🅕 | .${prefix}*ᴜɴᴅᴇʀᴡᴀᴛᴇʀᴛᴇxᴛ* 🅕
│ .${prefix}*ʟᴏɢᴏᴍᴀᴋᴇʀ* 🅕 | .${prefix}*ᴄᴀʀᴛᴏᴏɴsᴛʏʟᴇ* 🅕 | .${prefix}*ᴘᴀᴘᴇʀᴄᴜᴛsᴛʏʟᴇ* 🅕
│ .${prefix}*ᴡᴀᴛᴇʀᴄᴏʟᴏʀᴛᴇxᴛ* 🅕 | .${prefix}*ᴀʀᴛᴄʟᴏᴜᴅs* 🅕 | .${prefix}*ʙʟᴀᴄᴋᴘɪɴᴋʟᴏɢᴏ* 🅕
│ .${prefix}*ɢʀᴀᴅɪᴇɴᴛᴛᴇxᴛ* 🅕 | .${prefix}*sᴜᴍᴍᴇʀʙᴇᴀᴄʜ* 🅕 | .${prefix}*ʟᴜxᴜʀʏɢᴏʟᴅ* 🅕
│ .${prefix}*ᴍᴜʟᴛɪᴄᴏʟᴏʀᴇᴅɴᴇᴏɴ* 🅕 | .${prefix}*sᴀɴᴅsᴜᴍᴍᴇʀ* 🅕 | .${prefix}*ɢᴀʟᴀxʏᴡᴀʟʟᴘᴀᴘᴇʀ* 🅕
│ .${prefix}*𝟣𝟫𝟣𝟩sᴛʏʟᴇ* 🅕 | .${prefix}*ᴍᴀᴋɪɴɢɴᴇᴏɴ* 🅕 | .${prefix}*ʀᴏʏᴀʟᴛᴇxᴛ* 🅕
│ .${prefix}*ᴄʀᴇᴀᴛᴇ* 🅕 | .${prefix}*ɢᴀʟᴀxʏsᴛʏʟᴇ* 🅕 | .${prefix}*ʟɪɢʜᴛᴇғғᴇᴄᴛs* 🅕
│ TOTAL COMMANDS
│ LIST : 30
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA

`}

global.nsfwmenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

 ───『 ⚡  ANIME NSFW 』───
 ───『 COMMAND LIST 』───
│
│ .${prefix}*ʜᴇɴᴛᴀɪ* 🅕 | .${prefix}*ɢɪғʜᴇɴᴛᴀɪ* 🅕 | .${prefix}*ɢɪғʙʟᴏᴡᴊᴏʙ* 🅕
│ .${prefix}*ʜᴇɴᴛᴀɪᴠɪᴅ* 🅕 | .${prefix}*ʜɴᴇᴋᴏ* 🅕 | .${prefix}*ɴᴡᴀɪғᴜ* 🅕
│ .${prefix}*ᴀɴɪᴍᴇsᴘᴀɴᴋ* 🅕 | .${prefix}*ᴛʀᴀᴘ* 🅕 | .${prefix}*ɢᴀsᴍ* 🅕
│ .${prefix}*ᴀʜᴇɢᴀᴏ* 🅕 | .${prefix}*ᴀss* 🅕 | .${prefix}*ʙᴅsᴍ* 🅕
│ .${prefix}*ʙʟᴏᴡᴊᴏʙ* 🅕 | .${prefix}*ᴄᴜᴄᴋᴏʟᴅ* 🅕 | .${prefix}*ᴄᴜᴍ* 🅕
│ .${prefix}*ᴍɪʟғ* 🅕 | .${prefix}*ʙᴀ* 🅕 | .${prefix}*ᴇʀᴏ* 🅕
│ .${prefix}*ғᴇᴍᴅᴏᴍ* 🅕 | .${prefix}*ʙᴏᴏᴛʏ* 🅕 | .${prefix}*ɢᴀɴɢʙᴀɴɢ* 🅕
│ .${prefix}*ɢʟᴀssᴇs* 🅕 | .${prefix}*ᴊᴀʜʏ* 🅕 | .${prefix}*ᴍᴀsᴛᴜʀʙᴀᴛɪᴏɴ* 🅕
│ .${prefix}*ᴍᴀɴɢᴀ* 🅕 | .${prefix}*ɴᴇᴋᴏ-ʜᴇɴᴛᴀɪ* 🅕 | .${prefix}*ɴᴇᴋᴏ-ʜᴇɴᴛᴀɪ𝟤* 🅕
│ .${prefix}*ɴsғᴡʟᴏʟɪ* 🅕 | .${prefix}*ᴏʀɢʏ* 🅕 | .${prefix}*ᴘᴀɴᴛɪᴇs* 🅕
│ .${prefix}*ᴘᴜssʏ* 🅕 | .${prefix}*ᴛᴇɴᴛᴀᴄʟᴇs* 🅕 | .${prefix}*ᴛʜɪɢʜs* 🅕
│ .${prefix}*ʏᴜʀɪ* 🅕 | .${prefix}*ᴢᴇᴛᴛᴀɪ* 🅕 | .${prefix}*ɴxxsᴇᴀʀᴄʜ* 🅟
│ .${prefix}*ɴxxᴅʟ* 🅟
│ TOTAL COMMANDS
│ LIST : 37
│ ────────────────────────
│ POWERED BY
│ CLINTON BOT ULTRA

`}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
