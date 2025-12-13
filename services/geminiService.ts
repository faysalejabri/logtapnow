import { GoogleGenAI } from "@google/genai";
import { VCardProfile } from "../types";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBio = async (profile: VCardProfile): Promise<string> => {
  try {
    const prompt = `
      You are a professional copywriter for personal branding. 
      Write a professional, engaging, and concise bio (max 300 characters) for a digital business card based on the following details:
      
      Name: ${profile.firstName} ${profile.lastName}
      Profession: ${profile.profession}
      Current Draft/Notes: ${profile.bio}
      
      The tone should be professional yet approachable. 
      Return ONLY the bio text without any quotation marks or introductory text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate bio. Please ensure the API Key is configured correctly.");
  }
};