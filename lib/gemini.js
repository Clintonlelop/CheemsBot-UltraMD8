require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const axios = require('axios');

function getGeminiClient() {
    const key = process.env.GEMINI_API_KEY || process.env.API_KEY || global.geminiKey || '';
    if (!key) return null;
    return new GoogleGenAI({
        apiKey: key,
        httpOptions: {
            headers: {
                'User-Agent': 'aistudio-build'
            }
        }
    });
}

/**
 * Generate answer from Gemini models with automatic fallback
 * @param {string} prompt 
 * @param {object} options { imageBuffer, mimeType, systemInstruction }
 */
async function askGemini(prompt, options = {}) {
    const ai = getGeminiClient();
    if (!ai) {
        throw new Error('Gemini API key is not configured in environment variables.');
    }

    const candidateModels = [
        'gemini-2.5-flash',
        'gemini-1.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-pro',
        'gemini-flash-latest'
    ];

    let lastError = null;
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

            const response = await ai.models.generateContent({
                model,
                contents,
                config: {
                    systemInstruction: options.systemInstruction || 'You are an intelligent, helpful WhatsApp AI assistant powered by Google Gemini. Keep your answers clear, well-structured, formatted with WhatsApp markdown (*bold*, _italic_, `monospace`), and concise.',
                    temperature: 0.7
                }
            });

            if (response && response.text) {
                return response.text.trim();
            }
        } catch (err) {
            lastError = err;
            console.log(`[Gemini] Model ${model} returned error:`, err?.message || err);
        }
    }

    throw lastError || new Error('Unable to get response from Gemini AI models.');
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

    // Engine candidates
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
                // Wait briefly before attempting next variation
                await new Promise(r => setTimeout(r, 600));
            }
        }
    }

    throw lastError || new Error('Image generation service is temporarily busy. Please retry in a few moments.');
}

module.exports = {
    askGemini,
    generateGeminiImage,
    getGeminiClient
};
