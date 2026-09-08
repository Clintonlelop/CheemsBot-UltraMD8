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
    if (!key) {
        throw new Error('Qwen API key is not configured. Set QWEN_API_KEY in the environment.');
    }

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

    let lastError = null;
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
                    timeout: 60000
                }
            );
            const text = res.data?.choices?.[0]?.message?.content;
            if (text && String(text).trim()) return String(text).trim();
            lastError = new Error('Empty response from Qwen');
        } catch (err) {
            lastError = err;
            const status = err?.response?.status;
            // Model not found / no access for this key -> try the next candidate model
            if (status === 404 || status === 403) continue;
            // Auth/billing/rate problems will not be fixed by switching models
            if (status === 401) throw new Error('Qwen API key was rejected (401). Check QWEN_API_KEY.');
            if (status === 429) throw new Error('Qwen rate limit hit (429). Please retry in a moment.');
            // network/timeout -> try next model then surface error
        }
    }
    throw lastError || new Error('Qwen request failed.');
}

module.exports = { askQwen, getQwenConfig };
