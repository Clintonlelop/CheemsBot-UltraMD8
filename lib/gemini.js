require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const axios = require('axios');

const DEFAULT_CUSTOM_KEY = '';

function getCustomKey() {
    return global.customApiKey || process.env.CUSTOM_API_KEY || process.env.OPENAI_API_KEY || DEFAULT_CUSTOM_KEY;
}

function getGeminiClient() {
    const key = global.geminiKey || process.env.GEMINI_API_KEY || process.env.API_KEY || '';
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
 * Strictly required Google Gemini AI Generator
 * @param {string} prompt 
 * @param {object} options { imageBuffer, mimeType, systemInstruction }
 */
async function askGemini(prompt, options = {}) {
    const key = global.geminiKey || process.env.GEMINI_API_KEY || process.env.API_KEY || '';
    if (!key) {
        throw new Error('KEY_MISSING_GEMINI');
    }

    const systemPrompt = options.systemInstruction || 'You are Cheems, an intelligent, helpful WhatsApp AI assistant. Keep your answers clear, well-structured, formatted with WhatsApp markdown (*bold*, _italic_, `monospace`), and concise.';
    let lastError = null;

    const geminiAi = getGeminiClient();
    if (geminiAi) {
        const candidateModels = [
            'gemini-3.8-flash',
            'gemini-flash-latest',
            'gemini-3.5-flash',
            'gemini-3.1-flash-lite'
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

    throw lastError || new Error('Google Gemini API service rejected the request. Please check if your key is active.');
}

/**
 * Strictly required Custom OpenAI / ChatGPT Generator
 * @param {string} prompt 
 * @param {object} options 
 */
async function askChatGPT(prompt, options = {}) {
    const activeCustomKey = global.customApiKey || process.env.CUSTOM_API_KEY || process.env.OPENAI_API_KEY || '';
    // If it's missing or matches the default placeholder, treat as missing key!
    if (!activeCustomKey || activeCustomKey.startsWith('sk-ws-')) {
        throw new Error('KEY_MISSING_OPENAI');
    }

    const systemPrompt = options.systemInstruction || 'You are Cheems, an intelligent, helpful WhatsApp AI assistant. Keep your answers clear, well-structured, formatted with WhatsApp markdown (*bold*, _italic_, `monospace`), and concise.';

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
        console.log('[Custom API Endpoint Error]', customErr?.response?.status || customErr?.message);
        throw customErr;
    }

    throw new Error('OpenAI / ChatGPT service rejected the request. Please check if your key is active.');
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

    // 1. If Gemini API Key is configured, use the official Google Imagen 3 Model!
    const geminiAi = getGeminiClient();
    if (geminiAi) {
        try {
            console.log(`[AutoImage] Generating image via official Google Imagen 3...`)
            const response = await geminiAi.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: cleanPrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '1:1'
                }
            });
            if (response && response.generatedImages && response.generatedImages[0]) {
                const base64Image = response.generatedImages[0].image.imageBytes;
                return {
                    buffer: Buffer.from(base64Image, 'base64'),
                    engine: 'Google Imagen 3 (Official)'
                };
            }
        } catch (e) {
            console.error('[Imagen 3 Generation Error, falling back to Flux/Pollinations]', e.message || e);
        }
    }

    // 2. Fallback to highly-optimized open-source AI image generators (Flux, SD Turbo)
    const encoded = encodeURIComponent(cleanPrompt);
    const randomSeed = Math.floor(Math.random() * 999999);

    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
        'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.105 Mobile Safari/537.36'
    ];

    const engineUrls = [
        `https://image.pollinations.ai/prompt/${encoded}?model=flux&nologo=true&enhance=false&nofeed=true&seed=${randomSeed}`,
        `https://image.pollinations.ai/prompt/${encoded}?nologo=true&enhance=false&nofeed=true&seed=${randomSeed}`,
        `https://image.pollinations.ai/prompt/${encoded}?model=turbo&nologo=true&enhance=false&nofeed=true&seed=${randomSeed}`
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
                        return {
                            buffer: Buffer.from(res.data),
                            engine: 'Cheems AI (Flux - Fallback)'
                        };
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
    askChatGPT,
    generateGeminiImage,
    getGeminiClient,
    getCustomKey
};
