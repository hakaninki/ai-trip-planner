// SERVER ONLY — never import this in a client component
import { GoogleGenerativeAI } from "@google/generative-ai";

function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    return new GoogleGenerativeAI(apiKey);
}

export async function callGemini(prompt: string): Promise<string> {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
}
