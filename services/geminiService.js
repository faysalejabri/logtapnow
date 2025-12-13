import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBio = async (profile) => {
  try {
    const prompt = `\n      You are a professional copywriter for personal branding. \n      Write a professional, engaging, and concise bio (max 300 characters) for a digital business card based on the following details:\n      \n      Name: ${profile.firstName} ${profile.lastName}\n      Profession: ${profile.profession}\n      Current Draft/Notes: ${profile.bio}\n      \n      The tone should be professional yet approachable. \n      Return ONLY the bio text without any quotation marks or introductory text.\n    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(
      "Failed to generate bio. Please ensure the API Key is configured correctly."
    );
  }
};
