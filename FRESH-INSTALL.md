# Fresh Install Guide - CheemsBot-UltraMD8

## Requirements
- Node.js 18+
- FFmpeg
- ImageMagick / libwebp

## Quick Start
```bash
git clone https://github.com/Clintonlelop/CheemsBot-UltraMD8.git
cd CheemsBot-UltraMD8
npm install
# Copy .env.example to .env and fill values
cp .env.example .env
npm start
```

## Pairing
- Use the web dashboard at http://localhost:3000 for QR or Pairing Code
- Or set `usePairingCode = true` in settings.js for terminal pairing

## Notes
- Session is stored in `./session`
- Credentials backup is automatically written to `database/session_creds_backup.json`
