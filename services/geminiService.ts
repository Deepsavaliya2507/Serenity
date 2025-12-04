import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CHAT_SYSTEM_INSTRUCTION = `
You are Serenity, a compassionate, supportive, and non-judgmental mental health companion.
Your goal is to provide a safe space for users to express their feelings.
- Practice active listening.
- Validate the user's emotions.
- Offer gentle coping strategies (mindfulness, grounding, cognitive reframing).
- Keep responses concise (under 150 words) unless asked for more depth.
- Use a warm, calming tone.
- CRITICAL: You are NOT a doctor or therapist. If the user indicates self-harm, suicide, or severe crisis, you MUST gently urge them to seek professional help immediately and provide general emergency context (like "Please contact emergency services or a crisis hotline").
`;

const JOURNAL_SYSTEM_INSTRUCTION = `
Analyze the following journal entry. Provide a brief, supportive reflection (max 2 sentences) and determine the overall sentiment.
`;

export const streamChatResponse = async (
  history: ChatMessage[],
  newMessage: string,
  onChunk: (text: string) => void
) => {
  try {
    // Transform history for the API
    // Note: The history format for chats.create is slightly different if we were pre-loading it,
    // but for simplicity in this stateless service wrapper, we'll just start a new chat with the prompt context
    // or rely on the fact that we are managing state in the component.
    // For a robust implementation, we pass previous history to the model context manually or keep the chat instance alive.
    // Here we will use a fresh chat instance with history passed in.

    const chatHistory = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: CHAT_SYSTEM_INSTRUCTION,
      },
      history: chatHistory
    });

    const result = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of result) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Chat Error:", error);
    onChunk("I'm having trouble connecting right now. Please try again in a moment.");
  }
};

export const analyzeJournalEntry = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: content,
      config: {
        systemInstruction: JOURNAL_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              enum: ["positive", "neutral", "negative"],
            },
            reflection: {
              type: Type.STRING,
            },
          },
          required: ["sentiment", "reflection"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Analysis Error:", error);
    return { sentiment: "neutral", reflection: "Unable to analyze at this moment, but well done for writing this down." };
  }
};
