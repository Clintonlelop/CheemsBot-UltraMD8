const chalk = require('chalk')
const fs = require('fs')

global.allmenu = (prefix, hituet) => {
return`⚔️『 𝘾𝙇𝙄𝙉𝙏𝙊𝙉 𝘽𝙊𝙏 𝙈𝘿8 』⚔️
───────────────────────────
  ⚡ *Commands Catalog*
───────────────────────────
🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

╭––『 Owner Menu 』
┆❏.self 🅞
┆❏.public 🅞
┆❏.join 🅞
┆❏.bctext 🅞
┆❏.poll 🅞
┆❏.bcimage 🅞
┆❏.bcvideo 🅞
┆❏.creategc 🅞
┆❏.setexif 🅞
┆❏.userjid 🅞
┆❏.setbotname 🅞
┆❏.setbotbio 🅞
┆❏.delppbot 🅞
┆❏.shutdown 🅞
┆❏.setppbot 🅞
┆❏.addprem 🅞
┆❏.delprem 🅞
┆❏.addowner 🅞
┆❏.delowner 🅞
┆❏.addvn 🅞
┆❏.delvn 🅞
┆❏.addsticker 🅞
┆❏.delsticker 🅞
┆❏.addimage 🅞
┆❏.delimage 🅞
┆❏.addvideo 🅞
┆❏.delvideo 🅞
┆❏.block 🅞
┆❏.unblock del 🅞
┆❏.leavegc 🅞
┆❏.pushcontact 🅞
┆❏.pushcontactv2 🅞
┆❏.autovv 🅞
┆❏.antidelete 🅞
╰–––––––––––––––༓

╭––『 Group Menu 』
┆❏.antilink 🅖
┆❏.welcome 🅖
┆❏.goodbye 🅖
┆❏.accept 🅖
┆❏.reject 🅖
┆❏.listrequests 🅖
┆❏.antiwame 🅖
┆❏.grouplink 🅖
┆❏.invite 🅖
┆❏.ephemeral 🅖
┆❏.delete 🅖
┆❏.setppgroup 🅖
┆❏.delppgroup 🅖
┆❏.setname 🅖
┆❏.setdesc 🅖
┆❏.add 🅖
┆❏.kick 🅖
┆❏.promote 🅖
┆❏.demote 🅖
┆❏.hidetag 🅖
┆❏.totag 🅖
┆❏.tagall 🅖
┆❏.editinfo 🅖
┆❏.open 🅖
┆❏.close 🅖
┆❏.opentime 🅖
┆❏.closetime 🅖
┆❏.resetlink 🅖
┆❏.getbio 🅖
┆❏.vote 🅖
┆❏.upvote 🅖
┆❏.downvote 🅖
┆❏.checkvote 🅖
┆❏.delvote 🅖
┆❏.autostickergc 🅖
┆❏.antilinkgc 🅖
┆❏.welcome 🅖
┆❏.goodbye 🅖
┆❏.accept 🅖
┆❏.reject 🅖
┆❏.listrequests 🅖
┆❏.antiwame 🅖
┆❏.antilinkall 🅖
┆❏.antilinktiktok 🅖
┆❏.antilinkfb 🅖
┆❏.antilinktwitter 🅖
┆❏.antilinkig 🅖
┆❏.antlinktg 🅖
┆❏.antilinkytvid 🅖
┆❏.antilinkytch 🅖
┆❏.antivirus 🅖
┆❏.antitoxic 🅖
┆❏.nsfw 🅖
┆❏.react 🅖
╰–––––––––––––––༓

╭––『 Download Menu 』
┆❏.tiktok 🅕
┆❏.tiktokaudio 🅕
┆❏.apk 🅕
┆❏.apkdl 🅕
┆❏.apkver 🅕
┆❏.ytsearch 🅕
┆❏.play 🅕
┆❏.ytmp3 🅕
┆❏.ytmp4 🅕
┆❏.google 🅕
┆❏.imdb 🅕
┆❏.weather 🅕
┆❏.wanumber 🅕
┆❏.instaimg 🅕
┆❏.instavid 🅕
┆❏.fbvid 🅕
┆❏.twittervid 🅕
┆❏.telestick 🅟
┆❏.spotify 🅟
┆❏.gitclone 🅕
┆❏.happymod 🅕
┆❏.gdrive 🅕
┆❏.pinterest 🅕
┆❏.ringtone 🅕
╰–––––––––––––––༓

╭––『 Random Video 』
┆❏.tiktokgirl 🅕
┆❏.tiktoknukthy 🅕
┆❏.tiktokkayes 🅕
┆❏.tiktokpanrika 🅕
┆❏.tiktoknotnot 🅕
┆❏.tiktokghea 🅕
┆❏.tiktoksantuy 🅕
┆❏.tiktokbocil 🅕
╰–––––––––––––––༓

╭––『 Stalker 』
┆❏.igstalk 🅕
┆❏.ffstalk 🅕
┆❏.mlstalk 🅕
┆❏.npmstalk 🅕
┆❏.ghstalk 🅕
╰–––––––––––––––༓

╭––『 Gemini & AI 』
┆❏.chatbot 🅞
┆❏.gemini 🅕
┆❏.ai 🅕
┆❏.gpt 🅕
┆❏.chatgpt 🅕
┆❏.openai 🅕
┆❏.bard 🅕
┆❏.ask 🅕
┆❏.aimage 🅕
┆❏.imagen 🅕
┆❏.qwen 🅕
┆❏.remini 🅕
╰–––––––––––––––༓

╭––『 Fun Menu 』
┆❏.define 🅕
┆❏.qc 🅕
┆❏.lyrics 🅕
┆❏.suit 🅕
┆❏.math 🅕
┆❏.tictactoe 🅕
┆❏.fact 🅕
┆❏.truth 🅕
┆❏.dare 🅕
┆❏.couple 🅕
┆❏.soulmate 🅕
┆❏.stupidcheck 🅕
┆❏.handsomecheck 🅕
┆❏.uncleancheck 🅕
┆❏.hotcheck 🅕
┆❏.smartcheck 🅕
┆❏.greatcheck 🅕
┆❏.evilcheck 🅕
┆❏.dogcheck 🅕
┆❏.coolcheck 🅕
┆❏.waifucheck 🅕
┆❏.awesomecheck 🅕
┆❏.gaycheck 🅕
┆❏.cutecheck 🅕
┆❏.lesbiancheck 🅕
┆❏.hornycheck 🅕
┆❏.prettycheck 🅕
┆❏.lovelycheck 🅕
┆❏.uglycheck 🅕
┆❏.pick 🅕
┆❏.quotes 🅕
┆❏.can 🅕
┆❏.is 🅕
┆❏.when 🅕
┆❏.where 🅕
┆❏.what 🅕
┆❏.how 🅕
┆❏.rate 🅕
┆❏.cry 🅕
┆❏.kill 🅕
┆❏.hug 🅕
┆❏.pat 🅕
┆❏.lick 🅕 
┆❏.kiss 🅕
┆❏.bite 🅕
┆❏.yeet 🅕
┆❏.bully 🅕
┆❏.bonk 🅕
┆❏.wink 🅕
┆❏.poke 🅕
┆❏.nom 🅕
┆❏.slap 🅕
┆❏.smile 🅕 
┆❏.wave 🅕
┆❏.awoo 🅕
┆❏.blush 🅕
┆❏.smug 🅕
┆❏.glomp 🅕 
┆❏.happy 🅕
┆❏.dance 🅕
┆❏.cringe 🅕
┆❏.cuddle 🅕
┆❏.highfive 🅕 
┆❏.shinobu 🅕
┆❏.handhold 🅕
┆❏.spank 🅕
┆❏.tickle 🅕
┆❏.avatar 🅕
┆❏.feed 🅕
┆❏.foxgirl 🅕
┆❏.gecg 🅕
┆❏.checkme 🅕
┆❏.sound1 - sound161 🅕
╰–––––––––––––––༓

╭––『 Random Photo 』
┆❏.aesthetic 🅕
┆❏.coffee 🅕
┆❏.wikimedia 🅕
┆❏.wallpaper 🅕
┆❏.art 🅕
┆❏.bts 🅕
┆❏.dogwoof 🅕
┆❏.catmeow 🅕
┆❏.lizardpic 🅕
┆❏.goosebird 🅕
┆❏.8ballpool 🅕
┆❏.cosplay 🅕
┆❏.hacker 🅕
┆❏.cyber 🅕
┆❏.gamewallpaper 🅕
┆❏.islamic 🅕
┆❏.jennie 🅕
┆❏.jiso 🅕
┆❏.satanic 🅕
┆❏.justina 🅕
┆❏.cartoon 🅕
┆❏.pentol 🅕
┆❏.cat 🅕
┆❏.kpop 🅕
┆❏.exo 🅕
┆❏.lisa 🅕
┆❏.space 🅕
┆❏.car 🅕
┆❏.technology 🅕
┆❏.bike 🅕
┆❏.shortquote 🅕
┆❏.antiwork 🅕
┆❏.hacking 🅕
┆❏.boneka 🅕
┆❏.rose 🅕
┆❏.ryujin 🅕
┆❏.ulzzangboy 🅕
┆❏.ulzzanggirl 🅕
┆❏.wallml 🅕
┆❏.wallphone 🅕
┆❏.mountain 🅕
┆❏.goose 🅕
┆❏.profilepic 🅕
┆❏.couplepic 🅕
┆❏.programming 🅕
┆❏.pubg 🅕
┆❏.blackpink 🅕
┆❏.randomboy 🅕  
┆❏.randomgirl 🅕
┆❏.hijab 🅕  
┆❏.chinese 🅕
┆❏.indo 🅕
┆❏.japanese 🅕
┆❏.korean 🅕
┆❏.malay 🅕
┆❏.thai 🅕
┆❏.vietnamese 🅕
╰–––––––––––––––༓

╭––『 Sticker 』
┆❏.goose 🅕
┆❏.woof 🅕
┆❏.8ball 🅕
┆❏.lizard 🅕
┆❏.meow 🅕
┆❏.gura 🅕
┆❏.doge 🅕
┆❏.patrick 🅕
┆❏.lovestick 🅕
╰–––––––––––––––༓

╭––『 Anime 』
┆❏.akira 🅕
┆❏.akiyama 🅕
┆❏.ana 🅕
┆❏.asuna 🅕
┆❏.ayuzawa 🅕
┆❏.boruto 🅕
┆❏.chiho 🅕
┆❏.chitoge 🅕
┆❏.cosplayloli 🅕
┆❏.cosplaysagiri 🅕
┆❏.deidara 🅕
┆❏.doraemon 🅕
┆❏.elaina 🅕
┆❏.emilia 🅕
┆❏.erza 🅕
┆❏.gremory 🅕
┆❏.hestia 🅕
┆❏.hinata 🅕
┆❏.husbu 🅕
┆❏.inori 🅕
┆❏.isuzu 🅕
┆❏.itachi 🅕
┆❏.itori 🅕
┆❏.kaga 🅕
┆❏.kagura 🅕
┆❏.kakasih 🅕
┆❏.kaori 🅕
┆❏.keneki 🅕
┆❏.kotori 🅕
┆❏.kurumi 🅕
┆❏.loli 🅕
┆❏.madara 🅕
┆❏.megumin 🅕
┆❏.mikasa 🅕
┆❏.mikey 🅕
┆❏.miku 🅕
┆❏.minato 🅕
┆❏.naruto 🅕
┆❏.neko 🅕
┆❏.neko2 🅕
┆❏.nekonime 🅕
┆❏.nezuko 🅕
┆❏.onepiece 🅕
┆❏.pokemon 🅕
┆❏.randomnime 🅕
┆❏.randomnime2 🅕
┆❏.rize 🅕
┆❏.sagiri 🅕
┆❏.sakura 🅕
┆❏.sasuke 🅕
┆❏.shina 🅕
┆❏.shinka 🅕
┆❏.shinomiya 🅕
┆❏.shizuka 🅕
┆❏.shota 🅕
┆❏.tejina 🅕
┆❏.toukachan 🅕
┆❏.tsunade 🅕
┆❏.waifu 🅕
┆❏.animewall 🅕
┆❏.yotsuba 🅕
┆❏.yuki 🅕
┆❏.yulibocil 🅕
┆❏.yumeko 🅕
┆❏.8ball 🅕
┆❏.tickle 🅕
┆❏.gecg 🅕
┆❏.feed 🅕
┆❏.animeawoo 🅕
┆❏.animemegumin 🅕
┆❏.animeshinobu 🅕
┆❏.animehandhold 🅕
┆❏.animehighfive 🅕
┆❏.animecringe 🅕
┆❏.animedance 🅕
┆❏.animehappy 🅕
┆❏.animeglomp 🅕
┆❏.animeblush 🅕
┆❏.animesmug 🅕
┆❏.animewave 🅕
┆❏.animesmille 🅕
┆❏.animepoke 🅕
┆❏.animewink 🅕
┆❏.animebonk 🅕
┆❏.animebully 🅕
┆❏.animeyeet 🅕
┆❏.animebite 🅕
┆❏.animelick 🅕
┆❏.animekill 🅕
┆❏.animecry 🅕
┆❏.animewlp 🅕
┆❏.animekiss 🅕
┆❏.animehug 🅕
┆❏.animeneko 🅕
┆❏.animepat 🅕
┆❏.animeslap 🅕
┆❏.animecuddle 🅕
┆❏.animewaifu 🅕
┆❏.animenom 🅕
┆❏.animefoxgirl 🅕
┆❏.animegecg 🅕
┆❏.animetickle 🅕
┆❏.animefeed 🅕
┆❏.animeavatar 🅕
┆❏.genshin 🅕
┆❏.anime 🅕
╰–––––––––––––––༓

╭––『 Anime NSFW 』
┆❏.hentai 🅕
┆❏.gifhentai 🅕
┆❏.gifblowjob 🅕
┆❏.hentaivid 🅕
┆❏.hneko 🅕
┆❏.nwaifu 🅕
┆❏.animespank 🅕
┆❏.trap 🅕
┆❏.gasm 🅕
┆❏.ahegao 🅕
┆❏.ass 🅕
┆❏.bdsm 🅕
┆❏.blowjob 🅕
┆❏.cuckold 🅕
┆❏.cum 🅕
┆❏.milf 🅕
┆❏.eba 🅕
┆❏.ero 🅕
┆❏.femdom 🅕
┆❏.foot 🅕
┆❏.gangbang 🅕
┆❏.glasses 🅕
┆❏.jahy 🅕
┆❏.masturbation 🅕
┆❏.manga 🅕
┆❏.neko-hentai 🅕
┆❏.neko-hentai2 🅕
┆❏.nsfwloli 🅕
┆❏.orgy 🅕
┆❏.panties 🅕 
┆❏.pussy 🅕
┆❏.tentacles 🅕
┆❏.thighs 🅕
┆❏.yuri 🅕
┆❏.zettai 🅕
┆❏.xnxxsearch 🅟
┆❏.xnxxdl 🅟
╰–––––––––––––––༓

╭––『 Textpro Maker 』
┆❏.candy 🅕 
┆❏.christmas 🅕 
┆❏.3dchristmas 🅕 
┆❏.sparklechristmas 🅕
┆❏.deepsea 🅕 
┆❏.scifi 🅕 
┆❏.rainbow 🅕 
┆❏.waterpipe 🅕 
┆❏.spooky 🅕 
┆❏.pencil 🅕 
┆❏.circuit 🅕 
┆❏.discovery 🅕 
┆❏.metalic 🅕 
┆❏.fiction 🅕 
┆❏.demon 🅕 
┆❏.transformer 🅕 
┆❏.berry 🅕 
┆❏.thunder 🅕 
┆❏.magma 🅕 
┆❏.3dstone 🅕 
┆❏.neonlight 🅕 
┆❏.glitch 🅕 
┆❏.harrypotter 🅕 
┆❏.brokenglass 🅕 
┆❏.papercut 🅕 
┆❏.watercolor 🅕 
┆❏.multicolor 🅕 
┆❏.neondevil 🅕 
┆❏.underwater 🅕 
┆❏.graffitibike 🅕
┆❏.snow 🅕 
┆❏.cloud 🅕 
┆❏.honey 🅕 
┆❏.ice 🅕 
┆❏.fruitjuice 🅕 
┆❏.biscuit 🅕 
┆❏.wood 🅕 
┆❏.chocolate 🅕 
┆❏.strawberry 🅕 
┆❏.matrix 🅕 
┆❏.blood 🅕 
┆❏.dropwater 🅕 
┆❏.toxic 🅕 
┆❏.lava 🅕 
┆❏.rock 🅕 
┆❏.bloodglas 🅕 
┆❏.hallowen 🅕 
┆❏.darkgold 🅕 
┆❏.joker 🅕 
┆❏.wicker 🅕
┆❏.firework 🅕 
┆❏.skeleton 🅕 
┆❏.blackpink 🅕 
┆❏.sand 🅕 
┆❏.glue 🅕 
┆❏.1917 🅕 
┆❏.leaves 🅕
┆❏.retro 🅕
┆❏.pornhub 🅕
┆❏.8bit 🅕
┆❏.batman 🅕
┆❏.3dbox 🅕
┆❏.lion 🅕
┆❏.3davengers 🅕
┆❏.window 🅕
┆❏.3dspace 🅕
┆❏.bokeh 🅕
┆❏.holographic 🅕
┆❏.thewall 🅕
┆❏.carbon 🅕
┆❏.whitebear 🅕
┆❏.metallic 🅕
┆❏.steel 🅕
┆❏.fabric 🅕
┆❏.ancient 🅕
┆❏.marvel 🅕
╰–––––––––––––––༓

╭––『 PhotoOxy Maker 』
┆❏.shadow 🅕 
┆❏.write 🅕 
┆❏.romantic 🅕 
┆❏.burnpaper 🅕
┆❏.smoke 🅕 
┆❏.narutobanner 🅕 
┆❏.love 🅕 
┆❏.undergrass 🅕
┆❏.doublelove 🅕 
┆❏.coffecup 🅕
┆❏.underwaterocean 🅕
┆❏.smokyneon 🅕
┆❏.starstext 🅕
┆❏.rainboweffect 🅕
┆❏.balloontext 🅕
┆❏.metalliceffect 🅕
┆❏.embroiderytext 🅕
┆❏.flamingtext 🅕
┆❏.stonetext 🅕
┆❏.writeart 🅕
┆❏.summertext 🅕
┆❏.wolfmetaltext 🅕
┆❏.nature3dtext 🅕
┆❏.rosestext 🅕
┆❏.naturetypography 🅕
┆❏.quotesunder 🅕
┆❏.shinetext 🅕
╰–––––––––––––––༓

╭––『 Ephoto360 Maker 』
┆❏.glitchtext 🅕
┆❏.writetext 🅕
┆❏.advancedglow 🅕
┆❏.typographytext 🅕
┆❏.pixelglitch 🅕
┆❏.neonglitch 🅕
┆❏.flagtext 🅕
┆❏.flag3dtext 🅕
┆❏.deletingtext 🅕
┆❏.blackpinkstyle 🅕
┆❏.glowingtext 🅕
┆❏.underwatertext 🅕
┆❏.logomaker 🅕
┆❏.cartoonstyle 🅕
┆❏.papercutstyle 🅕
┆❏.watercolortext 🅕
┆❏.effectclouds 🅕
┆❏.blackpinklogo 🅕
┆❏.gradienttext 🅕
┆❏.summerbeach 🅕
┆❏.luxurygold 🅕
┆❏.multicoloredneon 🅕
┆❏.sandsummer 🅕
┆❏.galaxywallpaper 🅕
┆❏.1917style 🅕
┆❏.makingneon 🅕
┆❏.royaltext 🅕
┆❏.freecreate 🅕
┆❏.galaxystyle 🅕
┆❏.lighteffects 🅕
╰–––––––––––––––༓

╭––『 Database 』
┆❏.setcmd 🅕
┆❏.delcmd 🅕
┆❏.listcmd 🅕
┆❏.lockcmd 🅕
┆❏.addmsg 🅕
┆❏.delmsg 🅕
┆❏.getmsg 🅕
┆❏.listmsg 🅕
╰–––––––––––––––༓

╭––『 Bug & War 』
┆❏.resetotp 🅞
┆❏.xbugp 🅞
┆❏.xbugr 🅞
╰–––––––––––––––༓

╭––『 Other Menu 』
┆❏.ping 🅕
┆❏.menu 🅕
┆❏.myip 🅕
┆❏.reportbug 🅕
┆❏.listpem 🅕
┆❏.liststicker 🅕
┆❏.listimage 🅕
┆❏.listvideo 🅕
┆❏.listvn 🅕
┆❏.listbadword 🅕
┆❏.listpc 🅕
┆❏.listgc 🅕
┆❏.owner 🅕
┆❏.rentbot 🅕
┆❏.listrentbot 🅕
┆❏.donate 🅕
┆❏.friend 🅕
┆❏.obfuscate 🅕
┆❏.styletext 🅕
┆❏.fliptext 🅕
┆❏.tts 🅕
┆❏.say 🅕
┆❏.togif 🅕
┆❏.toqr 🅕
┆❏.bass 🅕
┆❏.blown 🅕
┆❏.deep 🅕
┆❏.earrape 🅕
┆❏.fast 🅕
┆❏.fat 🅕
┆❏.nightcore 🅕
┆❏.reverse 🅕
┆❏.robot 🅕
┆❏.slow 🅕
┆❏.smooth 🅕
┆❏.squirrel 🅕
┆❏.tinyurl 🅕
┆❏.tinyurl 🅕
┆❏.tovn 🅕
┆❏.toaudio 🅕
┆❏.tomp3 🅕
┆❏.tomp4🅕
┆❏.toimg 🅕
┆❏.toonce 🅕
┆❏.vv 🅕
┆❏.sticker 🅕
┆❏.take 🅟
┆❏.emoji 🅕
┆❏.volume 🅕
┆❏.ebinary 🅕
┆❏.dbinary 🅕
┆❏.ssweb 🅕
┆❏.quoted 🅕
┆❏.runtime 🅕
╰–––––––––––––––༓

───────────────────────────
      ⚡ 𝙇𝙀𝙇𝙊𝙋 ⚡
───────────────────────────`}

global.animemenu = (prefix) => {
return `🌸  *✧ 🎀 ＯＴＡ𝐊Ｕ  ＧＡＲＤＥＮ 🎀 ✧*  🌸
───────────────────────────
✨ _Welcome to the cherry blossom anime gardens!_

🍡  *🎀 𝐀𝐍𝐈𝐌𝐄  𝐒𝐔𝐌𝐌𝐎𝐍𝐒*
  🌸 ${prefix}akira 🅕      | 🌸 ${prefix}akiyama 🅕
  🌸 ${prefix}asuna 🅕      | 🌸 ${prefix}ayuzawa 🅕
  🌸 ${prefix}boruto 🅕     | 🌸 ${prefix}chiho 🅕
  🌸 ${prefix}chitoge 🅕    | 🌸 ${prefix}deidara 🅕
  🌸 ${prefix}doraemon 🅕   | 🌸 ${prefix}elaina 🅕
  🌸 ${prefix}emilia 🅕     | 🌸 ${prefix}erza 🅕
  🌸 ${prefix}gremory 🅕    | 🌸 ${prefix}hestia 🅕
  🌸 ${prefix}hinata 🅕     | 🌸 ${prefix}husbu 🅕
  🌸 ${prefix}inori 🅕      | 🌸 ${prefix}isuzu 🅕
  🌸 ${prefix}itachi 🅕     | 🌸 ${prefix}itori 🅕
  🌸 ${prefix}kaga 🅕       | 🌸 ${prefix}kagura 🅕
  🌸 ${prefix}kakasih 🅕    | 🌸 ${prefix}kaori 🅕
  🌸 ${prefix}keneki 🅕     | 🌸 ${prefix}kotori 🅕
  🌸 ${prefix}kurumi 🅕     | 🌸 ${prefix}madara 🅕
  🌸 ${prefix}megumin 🅕    | 🌸 ${prefix}mikasa 🅕
  🌸 ${prefix}mikey 🅕      | 🌸 ${prefix}neko 🅕
  🌸 ${prefix}nezuko 🅕     | 🌸 ${prefix}onepiece 🅕
  🌸 ${prefix}orochimaru 🅕 | 🌸 ${prefix}pokemon 🅕
  🌸 ${prefix}rize 🅕       | 🌸 ${prefix}sagiri 🅕
  🌸 ${prefix}sakura 🅕     | 🌸 ${prefix}sasuke 🅕
  🌸 ${prefix}shina 🅕      | 🌸 ${prefix}shinka 🅕
  🌸 ${prefix}shizuka 🅕    | 🌸 ${prefix}shouko 🅕
  🌸 ${prefix}touka 🅕      | 🌸 ${prefix}tsunade 🅕
  🌸 ${prefix}yatogami 🅕   | 🌸 ${prefix}yuki 🅕

🎀  *🌸 𝐂𝐎𝐒𝐏𝐋𝐀𝐘  &  𝐋𝐎𝐋𝐈𝐒*
  🌸 ${prefix}loli 🅕
  🌸 ${prefix}cosplayloli 🅕
  🌸 ${prefix}cosplaysagiri 🅕
───────────────────────────
⭐  _Type commands with prefix to unlock magic!_`}

global.ownermenu = (prefix) => {
return `🖥️  *𝐌𝐀𝐈𝐍𝐅𝐑𝐀𝐌𝐄  𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑  𝐂𝐎𝐍𝐒𝐎𝐋𝐄*  🖥️
───────────────────────────
💻  *SYSTEM:*  [ OVERRIDE GRANTED ]
👤  *Developer Authorization:*  [ LEVEL S ]

🔒  *𝐒𝐘𝐒𝐓𝐄𝐌  𝐎𝐕𝐄𝐑𝐑𝐈𝐃𝐄𝐒*
  🖥️ ${prefix}self 🅞
  🖥️ ${prefix}public 🅞
  🖥️ ${prefix}shutdown 🅞

⚙️  *𝐁𝐎𝐓  𝐂𝐎𝐍𝐅𝐈𝐆𝐔𝐑𝐀𝐓𝐈𝐎𝐍*
  ⚙️ ${prefix}setbotname 🅞
  ⚙️ ${prefix}setbotbio 🅞
  ⚙️ ${prefix}setppbot 🅞
  ⚙️ ${prefix}delppbot 🅞
  ⚙️ ${prefix}setexif 🅞

👁️  *𝐒𝐓𝐀𝐓𝐔𝐒  𝐀𝐔𝐓𝐎𝐌𝐀𝐓𝐈𝐎𝐍𝐒*
  📥 ${prefix}autostatus [on/off] 🅞
  📤 ${prefix}statusreply [on/off] 🅞
  📝 ${prefix}post [text or reply media] 🅞
  🗑️ ${prefix}delpost [reply to post] 🅞
  ➕ ${prefix}addautopost <tag/number/reply> 🅞
  ➖ ${prefix}delautopost <tag/number/reply> 🅞
  📋 ${prefix}listautopost 🅞

🛡️  *𝐏𝐄𝐑𝐌𝐈𝐒𝐒𝐈𝐎𝐍  𝐂𝐎𝐍𝐓𝐑𝐎𝐋*
  👑 ${prefix}claimowner 🅞
  🔑 ${prefix}addprem 🅞
  🔑 ${prefix}delprem 🅞
  🔑 ${prefix}addowner 🅞
  🔑 ${prefix}delowner 🅞

📡  *𝐁𝐑𝐎𝐀𝐃𝐂𝐀𝐒𝐓  &  𝐍𝐄𝐓𝐖𝐎𝐑𝐊*
  📡 ${prefix}join 🅞
  📡 ${prefix}bctext 🅞
  📡 ${prefix}bcimage 🅞
  📡 ${prefix}bcvideo 🅞
  📡 ${prefix}creategc 🅞

📼  *𝐌𝐄𝐃𝐈𝐀  𝐂𝐀𝐂𝐇𝐄  𝐒𝐓𝐎𝐑𝐀𝐆𝐄*
  📦 ${prefix}addvn 🅞    | 📦 ${prefix}delvn 🅞
  📦 ${prefix}addsticker 🅞 | 📦 ${prefix}delsticker 🅞
  📦 ${prefix}addimage 🅞  | 📦 ${prefix}delimage 🅞
  📦 ${prefix}addvideo 🅞  | 📦 ${prefix}delvideo 🅞

🧹  *𝐒𝐄𝐒𝐒𝐈𝐎𝐍  𝐌𝐀𝐍𝐀𝐆𝐄𝐌𝐄𝐍𝐓*
  🧼 ${prefix}resetsession 🅞
  🧼 ${prefix}clearsession 🅞
  🧼 ${prefix}fixsession 🅞
───────────────────────────
🤖  _Mainframe status: Nominal_`}

global.othermenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

╭––『 Other Menu 』
┆❏.ping 🅕
┆❏.menu 🅕
┆❏.myip 🅕
┆❏.reportbug 🅕
┆❏.listpem 🅕
┆❏.liststicker 🅕
┆❏.listimage 🅕
┆❏.listvideo 🅕
┆❏.listvn 🅕
┆❏.listbadword 🅕
┆❏.listpc 🅕
┆❏.listgc 🅕
┆❏.owner 🅕
┆❏.rentbot 🅕
┆❏.listrentbot 🅕
┆❏.donate 🅕
┆❏.friend 🅕
┆❏.obfuscate 🅕
┆❏.styletext 🅕
┆❏.fliptext 🅕
┆❏.tts 🅕
┆❏.say 🅕
┆❏.togif 🅕
┆❏.toqr 🅕
┆❏.bass 🅕
┆❏.blown 🅕
┆❏.deep 🅕
┆❏.earrape 🅕
┆❏.fast 🅕
┆❏.fat 🅕
┆❏.nightcore 🅕
┆❏.reverse 🅕
┆❏.robot 🅕
┆❏.slow 🅕
┆❏.smooth 🅕
┆❏.squirrel 🅕
┆❏.tinyurl 🅕
┆❏.tinyurl 🅕
┆❏.tovn 🅕
┆❏.toaudio 🅕
┆❏.tomp3 🅕
┆❏.tomp4🅕
┆❏.toimg 🅕
┆❏.toonce 🅕
┆❏.vv 🅕
┆❏.sticker 🅕
┆❏.take 🅟
┆❏.emoji 🅕
┆❏.volume 🅕
┆❏.ebinary 🅕
┆❏.dbinary 🅕
┆❏.ssweb 🅕
┆❏.quoted 🅕
┆❏.runtime 🅕
┆❏.sound1 - sound161 🅕
╰–––––––––––––––༓
`}

global.downloadmenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

╭––『 Download Menu 』
┆❏.tiktok 🅕
┆❏.tiktokaudio 🅕
┆❏.apk 🅕
┆❏.apkdl 🅕
┆❏.apkver 🅕
┆❏.ytsearch 🅕
┆❏.play 🅕
┆❏.ytmp3 🅕
┆❏.ytmp4 🅕
┆❏.google 🅕
┆❏.imdb 🅕
┆❏.weather 🅕
┆❏.wanumber 🅕
┆❏.instaimg 🅕
┆❏.instavid 🅕
┆❏.fbvid 🅕
┆❏.twittervid 🅕
┆❏.telestick 🅟
┆❏.spotify 🅟
┆❏.gitclone 🅕
┆❏.happymod 🅕
┆❏.gdrive 🅕
┆❏.pinterest 🅕
┆❏.ringtone 🅕
╰–––––––––––––––༓
`}

global.groupmenu = (prefix) => {
return `🛡️  *𝐆𝐔𝐈𝐋𝐃  𝐀𝐃𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐓𝐈𝐎𝐍*  🛡️
───────────────────────────
👥  _Management suite for Guild Masters & Moderators_

📢  *𝐆𝐔𝐈𝐋𝐃  𝐁𝐑𝐎𝐀𝐃𝐂𝐀𝐒𝐓*
  ├ ${prefix}hidetag 🅖
  ├ ${prefix}totag 🅖
  └ ${prefix}tagall 🅖

🛡️  *𝐆𝐔𝐈𝐋𝐃  𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘*
  ├ ${prefix}antilink 🅖
  ├ ${prefix}antilinkgc 🅖
  ├ ${prefix}antilinkall 🅖
  ├ ${prefix}antiwame 🅖
  ├ ${prefix}antivirus 🅖
  ├ ${prefix}antitoxic 🅖
  └ ${prefix}nsfw 🅖

🔗  *𝐆𝐔𝐈𝐋𝐃  𝐋𝐈𝐍𝐊  𝐌𝐈𝐓𝐈𝐆𝐀𝐓𝐈𝐎𝐍*
  ├ ${prefix}antilinktiktok 🅖
  ├ ${prefix}antilinkfb 🅖
  ├ ${prefix}antilinktwitter 🅖
  ├ ${prefix}antilinkig 🅖
  ├ ${prefix}antlinktg 🅖
  ├ ${prefix}antilinkytvid 🅖
  └ ${prefix}antilinkytch 🅖

💼  *𝐌𝐄𝐌𝐁𝐄𝐑  𝐂𝐎𝐍𝐓𝐑𝐎𝐋*
  ├ ${prefix}kick 🅖
  ├ ${prefix}add 🅖
  ├ ${prefix}promote 🅖
  ├ ${prefix}demote 🅖
  └ ${prefix}getbio 🅖

⚙️  *𝐆𝐔𝐈𝐋𝐃  𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*
  ├ ${prefix}open 🅖
  ├ ${prefix}close 🅖
  ├ ${prefix}opentime 🅖
  ├ ${prefix}closetime 🅖
  ├ ${prefix}setppgroup 🅖
  ├ ${prefix}delppgroup 🅖
  ├ ${prefix}setname 🅖
  ├ ${prefix}setdesc 🅖
  ├ ${prefix}grouplink 🅖
  ├ ${prefix}resetlink 🅖
  └ ${prefix}editinfo 🅖

🎟️  *𝐄𝐍𝐓𝐑𝐘  𝐑𝐄𝐐𝐔𝐄𝐒𝐓𝐒*
  ├ ${prefix}listrequests 🅖
  ├ ${prefix}accept 🅖
  └ ${prefix}reject 🅖

💬  *𝐂𝐎𝐌𝐌𝐔𝐍𝐈𝐓𝐘  𝐆𝐀𝐓𝐇𝐄𝐑𝐈𝐍𝐆𝐒*
  ├ ${prefix}vote 🅖
  ├ ${prefix}upvote 🅖
  ├ ${prefix}downvote 🅖
  ├ ${prefix}checkvote 🅖
  └ ${prefix}delvote 🅖

🌸  *𝐀𝐔𝐓𝐎𝐌𝐀𝐓𝐈𝐎𝐍*
  ├ ${prefix}welcome 🅖
  ├ ${prefix}goodbye 🅖
  ├ ${prefix}autostickergc 🅖
  └ ${prefix}react 🅖
───────────────────────────
⭐  _Guild Hall Shielding: Active_`}

global.funmenu = (prefix) => {
return `👑  *𝐂𝐇𝐄𝐄𝐌𝐒  𝐅𝐔𝐍  𝐃𝐀𝐒𝐇𝐁𝐎𝐀𝐑𝐃*  👑
───────────────────────────
📊  *Legend:*
  🟢 🅕 : Free User   |   🟣 🅟 : Premium User
  🔵 🅖 : Group Only  |   👑 🅞 : Bot Owner

🎮  *𝐌𝐈𝐍𝐈  𝐆𝐀𝐌𝐄𝐒*
  ❏ ${prefix}tictactoe 🅕
  ❏ ${prefix}suit 🅕
  ❏ ${prefix}math 🅕

🃏  *𝐏𝐀𝐑𝐓𝐘  &  𝐃𝐀𝐑𝐄*
  ❏ ${prefix}truth 🅕
  ❏ ${prefix}dare 🅕
  ❏ ${prefix}couple 🅕
  ❏ ${prefix}soulmate 🅕

📈  *𝐌𝐄𝐓𝐄𝐑  𝐂𝐇𝐄𝐂𝐊𝐄𝐑𝐒*
  ❏ ${prefix}stupidcheck 🅕
  ❏ ${prefix}handsomecheck 🅕
  ❏ ${prefix}uncleancheck 🅕
  ❏ ${prefix}hotcheck 🅕
  ❏ ${prefix}smartcheck 🅕
  ❏ ${prefix}greatcheck 🅕
  ❏ ${prefix}evilcheck 🅕
  ❏ ${prefix}dogcheck 🅕
  ❏ ${prefix}coolcheck 🅕
  ❏ ${prefix}waifucheck 🅕
  ❏ ${prefix}awesomecheck 🅕
  ❏ ${prefix}gaycheck 🅕
  ❏ ${prefix}cutecheck 🅕
  ❏ ${prefix}lesbiancheck 🅕
  ❏ ${prefix}hornycheck 🅕
  ❏ ${prefix}prettycheck 🅕
  ❏ ${prefix}lovelycheck 🅕
  ❏ ${prefix}uglycheck 🅕
  ❏ ${prefix}checkme 🅕

🔮  *𝐂𝐎𝐒𝐌𝐈𝐂  𝐎𝐑𝐀𝐂𝐋𝐄*
  ❏ ${prefix}can 🅕
  ❏ ${prefix}is 🅕
  ❏ ${prefix}when 🅕
  ❏ ${prefix}where 🅕
  ❏ ${prefix}what 🅕
  ❏ ${prefix}how 🅕
  ❏ ${prefix}rate 🅕

🎭  *𝐀𝐍𝐈𝐌𝐀𝐓𝐄𝐃  𝐑𝐎𝐋𝐄𝐏𝐋𝐀𝐘*
  ❏ ${prefix}slap 🅕    |  ❏ ${prefix}kiss 🅕
  ❏ ${prefix}hug 🅕     |  ❏ ${prefix}pat 🅕
  ❏ ${prefix}lick 🅕    |  ❏ ${prefix}bite 🅕
  ❏ ${prefix}cry 🅕     |  ❏ ${prefix}kill 🅕
  ❏ ${prefix}yeet 🅕    |  ❏ ${prefix}bully 🅕
  ❏ ${prefix}bonk 🅕    |  ❏ ${prefix}wink 🅕
  ❏ ${prefix}poke 🅕    |  ❏ ${prefix}nom 🅕
  ❏ ${prefix}smile 🅕   |  ❏ ${prefix}wave 🅕
  ❏ ${prefix}awoo 🅕    |  ❏ ${prefix}blush 🅕
  ❏ ${prefix}smug 🅕    |  ❏ ${prefix}glomp 🅕
  ❏ ${prefix}happy 🅕   |  ❏ ${prefix}dance 🅕
  ❏ ${prefix}cringe 🅕  |  ❏ ${prefix}cuddle 🅕
  ❏ ${prefix}highfive 🅕|  ❏ ${prefix}shinobu 🅕
  ❏ ${prefix}handhold 🅕|  ❏ ${prefix}spank 🅕
  ❏ ${prefix}tickle 🅕  |  ❏ ${prefix}avatar 🅕
  ❏ ${prefix}feed 🅕    |  ❏ ${prefix}foxgirl 🅕
  ❏ ${prefix}gecg 🅕

🎵  *𝐀𝐔𝐃𝐈𝐎  𝐄𝐅𝐅𝐄𝐂𝐓𝐒*
  ❏ ${prefix}sound1 - sound161 🅕
───────────────────────────
⭐  _Type any command with prefix to start!_`}

global.gamemenu = (prefix) => {
return `🎮  *𝐂𝐇𝐄𝐄𝐌𝐒  𝐆𝐀𝐌𝐄  𝐃𝐀𝐒𝐇𝐁𝐎𝐀𝐑𝐃*  🎮
───────────────────────────
💰  *Play, Win, & Earn Cheems Coins!*

🟢 🅕 : Free User   |   🟣 🅟 : Premium User

🎰  *𝐂𝐀𝐒𝐈𝐍𝐎  &  𝐁𝐄𝐓𝐓𝐈𝐍𝐆*
  ❏ ${prefix}slot <bet> 🅕
    _Spin the emoji slot machine for 2x - 100x rewards!_
  ❏ ${prefix}coinflip <bet> <heads/tails> 🅕
    _Flip a double-or-nothing coin!_
  ❏ ${prefix}blackjack <bet> 🅕
    _Play the legendary 21 card game vs the dealer!_
  ❏ ${prefix}roulette <bet> <red/black/green> 🅕
    _Bet on the spinning wheel of fortune!_

🧠  *𝐁𝐑𝐀𝐈𝐍  𝐂𝐇𝐀𝐋𝐋𝐄𝐍𝐆𝐄𝐒*
  ❏ ${prefix}trivia 🅕
    _Answer general knowledge questions to earn coins!_
  ❏ ${prefix}math <easy/medium/hard> 🅕
    _Solve fast arithmetic under pressure!_

⚔️  *𝐌𝐔𝐋𝐓𝐈𝐏𝐋𝐀𝐘𝐄𝐑  𝐃𝐔𝐄𝐋𝐒*
  ❏ ${prefix}tictactoe <room_name> 🅕
    _Classic 3x3 grid duel against a friend!_
  ❏ ${prefix}suit @mention 🅕
    _Rock-Paper-Scissors PvP showdown!_

👑  *𝐏𝐋𝐀𝐘𝐄𝐑  𝐏𝐑𝐎𝐅𝐈𝐋𝐄*
  ❏ ${prefix}profile 🅕
    _Check your rank, experience (XP), and coin balance!_
  ❏ ${prefix}claim 🅕
    _Claim your daily free 500 coin allowance!_
───────────────────────────
⭐  _Earn coins to unlock premium features and rank up!_`}

global.stalkermenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

╭––『 Stalker 』
┆❏.igstalk 🅕
┆❏.ffstalk 🅕
┆❏.mlstalk 🅕
┆❏.npmstalk 🅕
┆❏.ghstalk 🅕
╰–––––––––––––––༓
`}

global.stickermenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

╭––『 Sticker 』
┆❏.goose 🅕
┆❏.woof 🅕
┆❏.8ball 🅕
┆❏.lizard 🅕
┆❏.meow 🅕
┆❏.gura 🅕
┆❏.doge 🅕
┆❏.patrick 🅕
┆❏.lovestick 🅕
╰–––––––––––––––༓
`}

global.databasemenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

╭––『 Database 』
┆❏.setcmd 🅕
┆❏.delcmd 🅕
┆❏.listcmd 🅕
┆❏.lockcmd 🅕
┆❏.addmsg 🅕
┆❏.delmsg 🅕
┆❏.getmsg 🅕
┆❏.listmsg 🅕
╰–––––––––––––––༓
`}

global.aimenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

╭––『 Gemini & AI 』
┆❏.chatbot 🅞
┆❏.gemini 🅕
┆❏.ai 🅕
┆❏.gpt 🅕
┆❏.chatgpt 🅕
┆❏.openai 🅕
┆❏.bard 🅕
┆❏.ask 🅕
┆❏.aimage 🅕
┆❏.imagen 🅕
┆❏.qwen 🅕
┆❏.remini 🅕
╰–––––––––––––––༓
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

╭––『 Bug & War 』
┆❏.resetotp 🅞
┆❏.xbugp 🅞
┆❏.xbugr 🅞
╰–––––––––––––––༓

───────────────────────────
      ⚡ 𝙇𝙀𝙇𝙊𝙋 ⚡
───────────────────────────`}

global.randphotomenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

╭––『 Random Photo 』
┆❏.aesthetic 🅕
┆❏.coffee 🅕
┆❏.wikimedia 🅕
┆❏.wallpaper 🅕
┆❏.art 🅕
┆❏.bts 🅕
┆❏.dogwoof 🅕
┆❏.catmeow 🅕
┆❏.lizardpic 🅕
┆❏.goosebird 🅕
┆❏.8ballpool 🅕
┆❏.cosplay 🅕
┆❏.hacker 🅕
┆❏.cyber 🅕
┆❏.gamewallpaper 🅕
┆❏.islamic 🅕
┆❏.jennie 🅕
┆❏.jiso 🅕
┆❏.satanic 🅕
┆❏.justina 🅕
┆❏.cartoon 🅕
┆❏.pentol 🅕
┆❏.cat 🅕
┆❏.kpop 🅕
┆❏.exo 🅕
┆❏.lisa 🅕
┆❏.space 🅕
┆❏.car 🅕
┆❏.technology 🅕
┆❏.bike 🅕
┆❏.shortquote 🅕
┆❏.antiwork 🅕
┆❏.hacking 🅕
┆❏.boneka 🅕
┆❏.rose 🅕
┆❏.ryujin 🅕
┆❏.ulzzangboy 🅕
┆❏.ulzzanggirl 🅕
┆❏.wallml 🅕
┆❏.wallphone 🅕
┆❏.mountain 🅕
┆❏.goose 🅕
┆❏.profilepic 🅕
┆❏.couplepic 🅕
┆❏.programming 🅕
┆❏.pubg 🅕
┆❏.blackpink 🅕
┆❏.randomboy 🅕  
┆❏.randomgirl 🅕
┆❏.hijab 🅕  
┆❏.chinese 🅕
┆❏.indo 🅕
┆❏.japanese 🅕
┆❏.korean 🅕
┆❏.malay 🅕
┆❏.thai 🅕
┆❏.vietnamese 🅕
╰–––––––––––––––༓
`}

global.randvideomenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

╭––『 Random Video 』
┆❏.tiktokgirl 🅕
┆❏.tiktoknukthy 🅕
┆❏.tiktokkayes 🅕
┆❏.tiktokpanrika 🅕
┆❏.tiktoknotnot 🅕
┆❏.tiktokghea 🅕
┆❏.tiktoksantuy 🅕
┆❏.tiktokbocil 🅕
╰–––––––––––––––༓
`}

global.textpromenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

╭––『 Textpro Maker 』
┆❏.candy 🅕 
┆❏.christmas 🅕 
┆❏.3dchristmas 🅕 
┆❏.sparklechristmas 🅕
┆❏.deepsea 🅕 
┆❏.scifi 🅕 
┆❏.rainbow 🅕 
┆❏.waterpipe 🅕 
┆❏.spooky 🅕 
┆❏.pencil 🅕 
┆❏.circuit 🅕 
┆❏.discovery 🅕 
┆❏.metalic 🅕 
┆❏.fiction 🅕 
┆❏.demon 🅕 
┆❏.transformer 🅕 
┆❏.berry 🅕 
┆❏.thunder 🅕 
┆❏.magma 🅕 
┆❏.3dstone 🅕 
┆❏.neonlight 🅕 
┆❏.glitch 🅕 
┆❏.harrypotter 🅕 
┆❏.brokenglass 🅕 
┆❏.papercut 🅕 
┆❏.watercolor 🅕 
┆❏.multicolor 🅕 
┆❏.neondevil 🅕 
┆❏.underwater 🅕 
┆❏.graffitibike 🅕
┆❏.snow 🅕 
┆❏.cloud 🅕 
┆❏.honey 🅕 
┆❏.ice 🅕 
┆❏.fruitjuice 🅕 
┆❏.biscuit 🅕 
┆❏.wood 🅕 
┆❏.chocolate 🅕 
┆❏.strawberry 🅕 
┆❏.matrix 🅕 
┆❏.blood 🅕 
┆❏.dropwater 🅕 
┆❏.toxic 🅕 
┆❏.lava 🅕 
┆❏.rock 🅕 
┆❏.bloodglas 🅕 
┆❏.hallowen 🅕 
┆❏.darkgold 🅕 
┆❏.joker 🅕 
┆❏.wicker 🅕
┆❏.firework 🅕 
┆❏.skeleton 🅕 
┆❏.blackpink 🅕 
┆❏.sand 🅕 
┆❏.glue 🅕 
┆❏.1917 🅕 
┆❏.leaves 🅕
┆❏.retro 🅕
┆❏.pornhub 🅕
┆❏.8bit 🅕
┆❏.batman 🅕
┆❏.3dbox 🅕
┆❏.lion 🅕
┆❏.3davengers 🅕
┆❏.window 🅕
┆❏.3dspace 🅕
┆❏.bokeh 🅕
┆❏.holographic 🅕
┆❏.thewall 🅕
┆❏.carbon 🅕
┆❏.whitebear 🅕
┆❏.metallic 🅕
┆❏.steel 🅕
┆❏.fabric 🅕
┆❏.ancient 🅕
┆❏.marvel 🅕
╰–––––––––––––––༓
`}

global.photooxymenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

╭––『 PhotoOxy Maker 』
┆❏.shadow 🅕 
┆❏.write 🅕 
┆❏.romantic 🅕 
┆❏.burnpaper 🅕
┆❏.smoke 🅕 
┆❏.narutobanner 🅕 
┆❏.love 🅕 
┆❏.undergrass 🅕
┆❏.doublelove 🅕 
┆❏.coffecup 🅕
┆❏.underwaterocean 🅕
┆❏.smokyneon 🅕
┆❏.starstext 🅕
┆❏.rainboweffect 🅕
┆❏.balloontext 🅕
┆❏.metalliceffect 🅕
┆❏.embroiderytext 🅕
┆❏.flamingtext 🅕
┆❏.stonetext 🅕
┆❏.writeart 🅕
┆❏.summertext ??
┆❏.wolfmetaltext 🅕
┆❏.nature3dtext 🅕
┆❏.rosestext 🅕
┆❏.naturetypography 🅕
┆❏.quotesunder 🅕
┆❏.shinetext 🅕
╰–––––––––––––––༓
`}

global.ephoto360menu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

╭––『 Ephoto360 Maker 』
┆❏.glitchtext 🅕
┆❏.writetext 🅕
┆❏.advancedglow 🅕
┆❏.typographytext 🅕
┆❏.pixelglitch 🅕
┆❏.neonglitch 🅕
┆❏.flagtext 🅕
┆❏.flag3dtext 🅕
┆❏.deletingtext 🅕
┆❏.blackpinkstyle 🅕
┆❏.glowingtext 🅕
┆❏.underwatertext 🅕
┆❏.logomaker 🅕
┆❏.cartoonstyle 🅕
┆❏.papercutstyle 🅕
┆❏.watercolortext 🅕
┆❏.effectclouds 🅕
┆❏.blackpinklogo 🅕
┆❏.gradienttext 🅕
┆❏.summerbeach 🅕
┆❏.luxurygold 🅕
┆❏.multicoloredneon 🅕
┆❏.sandsummer 🅕
┆❏.galaxywallpaper 🅕
┆❏.1917style 🅕
┆❏.makingneon 🅕
┆❏.royaltext 🅕
┆❏.freecreate 🅕
┆❏.galaxystyle 🅕
┆❏.lighteffects 🅕
╰–––––––––––––––༓
`}

global.nsfwmenu = (prefix) => {
return `🅞 = For Owner
🅖 = For Group
🅕 = For Free User
🅟 = For Premium User

╭––『 Anime NSFW 』
┆❏.hentai 🅕
┆❏.gifhentai 🅕
┆❏.gifblowjob 🅕
┆❏.hentaivid 🅕
┆❏.hneko 🅕
┆❏.nwaifu 🅕
┆❏.animespank 🅕
┆❏.trap 🅕
┆❏.gasm 🅕
┆❏.ahegao 🅕
┆❏.ass 🅕
┆❏.bdsm 🅕
┆❏.blowjob 🅕
┆❏.cuckold 🅕
┆❏.cum 🅕
┆❏.milf 🅕
┆❏.eba 🅕
┆❏.ero 🅕
┆❏.femdom 🅕
┆❏.foot 🅕
┆❏.gangbang 🅕
┆❏.glasses 🅕
┆❏.jahy 🅕
┆❏.masturbation 🅕
┆❏.manga 🅕
┆❏.neko-hentai 🅕
┆❏.neko-hentai2 🅕
┆❏.nsfwloli 🅕
┆❏.orgy 🅕
┆❏.panties 🅕 
┆❏.pussy 🅕
┆❏.tentacles 🅕
┆❏.thighs 🅕
┆❏.yuri 🅕
┆❏.zettai 🅕
┆❏.xnxxsearch 🅟
┆❏.xnxxdl 🅟
╰–––––––––––––––༓
`}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
