const fs = require('fs');
const path = require('path');
const { getGeminiClient } = require('./gemini');
const axios = require('axios');

const CONFIG_FILE = path.join(__dirname, '../database/chatbot_config.json');
const MEMORY_FILE = path.join(__dirname, '../database/chatbot_memory.json');

// Ensure database files exist
function loadChatbotConfig() {
    try {
        if (!fs.existsSync(CONFIG_FILE)) {
            const initial = {
                groupEnabled: true,
                privateEnabled: true,
                tagOrReplyOnly: true, // If true, in groups only triggers when mentioned or quoted/replied
                voiceReply: false, // Send voice notes when possible or requested
                humorLevel: 'witty', // witty, savage, friendly
                systemPersona: 'short_human'
            };
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(initial, null, 2));
            return initial;
        }
        const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        if (cfg.tagOrReplyOnly === undefined) cfg.tagOrReplyOnly = true;
        return cfg;
    } catch (e) {
        return { groupEnabled: true, privateEnabled: true, tagOrReplyOnly: true, voiceReply: false, humorLevel: 'witty' };
    }
}

function saveChatbotConfig(config) {
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    } catch (e) {
        console.error('[ChatbotConfig Error]', e);
    }
}

function loadChatMemory() {
    try {
        if (!fs.existsSync(MEMORY_FILE)) {
            fs.writeFileSync(MEMORY_FILE, JSON.stringify({}, null, 2));
            return {};
        }
        return JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8'));
    } catch (e) {
        return {};
    }
}

function saveChatMemory(memory) {
    try {
        fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
    } catch (e) {
        console.error('[ChatMemory Error]', e);
    }
}

// In-memory conversation buffer per sender / room (stores last 8 messages)
const conversationHistories = {};

/**
 * Appends message to history and persists key facts
 */
function recordMessage(jid, senderName, role, text) {
    if (!jid || !text) return;
    if (!conversationHistories[jid]) {
        conversationHistories[jid] = [];
    }
    conversationHistories[jid].push({
        role: role === 'user' ? 'user' : 'model',
        senderName: senderName || 'User',
        text: String(text).slice(0, 500),
        timestamp: Date.now()
    });

    // Keep only last 10 messages to avoid token blowup & keep context razor sharp
    if (conversationHistories[jid].length > 10) {
        conversationHistories[jid].shift();
    }
}

/**
 * Natural, casual, witty conversational engine
 */
async function generateChatbotReply(jid, senderName, userMessage, isGroup = false) {
    const config = loadChatbotConfig();
    const history = conversationHistories[jid] || [];

    const privateDMPrompt = isGroup ? "" : `
4. PRIVATE CHAT / DM RULE:
   - Since this is a private message, you MUST playfully but clearly mention that you are a bot, and invite them to reach your main WhatsApp/human boss (Clinton) at 2348160208114 if they need actual serious human attention. Make it hilarious, fun, and warm (e.g., "Yo! Just a heads up, I'm the bot running things here. My main human's WhatsApp is 2348160208114 if you want to ping him directly. But hey, I'm way funnier, so what's up?"). Do not say it robotically; integrate it with your chill/funny friend persona.
`;

    // System prompt tuned strictly for natural, human-like, short messaging with Nigerian flavor
    const systemInstruction = `You are Cheems, a real, sharp, funny, and chill friend chatting on WhatsApp who speaks natural Nigerian Pidgin English and casual English (using words like "How far", "sup", "Omo", "Abeg", "No wahala", "E go be", "No cap", "Wahala for who...").

CRITICAL CONVERSATIONAL RULES:
1. TALK LIKE A REAL HUMAN CHATTING ON WHATSAPP:
   - Keep replies natural, concise, and contextual (1 to 2 short sentences max). Never write AI-sounding essays or formal bullet points.
   - If someone just tags/mentions you or says "bot", reply casually like "how far", "sup bro", "yo what's good", "I dey here, wetin dey happen?".
   - Listen to what the conversation is actually about and follow up intelligently on what the user said instead of dropping random unrelated words.
   - Do NOT sound like an AI assistant. Never say "How can I assist you today?", "As an AI language model", or "Certainly!".
2. If the user makes a joke or roasts you, banter back with sharp wit, humor, and Pidgin sass.
3. If someone explicitly asks you for a voice note / audio message / VN, give a friendly concise response that works well as voice.
${privateDMPrompt}
4. You are operating inside a WhatsApp bot, but right now you are conversing naturally as a friend.`;

    const ai = getGeminiClient();
    if (ai) {
        try {
            // Build recent chat history contents
            const contents = [];
            for (const h of history.slice(-8)) {
                contents.push({
                    role: h.role,
                    parts: [{ text: `${h.role === 'user' ? (h.senderName + ': ') : ''}${h.text}` }]
                });
            }
            contents.push({
                role: 'user',
                parts: [{ text: `${senderName}: ${userMessage}` }]
            });

            const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-flash-latest'];
            for (const model of candidateModels) {
                try {
                    const res = await ai.models.generateContent({
                        model,
                        contents,
                        config: {
                            systemInstruction,
                            temperature: 0.85
                        }
                    });
                    if (res && res.text) {
                        const reply = res.text.trim();
                        recordMessage(jid, senderName, 'user', userMessage);
                        recordMessage(jid, 'Cheems', 'model', reply);
                        return reply;
                    }
                } catch (e) {
                    console.log(`[ChatBot Gemini model ${model} fail]`, e?.message || e);
                }
            }
        } catch (err) {
            console.log('[Chatbot AI error]', err?.message || err);
        }
    }

    // High availability fallback via Pollinations text endpoint if Gemini API key isn't active
    try {
        const response = await axios.post('https://text.pollinations.ai/', {
            messages: [
                { role: 'system', content: systemInstruction },
                ...history.slice(-4).map(h => ({ role: h.role === 'model' ? 'assistant' : 'user', content: h.text })),
                { role: 'user', content: `${senderName}: ${userMessage}` }
            ],
            seed: Math.floor(Math.random() * 99999)
        }, { timeout: 12000 });

        if (response.data && typeof response.data === 'string') {
            const reply = response.data.trim();
            recordMessage(jid, senderName, 'user', userMessage);
            recordMessage(jid, 'Cheems', 'model', reply);
            return reply;
        }
    } catch (e) {
        console.log('[Chatbot Fallback error]', e?.message || e);
    }

    // Direct casual human fallback
    const fallbackReplies = [
        "yo, I hear you! what's good?",
        "haha fr? that's wild",
        "lol I'm right here, what's up?",
        "say less, I got you",
        "nah fr that's actually funny 😂",
        "hmm tell me more about that"
    ];
    return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
}

/**
 * Text-to-Speech voice note generator for funny/human voice responses
 */
async function generateVoiceNoteBuffer(text, lang = 'en') {
    if (!text) return null;
    const clean = encodeURIComponent(text.slice(0, 200));
    const ttsUrls = [
        `https://translate.google.com/translate_tts?ie=UTF-8&q=${clean}&tl=${lang}&client=tw-ob`,
        `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${clean}`
    ];

    for (const url of ttsUrls) {
        try {
            const res = await axios.get(url, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': '*/*'
                },
                timeout: 10000
            });
            if (res.data && res.data.length > 500) {
                return Buffer.from(res.data);
            }
        } catch (e) {
            // Try next engine
        }
    }
    return null;
}

module.exports = {
    loadChatbotConfig,
    saveChatbotConfig,
    generateChatbotReply,
    generateVoiceNoteBuffer,
    recordMessage
};
