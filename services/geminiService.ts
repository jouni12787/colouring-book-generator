
import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT_SUFFIX =
  "coloring book page for a child, thick black outlines, no color, no shading, white background, simple, clean lines, cute cartoon style.";

export const generateColoringPage = async (prompt: string): Promise<string> => {
  try {
    const fullPrompt = `${prompt}, ${PROMPT_SUFFIX}`;
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error("No image was generated.");
  } catch (error) {
    console.error("Error generating coloring page:", error);
    throw new Error("Failed to generate coloring page.");
  }
};

let chatInstance: Chat | null = null;

export const getChatInstance = (): Chat => {
    if (!chatInstance) {
        chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: 'You are a friendly and helpful chatbot for children. Keep your answers simple, fun, and encouraging.',
            },
        });
    }
    return chatInstance;
}

export const sendMessageToBot = async (message: string): Promise<string> => {
    try {
        const chat = getChatInstance();
        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Error sending message to bot:", error);
        throw new Error("I'm having a little trouble thinking right now. Please try again in a moment!");
    }
};
   