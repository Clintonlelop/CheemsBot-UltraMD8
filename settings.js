const chalk = require("chalk")
const fs = require("fs")
const path = require("path")

// Timezone configuration (Africa/Lagos - WAT, UTC+1)
process.env.TZ = process.env.TZ || 'Africa/Lagos'
global.timezone = process.env.TIMEZONE || 'Africa/Lagos'

//auto presence update
global.autoReading = false //auto recording (true to on, false to off)
global.autoTyping = true //auto typing (true to on, false to off)
global.autoRecord = true //auto recording (true to on, false to off)
global.autoblockmorroco = false //auto block 212 (true to on, false to off)
global.autokickmorroco = false //auto kick 212 (true to on, false to off) 
global.antispam = true //auto kick spammer (true to on, false to off)

//pairing code setup
global.usePairingCode = true // Set to true to use Pairing Code in terminal (NO Web link or QR scan required!), set to false for QR code

// Custom API / OpenAI key
global.customApiKey = process.env.CUSTOM_API_KEY || process.env.OPENAI_API_KEY || "sk-ws-H.DDRPIYY.4Mt5.MEUCIQDewvaUX5UpNVng9yhUWlq_hzaMsVK60h_lIAtx4r4u3wIgGsCSPRsE2nl8NCPlc56rbKe4vFOUe3KQWMpSxceV99Q"
global.keyopenai = global.customApiKey

//documents variants
global.doc1 = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
global.doc2 = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
global.doc3 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
global.doc4 = 'application/zip'
global.doc5 = 'application/pdf'
global.doc6 = 'application/vnd.android.package-archive'

//owner v card
const rawOwnerNumber = process.env.OWNER_NUMBER || "2348160208114"
const cleanOwnerNumber = rawOwnerNumber.replace(/[^0-9]/g, '')

global.ownernomer = cleanOwnerNumber
global.ownernumber = cleanOwnerNumber
global.ownername = process.env.OWNER_NAME || "Clinton"
global.ytname = "YT: Clintonlelop"
global.socialm = "GitHub: Clintonlelop"
global.location = "Nigeria, Enugu, Enugu"

//bot identity
global.botname = process.env.BOT_NAME || "CLINTON BOT ULTRA MD"
global.owner = [cleanOwnerNumber, "2348029399425", "68444699525143"]
global.ownerNumber = [`${cleanOwnerNumber}@s.whatsapp.net`, "2348029399425@s.whatsapp.net", "68444699525143@lid", "245217517154312@lid"]
global.creator = `${cleanOwnerNumber}@s.whatsapp.net`
global.ownerweb = "https://github.com/Clintonlelop/CheemsBot-UltraMD8"
global.websitex = "https://github.com/Clintonlelop/CheemsBot-UltraMD8"
global.wagc = "https://wa.me/2348029399425"
global.themeemoji = '⚡'
global.wm = "CLINTON BOT ULTRA MD"
global.botscript = 'https://github.com/Clintonlelop/CheemsBot-UltraMD8'
global.packname = "CLINTON ULTRA"
global.author = "BOT MD"
global.prefa = ['','!','.','#','&']
global.sessionName = 'session'
global.hituet = 0

//media target safely loaded
const getSafeMedia = (relPath) => {
    try {
        const full = path.join(__dirname, relPath)
        if (fs.existsSync(full)) return fs.readFileSync(full)
    } catch (e) {}
    return Buffer.from('')
}

global.thum = getSafeMedia("XeonMedia/theme/cheemspic.jpg")
global.log0 = global.thum
global.err4r = global.thum
global.thumb = global.thum
global.defaultpp = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'

//menu image maker
global.flaming = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text='
global.fluming = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=fluffy-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text='
global.flarun = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=runner-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text='
global.flasmurf = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=smurfs-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text='

//messages
global.mess = {
    success: 'Here you go!',
    admin: 'This feature is only for group admins!',
    botAdmin: 'Bot must be admin first!',
    owner: 'This feature is only for the bot owner!',
    group: 'This feature is only for groups!',
    private: 'This feature is only for private chats!',
    bot: 'This feature is only for the bot!',
    wait: 'Please wait, processing...',
    premium: 'This feature is for premium users only! Contact the owner to get premium access.',
    error: 'An error occurred, please try again later.'
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
