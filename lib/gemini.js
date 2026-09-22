require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const axios = require('axios');

const DEFAULT_CUSTOM_KEY = 'sk-ws-H.DDRPIYY.4Mt5.MEUCIQDewvaUX5UpNVng9yhUWlq_hzaMsVK60h_lIAtx4r4u3wIgGsCSPRsE2nl8NCPlc56rbKe4vFOUe3KQWMpSxceV99Q';

function getCustomKey() {
    return process.env.CUSTOM_API_KEY || process.env.OPENAI_API_KEY || global.customApiKey || DEFAULT_CUSTOM_KEY;
}

function getGeminiClient() {
    const key = process.env.GEMINI_API_KEY || process.env.API_KEY || global.geminiKey || '';
    if (!key) return null;
    try {
        return new GoogleGenAI({
            apiKey: key,
            httpOptions: {
                headers: {
                    'User-Agent': 'aistudio-build'
                }
            }
        });
    } catch (e) {
        return null;
    }
}

/**
 * Multi-engine AI response generator centered around user's custom API key with automatic failover
 * @param {string} prompt 
 * @param {object} options { imageBuffer, mimeType, systemInstruction }
 */
async function askGemini(prompt, options = {}) {
    const activeCustomKey = getCustomKey();
    const systemPrompt = options.systemInstruction || 'You are Cheems, an intelligent, helpful WhatsApp AI assistant. Keep your answers clear, well-structured, formatted with WhatsApp markdown (*bold*, _italic_, `monospace`), and concise.';
    let lastError = null;

    // 1. Try Google Gemini SDK if Gemini key is set
    const geminiAi = getGeminiClient();
    if (geminiAi) {
        const candidateModels = [
            'gemini-2.5-flash',
            'gemini-1.5-flash',
            'gemini-2.0-flash',
            'gemini-1.5-pro',
            'gemini-flash-latest'
        ];
        for (const model of candidateModels) {
            try {
                let contents;
                if (options.imageBuffer && options.mimeType) {
                    contents = {
                        parts: [
                            {
                                inlineData: {
                                    mimeType: options.mimeType,
                                    data: options.imageBuffer.toString('base64')
                                }
                            },
                            { text: prompt || 'Analyze this image in detail and answer with helpful context.' }
                        ]
                    };
                } else {
                    contents = prompt;
                }

                const response = await geminiAi.models.generateContent({
                    model,
                    contents,
                    config: {
                        systemInstruction: systemPrompt,
                        temperature: 0.7
                    }
                });

                if (response && response.text) {
                    return response.text.trim();
                }
            } catch (err) {
                lastError = err;
                console.log(`[Gemini SDK] Model ${model} failed:`, err?.message || err);
            }
        }
    }

    // 2. Try Custom API / OpenAI Compatible Endpoint with user's sk-ws- key if custom base URL or custom endpoint is configured
    if (activeCustomKey) {
        const customBaseUrl = process.env.CUSTOM_AI_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions';
        try {
            const messages = [{ role: 'system', content: systemPrompt }];
            if (prompt) {
                messages.push({ role: 'user', content: prompt });
            }

            const res = await axios.post(customBaseUrl, {
                model: process.env.CUSTOM_AI_MODEL || 'gpt-3.5-turbo',
                messages,
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${activeCustomKey}`,
                    'x-api-key': activeCustomKey,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });

            if (res.data?.choices?.[0]?.message?.content) {
                return res.data.choices[0].message.content.trim();
            }
        } catch (customErr) {
            lastError = customErr;
            console.log('[Custom API Endpoint]', customErr?.response?.status || customErr?.message);
        }
    }

    // 3. High Availability Pollinations AI Text & Vision Fallback Engine
    try {
        const messages = [{ role: 'system', content: systemPrompt }];
        let userContent = prompt || 'Hello! How can you help me today?';
        if (options.imageBuffer) {
            userContent = `[User provided an image] ${userContent}`;
        }
        messages.push({ role: 'user', content: userContent });

        const response = await axios.post('https://text.pollinations.ai/', {
            messages,
            seed: Math.floor(Math.random() * 999999),
            model: 'openai'
        }, { timeout: 15000 });

        if (response.data && typeof response.data === 'string' && response.data.trim().length > 0) {
            return response.data.trim();
        }
    } catch (pollinationErr) {
        lastError = pollinationErr;
        console.log('[Pollinations AI Engine]', pollinationErr?.message);
    }

    throw lastError || new Error('Unable to generate AI response. Please check your API key or network connection.');
}

/**
 * Generate image using multi-engine high-availability AI image generator
 * @param {string} prompt 
 * @param {object} options 
 */
async function generateGeminiImage(prompt, options = {}) {
    if (!prompt || typeof prompt !== 'string') {
        throw new Error('Please provide a prompt for image generation');
    }

    const cleanPrompt = prompt.trim();
    const encoded = encodeURIComponent(cleanPrompt);
    const randomSeed = Math.floor(Math.random() * 999999);

    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
        'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.105 Mobile Safari/537.36'
    ];

    const engineUrls = [
        `https://image.pollinations.ai/prompt/${encoded}?nologo=true&seed=${randomSeed}`,
        `https://image.pollinations.ai/prompt/${encoded}?model=flux&nologo=true&seed=${randomSeed}`,
        `https://image.pollinations.ai/prompt/${encoded}?model=turbo&nologo=true&seed=${randomSeed}`,
        `https://image.pollinations.ai/prompt/${encoded}?width=768&height=768&nologo=true&seed=${randomSeed}`
    ];

    let lastError = null;

    for (const url of engineUrls) {
        for (const ua of userAgents) {
            try {
                const res = await axios.get(url, {
                    responseType: 'arraybuffer',
                    headers: {
                        'User-Agent': ua,
                        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
                    },
                    timeout: 25000
                });

                if (res.data && res.data.length > 2000) {
                    const contentType = res.headers['content-type'] || '';
                    if (!contentType.includes('text/html') && !contentType.includes('application/json')) {
                        return Buffer.from(res.data);
                    }
                }
            } catch (err) {
                lastError = err;
                await new Promise(r => setTimeout(r, 600));
            }
        }
    }

    throw lastError || new Error('Image generation service is temporarily busy. Please retry in a few moments.');
}

module.exports = {
    askGemini,
    generateGeminiImage,
    getGeminiClient,
    getCustomKey
};
