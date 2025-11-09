import { GoogleGenAI } from "@google/genai";

const fileToGenerativePart = (base64: string, mimeType: string) => {
    return {
        inlineData: {
            data: base64,
            mimeType
        },
    };
};

export const extractTextFromImage = async (base64Image: string): Promise<string> => {
    // FIX: Per coding guidelines, assume API_KEY is present and do not add checks for it.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const imagePart = fileToGenerativePart(base64Image, 'image/png');
    const textPart = { text: "Extract all text from this image. Preserve formatting like paragraphs and line breaks where appropriate. If there is no text, return an empty string." };

    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: [imagePart, textPart] },
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
};
