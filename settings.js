const chalk = require("chalk")
const fs = require("fs")
const path = require("path")

//auto presence update
global.autoReading = false //auto recording (true to on, false to off)
global.autoTyping = true //auto typing (true to on, false to off)
global.autoRecord = true //auto recording (true to on, false to off)
global.autoblockmorroco = false //auto block 212 (true to on, false to off)
global.autokickmorroco = false //auto kick 212 (true to on, false to off) 
global.antispam = true //auto kick spammer (true to on, false to off)

//pairing code setup
global.usePairingCode = true // Set to true to use Pairing Code in terminal (NO Web link or QR scan required!), set to false for QR code

// OpenAI key
global.keyopenai = process.env.OPENAI_API_KEY || ""

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
global.ownername = process.env.OWNER_NAME || "LELOP"
global.ytname = "YT: Clintonlelop"
global.socialm = "GitHub: Clintonlelop"
global.location = "Nigeria, Enugu, Enugu"

//bot identity
global.botname = process.env.BOT_NAME || "CLINTON BOT MD"
global.ownerNumber = [`${cleanOwnerNumber}@s.whatsapp.net`]
global.creator = `${cleanOwnerNumber}@s.whatsapp.net`
global.ownerweb = "https://youtube.com/@DGXeon"
global.websitex = "https://youtube.com/@DGXeon"
global.wagc = "https://whatsapp.com/channel/0029VbDlXCo3mFY8hg6bS51V"
global.themeemoji = '🗿'
global.wm = "CLINTON BOT"
global.botscript = 'https://github.com/DGXeon/CheemsBot-MD6'
global.packname = "CLINTON"
global.author = "BOT"
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
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
