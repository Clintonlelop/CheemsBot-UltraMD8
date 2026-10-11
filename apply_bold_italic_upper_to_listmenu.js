const fs = require('fs');
const path = require('path');

function toMathBoldItalicUpper(str) {
    if (!str || typeof str !== 'string') return str;
    const cleanStr = str.toUpperCase();
    const uppercaseOffset = 0x1D468 - 0x41; // '𝑨' is U+1D468, 'A' is 0x41
    const digitMap = {
        '0': '𝟢', '1': '𝟣', '2': '𝟤', '3': '𝟥', '4': '𝟦',
        '5': '𝟧', '6': '𝟨', '7': '𝟩', '8': '𝟪', '9': '𝟫'
    };

    return cleanStr.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 0x41 && code <= 0x5A) { // A-Z
            return String.fromCodePoint(code + uppercaseOffset);
        } else if (digitMap[char]) {
            return digitMap[char];
        }
        return char;
    }).join('');
}

const listmenuFile = path.join(__dirname, 'lib/listmenu.js');
let content = fs.readFileSync(listmenuFile, 'utf8');

// Replace all command names
content = content.replace(/│ ⬡ \.\$\{prefix\}([^\n]+)/g, (match, body) => {
    const parts = body.trim().split(/\s+/);
    const rawCmd = parts[0];
    const remaining = parts.slice(1).join(' ');

    const boldItalicCmd = toMathBoldItalicUpper(rawCmd);
    return `│ ⬡ .\${prefix}${boldItalicCmd}${remaining ? ' ' + remaining : ''}`;
});

fs.writeFileSync(listmenuFile, content, 'utf8');
console.log('BOLD_ITALIC_UPPERCASE_APPLIED_SUCCESSFULLY');
