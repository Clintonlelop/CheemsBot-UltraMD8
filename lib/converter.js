const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise(async (resolve, reject) => {
    try {
      let tmp = path.join(__dirname, '../XeonMedia/trash', + new Date + '.' + ext)
      let out = tmp + '.' + ext2
      await fs.promises.writeFile(tmp, buffer)
      spawn('ffmpeg', [
        '-y',
        '-i', tmp,
        ...args,
        out
      ])
        .on('error', reject)
        .on('close', async (code) => {
          try {
            await fs.promises.unlink(tmp)
            if (code !== 0) return reject(code)
            resolve(await fs.promises.readFile(out))
            await fs.promises.unlink(out)
          } catch (e) {
            reject(e)
          }
        })
    } catch (e) {
      reject(e)
    }
  })
}

function toAudio(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-ac', '2',
    '-b:a', '128k',
    '-ar', '44100',
    '-f', 'mp3'
  ], ext, 'mp3')
}

function toPTT(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '64k',
    '-vbr', 'on',
    '-compression_level', '10',
    '-ar', '48000',
    '-ac', '1',
    '-avoid_negative_ts', 'make_zero'
  ], ext, 'ogg')
}

function toVideo(buffer, ext) {
  return ffmpeg(buffer, [
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-ab', '128k',
    '-ar', '44100',
    '-crf', '32',
    '-preset', 'slow'
  ], ext, 'mp4')
}

function convertWebpToMp4(inputPathOrBuffer) {
  const os = require('os')
  const crypto = require('crypto')
  const { execSync } = require('child_process')
  const tmpDir = os.tmpdir()
  const rand = crypto.randomBytes(6).toString('hex')
  const tmpIn = path.join(tmpDir, `conv_in_${rand}.webp`)
  const tmpGif = path.join(tmpDir, `conv_mid_${rand}.gif`)
  const tmpMp4 = path.join(tmpDir, `conv_out_${rand}.mp4`)

  if (Buffer.isBuffer(inputPathOrBuffer)) {
    fs.writeFileSync(tmpIn, inputPathOrBuffer)
  } else if (typeof inputPathOrBuffer === 'string' && fs.existsSync(inputPathOrBuffer)) {
    fs.copyFileSync(inputPathOrBuffer, tmpIn)
  } else {
    throw new Error('Invalid input file')
  }

  try {
    execSync(`convert "${tmpIn}" "${tmpGif}"`, { stdio: 'pipe' })
    execSync(`ffmpeg -y -i "${tmpGif}" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -pix_fmt yuv420p -c:v libx264 -preset ultrafast -movflags +faststart -an "${tmpMp4}"`, { stdio: 'pipe' })
  } catch (e) {
    execSync(`ffmpeg -y -i "${tmpIn}" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -pix_fmt yuv420p -c:v libx264 -preset ultrafast -movflags +faststart -an "${tmpMp4}"`, { stdio: 'pipe' })
  } finally {
    try { fs.unlinkSync(tmpIn) } catch (_) {}
    try { fs.unlinkSync(tmpGif) } catch (_) {}
  }
  return tmpMp4
}

function convertToImage(inputPathOrBuffer) {
  const os = require('os')
  const crypto = require('crypto')
  const { execSync } = require('child_process')
  const tmpDir = os.tmpdir()
  const rand = crypto.randomBytes(6).toString('hex')
  const tmpIn = path.join(tmpDir, `img_in_${rand}.webp`)
  const tmpPng = path.join(tmpDir, `img_out_${rand}.png`)

  if (Buffer.isBuffer(inputPathOrBuffer)) {
    fs.writeFileSync(tmpIn, inputPathOrBuffer)
  } else if (typeof inputPathOrBuffer === 'string' && fs.existsSync(inputPathOrBuffer)) {
    fs.copyFileSync(inputPathOrBuffer, tmpIn)
  } else {
    throw new Error('Invalid input file')
  }

  try {
    execSync(`convert "${tmpIn}[0]" "${tmpPng}"`, { stdio: 'pipe' })
  } catch (e) {
    execSync(`ffmpeg -y -i "${tmpIn}" -vframes 1 "${tmpPng}"`, { stdio: 'pipe' })
  } finally {
    try { fs.unlinkSync(tmpIn) } catch (_) {}
  }
  return tmpPng
}

async function gifToMp4(inputUrlOrBuffer) {
  const os = require('os')
  const crypto = require('crypto')
  const { execSync } = require('child_process')
  const axios = require('axios')
  
  let buff
  if (Buffer.isBuffer(inputUrlOrBuffer)) {
    buff = inputUrlOrBuffer
  } else if (typeof inputUrlOrBuffer === 'string') {
    if (inputUrlOrBuffer.startsWith('http://') || inputUrlOrBuffer.startsWith('https://')) {
      const res = await axios.get(inputUrlOrBuffer, {
        responseType: 'arraybuffer',
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      })
      buff = Buffer.from(res.data)
    } else if (fs.existsSync(inputUrlOrBuffer)) {
      buff = fs.readFileSync(inputUrlOrBuffer)
    } else {
      throw new Error('Invalid file path or URL')
    }
  } else {
    throw new Error('Invalid input for gifToMp4')
  }

  // If already an MP4 container, write and return
  if (buff.length > 8 && buff.slice(4, 8).toString() === 'ftyp') {
    const tmpMp4 = path.join(os.tmpdir(), `vid_${crypto.randomBytes(6).toString('hex')}.mp4`)
    fs.writeFileSync(tmpMp4, buff)
    return tmpMp4
  }

  const rand = crypto.randomBytes(6).toString('hex')
  const isGif = buff.slice(0, 3).toString() === 'GIF'
  const isWebp = buff.length > 12 && buff.slice(8, 12).toString() === 'WEBP'
  const inExt = isGif ? '.gif' : isWebp ? '.webp' : '.bin'
  
  const tmpIn = path.join(os.tmpdir(), `gif_in_${rand}${inExt}`)
  const tmpMp4 = path.join(os.tmpdir(), `gif_out_${rand}.mp4`)
  fs.writeFileSync(tmpIn, buff)

  try {
    if (isWebp) {
      const tmpMid = path.join(os.tmpdir(), `gif_mid_${rand}.gif`)
      try {
        execSync(`convert "${tmpIn}" "${tmpMid}"`, { stdio: 'pipe' })
        execSync(`ffmpeg -y -i "${tmpMid}" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -pix_fmt yuv420p -c:v libx264 -preset ultrafast -movflags +faststart -an "${tmpMp4}"`, { stdio: 'pipe' })
      } catch (_) {
        execSync(`ffmpeg -y -i "${tmpIn}" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -pix_fmt yuv420p -c:v libx264 -preset ultrafast -movflags +faststart -an "${tmpMp4}"`, { stdio: 'pipe' })
      } finally {
        try { fs.unlinkSync(tmpMid) } catch(_) {}
      }
    } else {
      execSync(`ffmpeg -y -i "${tmpIn}" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -pix_fmt yuv420p -c:v libx264 -preset ultrafast -movflags +faststart -an "${tmpMp4}"`, { stdio: 'pipe' })
    }
  } finally {
    try { fs.unlinkSync(tmpIn) } catch(_) {}
  }

  return tmpMp4
}

module.exports = {
  toAudio,
  toPTT,
  toVideo,
  convertWebpToMp4,
  convertToImage,
  gifToMp4,
  ffmpeg,
}