import { GoogleGenerativeAI } from "@google/genai";
import { MoodEntry, MOOD_LABELS } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateMoodInsight(entry: MoodEntry): Promise<string> {
  const prompt = `
    Actúa como un coach de bienestar y psicólogo positivo. 
    Basándote en el siguiente registro diario, ofrece una breve reflexión (máximo 300 caracteres) que sea empática, motivadora y perspicaz.
    
    Registro:
    - Estado de ánimo: ${MOOD_LABELS[entry.mood]}
    - Puntuación del día: ${entry.score}/10
    - Nivel de energía: ${entry.energy}
    - Palabra del día: ${entry.word}
    - Notas: ${entry.note}

    Responde directamente con la reflexión, sin introducciones ni etiquetas. Usa un tono cercano y cálido.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating mood insight:", error);
    return "No se pudo generar la reflexión en este momento, pero recuerda que cada día es una oportunidad para empezar de nuevo.";
  }
}
