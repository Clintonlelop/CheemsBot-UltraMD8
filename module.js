const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    makeInMemoryStore,
    jidDecode,
    proto,
    Browsers
} = require("@whiskeysockets/baileys")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep, reSize } = require('./lib/myfunc')
const { color } = require('./lib/color')

const modul = {
    baileys: makeWASocket,
    boom: Boom,
    chalk: chalk,
    fs: fs,
    figlet: require('figlet'),
    FileType: FileType,
    path: path,
    pino: pino,
    PhoneNumber: PhoneNumber,
    axios: axios,
    yargs: require('yargs/yargs'),
    _: require('lodash'),
    qrcodeterminal: require('qrcode-terminal')
}

module.exports = { modul }
