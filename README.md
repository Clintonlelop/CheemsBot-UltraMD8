<p align="center">
  <img src="./XeonMedia/theme/cheemspic.jpg" width="600" alt="Clinton Bot Ultra MD Banner" style="border-radius: 14px; box-shadow: 0 8px 30px rgba(0,0,0,0.5);" />
</p>

<h1 align="center">⚡ CheemsBot-UltraMD8 ⚡<br><sub>Clinton Bot Ultra Multi-Device</sub></h1>

<p align="center">
  <b>A lightning-fast, feature-packed WhatsApp Multi-Device automation bot built with Baileys and Node.js.</b><br>
  Engineered by <b>Clinton (Lelop)</b> with an integrated Web Control Dashboard, dual pairing options, and refined group suites.
</p>

<p align="center">
  <a href="https://github.com/Clintonlelop/CheemsBot-UltraMD8/fork"><img src="https://img.shields.io/badge/Fork-Repository-blue?style=for-the-badge&logo=github" alt="Fork Repository" /></a>
  <a href="https://github.com/Clintonlelop/CheemsBot-UltraMD8/stargazers"><img src="https://img.shields.io/github/stars/Clintonlelop/CheemsBot-UltraMD8?style=for-the-badge&color=gold" alt="GitHub Stars" /></a>
  <a href="https://github.com/Clintonlelop/CheemsBot-UltraMD8/network/members"><img src="https://img.shields.io/github/forks/Clintonlelop/CheemsBot-UltraMD8?style=for-the-badge&color=orange" alt="GitHub Forks" /></a>
  <a href="https://wa.me/2348029399425"><img src="https://img.shields.io/badge/Chat%20on-WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="WhatsApp Clinton" /></a>
</p>

---

## ⚡ The Ultra Revival: Modernized Beyond the Original

> 📢 **Important Context:**  
> The original CheemsBot repositories created by **DGXeon** (`CheemsBot-MD`, `CheemsBot-MD8`, etc.) have become heavily outdated, broken, or in many cases deleted from GitHub due to unmaintained dependencies, deprecated Baileys versions, and recent WhatsApp protocol changes.
>
> **CheemsBot-UltraMD8** is the **definitive, modernized Ultra Edition** engineered and maintained by **Clinton (Lelop)**. It revives the beloved Cheems bot with a completely stabilized engine, resolves persistent keystore corruption, and introduces modern web management tools.

### 🚀 Ultra Edition vs. Legacy CheemsBot
| Core Capability | Legacy DGXeon Repositories | ⚡ CheemsBot-UltraMD8 (Ultra Edition) |
| :--- | :--- | :--- |
| **Repository Status** | 🛑 Outdated, unmaintained, or deleted | 🟢 **Actively maintained & fully updated** |
| **Baileys Protocol** | ⚠️ Outdated v4/v5 APIs & breaking changes | 🚀 **Modern `@whiskeysockets/baileys` v6+** |
| **Pairing & Login** | 💻 Terminal-only text dumps | 🌐 **Web Control Dashboard + Live QR & Pairing Code** |
| **Session Resilience** | ❌ Frequent logouts & `badSession` file wipes | 🛡️ **Dual-layer persistent backup & auto-recovery** |
| **Session Management** | ❌ Manual file manipulation | 📁 **Web upload for `.json`, session folders, & ZIPs** |
| **Command Suite** | 💤 Rigid, plain text responses | ✨ **Refined suites (Dynamic `.invite`, interactive cards)** |
| **Crash Protection** | ❌ Prone to cipher stub unhandled exceptions | 🛡️ **Self-healing decryption handler & safe restarts** |

---

## 🌟 Highlights & Features

- 🌐 **Built-in Web Control Dashboard (Port 3000)**:
  - Real-time QR Code scanning directly in your browser.
  - 8-digit Pairing Code generator for phone number authentication.
  - Live streaming terminal log viewer with colorized output.
  - Multi-format session importer (supports raw `creds.json`, ZIP archives, and session folders).
  - Dynamic banner image customizer.
- 💌 **Refined Group Invite Suite**:
  - Upgraded `.invite` command supporting direct `@mention`, reply quoting, or international phone numbers.
  - Automatic group invite link generation and rich metadata cards.
- 🛡️ **Session Resilience & Auto-Healing**:
  - Continuous credential mirroring to `database/session_creds_backup.json` to prevent accidental logouts.
  - Auto-healing cipher stub decrypter to resolve stale ratchet sessions without breaking keys.
- 🤖 **Comprehensive Automation**:
  - Anti-Delete protection, auto view-once media downloader, group moderation, AI integration, sticker/media tools, and more.

---

## 📱 Developer & Owner Contact

Got questions or need custom configurations? Connect directly with the developer:

- 📱 **Primary WhatsApp:** [+234 802 939 9425](https://wa.me/2348029399425)
- 📱 **Secondary WhatsApp:** [+234 816 020 8114](https://wa.me/2348160208114)
- 🐙 **GitHub Profile:** [@Clintonlelop](https://github.com/Clintonlelop)
- 📦 **Repository:** [Clintonlelop/CheemsBot-UltraMD8](https://github.com/Clintonlelop/CheemsBot-UltraMD8)

---

## 🚀 Deployment & Installation

### Option 1: Linux VPS / Ubuntu Server (Recommended for 24/7 Uptime)

```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Git, Node.js 18 or 20, FFmpeg, and ImageMagick
sudo apt install -y git curl ffmpeg imagemagick libwebp-dev
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Clone the repository
git clone https://github.com/Clintonlelop/CheemsBot-UltraMD8.git
cd CheemsBot-UltraMD8

# 4. Install dependencies
npm install

# 5. Start the bot
npm start

# For 24/7 background operation using PM2:
sudo npm install -g pm2
pm2 start index.js --name "clinton-bot"
pm2 save
pm2 startup
```

---

### Option 2: Termux (Android)

Run the bot directly on your Android phone using Termux:

```bash
# 1. Update Termux environment
pkg update && pkg upgrade -y

# 2. Install required packages
pkg install git nodejs-lts ffmpeg libwebp imagemagick -y

# 3. Clone repository
git clone https://github.com/Clintonlelop/CheemsBot-UltraMD8.git
cd CheemsBot-UltraMD8

# 4. Install dependencies
npm install

# 5. Start bot
npm start

# For continuous background execution in Termux:
npm install -g pm2
pm2 start index.js --name "clinton-bot"
pm2 logs
```

---

### Option 3: Vercel & Web Server Deployment

> **Note on Vercel Serverless Architecture:**
> Baileys maintains a persistent, two-way WebSocket connection to WhatsApp servers. Vercel's serverless compute model has short execution timeouts (10s to 60s), meaning long-lived WebSocket sessions require a persistent server (such as a VPS, Docker container, or cloud VM). 
> 
> However, you can deploy the web dashboard and webhook integrations on Vercel:

1. **Fork the Repository:**
   Click [Fork](https://github.com/Clintonlelop/CheemsBot-UltraMD8/fork) on GitHub.

2. **Import to Vercel:**
   - Log into [Vercel](https://vercel.com) and click **Add New > Project**.
   - Select your forked `CheemsBot-UltraMD8` repository.
   - Set the root directory and configure environment variables (e.g. `OWNER_NUMBER`, `BOT_NAME`, `TZ=Africa/Lagos`).

3. **Hybrid Setup:**
   - Run the core Baileys WebSocket instance on a VPS, container, or VM.
   - Use the Vercel-hosted deployment to expose the management UI and webhook routes.

---

## ⚙️ Configuration & Environment

Create a `.env` file in the root directory (or use `.env.example` as a template):

```env
# Bot Identification
BOT_NAME="CLINTON BOT ULTRA MD"
OWNER_NUMBER="2348160208114"
OWNER_NAME="Clinton"

# Timezone (Default: Africa/Lagos)
TIMEZONE="Africa/Lagos"
TZ="Africa/Lagos"

# AI Integrations (Optional)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
CUSTOM_API_KEY=""
```

---

## 🔗 Fork & Contribute

Feel free to fork this project, submit pull requests, or open issues:

```bash
git clone https://github.com/Clintonlelop/CheemsBot-UltraMD8.git
```

---

<p align="center">
  <sub>Developed with ❤️ by <b><a href="https://github.com/Clintonlelop">Clinton (Lelop)</a></b></sub>
</p>
