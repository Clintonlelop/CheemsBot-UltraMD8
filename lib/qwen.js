require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const axios = require('axios');

const QWEN_MODELS = ['qwen-plus', 'qwen-turbo', 'qwen-max'];

function getQwenConfig() {
    const key = process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY || global.qwenKey || '';
    const base = process.env.QWEN_API_BASE || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1';
    return { key, base };
}

/**
 * Ask Qwen (Alibaba DashScope, OpenAI-compatible endpoint).
 * @param {string} prompt
 * @param {object} options { systemInstruction, history: [{role, content}] }
 * @returns {Promise<string>} the model reply text
 */
async function askQwen(prompt, options = {}) {
    const { key, base } = getQwenConfig();
    
    // Only attempt DashScope if a valid Qwen key (sk-...) is configured (and not generic placeholder keys)
    if (key && !key.startsWith('sk-ws-')) {
        const messages = [];
        const systemText = options.systemInstruction ||
            'You are Qwen, a friendly and helpful WhatsApp bot assistant. Reply concisely, use light formatting, and match the language of the user.';
        if (systemText) messages.push({ role: 'system', content: systemText });
        if (Array.isArray(options.history)) {
            for (const h of options.history) {
                if (h && (h.role === 'user' || h.role === 'assistant') && h.content) {
                    messages.push({ role: h.role, content: String(h.content).slice(0, 4000) });
                }
            }
        }
        messages.push({ role: 'user', content: String(prompt).slice(0, 6000) });

        for (const model of QWEN_MODELS) {
            try {
                const res = await axios.post(
                    `${base}/chat/completions`,
                    { model, messages, temperature: 0.7, max_tokens: 1500 },
                    {
                        headers: {
                            Authorization: `Bearer ${key}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 15000
                    }
                );
                const text = res.data?.choices?.[0]?.message?.content;
                if (text && String(text).trim()) return String(text).trim();
            } catch (err) {
                // If DashScope fails, fallback seamlessly below
            }
        }
    }

    // High availability fallback engine
    const { askGemini } = require('./gemini');
    return await askGemini(prompt, {
        systemInstruction: options.systemInstruction || 'You are Qwen AI, an intelligent, helpful WhatsApp AI assistant. Reply clearly with concise WhatsApp markdown.'
    });
}

module.exports = { askQwen, getQwenConfig };
