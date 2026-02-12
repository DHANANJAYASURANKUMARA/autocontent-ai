// AutoContent AI — AI Content Generation Engine
// Generates scripts, titles, descriptions, and hashtags for Video, Photo, and Text
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GenerateRequest {
    niche: string;
    style: string;
    platform: 'youtube' | 'tiktok' | 'facebook' | 'all';
    type: 'video' | 'photo' | 'shorts' | 'text';
    customTopic?: string;
}

export interface ContentPreferences {
    tone: string;
    length: 'short' | 'medium' | 'long';
    brandName: string;
    targetKeywords?: string[];
    language: string;
    // Visual Branding
    font?: string;
    primaryColor?: string;
    backgroundStyle?: string;
    // Provider Config
    aiProvider?: 'gemini' | 'openai' | 'custom';
    openaiKey?: string;
    customBaseUrl?: string;
    customKey?: string;
    customModel?: string;
}

export interface GeneratedContent {
    title: string;
    description: string;
    script: string;
    hashtags: string[];
    imageUrl?: string;
}

async function callOpenAICompatible(
    prompt: string,
    apiKey: string,
    baseUrl: string,
    modelName: string
): Promise<string> {
    const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: modelName,
                messages: [
                    { role: 'system', content: 'You are a viral content generator. Return ONLY JSON.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7
            })
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`OpenAI/Custom API Error: ${res.status} ${res.statusText} - ${errorText}`);
        }

        const data = await res.json();
        return data.choices?.[0]?.message?.content || '';
    } catch (err: any) {
        console.error("AI Provider Error:", err.message);
        throw err;
    }
}

export async function generateContent(
    req: GenerateRequest,
    apiKey?: string, // Legacy param, kept for compatibility but should use prefs.geminiKey etc
    prefs?: ContentPreferences
): Promise<GeneratedContent> {
    const topic = req.customTopic || "Interesting Trends";

    // Default preferences
    const tone = prefs?.tone || "Professional & Engaging";
    const length = prefs?.length || "medium";
    const brand = prefs?.brandName || "AutoContent AI";
    const lang = prefs?.language || "English";
    const font = prefs?.font || "Inter";
    const color = prefs?.primaryColor || "#0070f3";
    const bg = prefs?.backgroundStyle || "solid";

    const provider = prefs?.aiProvider || 'gemini';

    const lengthDesc = {
        short: "very concise (under 30 seconds / brief post)",
        medium: "standard length (60-90 seconds / detailed post)",
        long: "comprehensive and deep (2-3 minutes / long-form article)"
    }[length];

    const prompt = `
        Create viral content for a ${req.platform} ${req.type}.
        Brand Name: ${brand}
        Language: ${lang}
        Niche: ${req.niche}
        Style: ${req.style}
        Tone: ${tone}
        Target Length: ${lengthDesc}
        Topic: ${topic}
        Visual Branding: Font=${font}, Color=${color}, Background=${bg}
        ${prefs?.targetKeywords?.length ? `Include Keywords: ${prefs.targetKeywords.join(', ')}` : ''}

        Requirements for Type:
        - video/shorts: High-engagement script with hooks.
        - photo: An image description/alt text and a short caption.
        - text: A detailed social media post.

        Return the response as a JSON object with:
        - title: Catchy title.
        - description: Summary/description.
        - script: The main content (script for video, post body for text, caption for photo).
        - hashtags: Array of 5-8 hashtags.
        - imageDescription: (Optional) If it's a photo, describe what should be in the image.
    `;

    try {
        let text = '';

        // Default to Gemini for text generation as per user requirement
        const geminiKey = apiKey?.trim();
        if (geminiKey) {
            console.log(`[AI-ENGINE] Attempting Gemini generation for ${req.type}...`);
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            text = response.text();
        } else if (provider === 'openai' && prefs?.openaiKey) {
            const ok = prefs.openaiKey.trim();
            console.log(`[AI-ENGINE] Attempting OpenAI fallback for ${req.type}...`);
            text = await callOpenAICompatible(prompt, ok, 'https://api.openai.com/v1', 'gpt-3.5-turbo');
        } else if (provider === 'custom' && prefs?.customBaseUrl && (prefs?.customKey !== undefined)) {
            const ck = prefs.customKey.trim();
            console.log(`[AI-ENGINE] Attempting Custom fallback (${prefs.customBaseUrl}) for ${req.type}...`);
            text = await callOpenAICompatible(prompt, ck, prefs.customBaseUrl, prefs.customModel || 'gpt-3.5-turbo');
        }

        if (text) {
            const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
            const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                try {
                    const parsed = JSON.parse(jsonMatch[0]);
                    return {
                        title: parsed.title || `${topic}`,
                        description: parsed.description || "",
                        script: parsed.script || parsed.text || "",
                        hashtags: parsed.hashtags || [],
                    };
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                }
            }
        }
    } catch (error: any) {
        console.error(`[AI-ENGINE] Fatal failure for ${req.type}:`, error.message || error);
    }

    // --- Fallback ---
    return {
        title: `${topic}: New Update for ${brand}`,
        description: `Everything you need to know about ${topic} in the ${req.niche} world. Presented by ${brand}.`,
        script: `[HOOK] Stop browsing! ${brand} is revealing how ${topic} is changing the game.\n\nHere is why it matters for ${req.niche} explorers.\n\n[CTA] Drop a ❤️ and follow ${brand} if you agree!`,
        hashtags: [`#${req.niche}`, `#${topic.replace(/\s+/g, '')}`, '#Viral', `#${brand.replace(/\s+/g, '')}`],
        imageUrl: req.type === 'photo' ? `https://picsum.photos/seed/${topic}/1080/1080` : undefined
    };
}

export async function generateBatchContent(
    req: GenerateRequest,
    count: number,
    apiKey?: string,
    prefs?: ContentPreferences
): Promise<GeneratedContent[]> {
    const results: GeneratedContent[] = [];
    for (let i = 0; i < count; i++) {
        results.push(await generateContent(req, apiKey, prefs));
    }
    return results;
}

export const NICHES = ['Technology', 'Motivation', 'Finance', 'Gaming', 'Education', 'Fitness', 'Comedy', 'Cooking', 'Travel', 'Science'];
export const STYLES = ['educational', 'entertaining', 'tutorial', 'motivational', 'storytelling'];
export const TYPES = ['video', 'photo', 'shorts', 'text'];
