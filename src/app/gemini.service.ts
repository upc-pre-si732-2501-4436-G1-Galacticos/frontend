import { Injectable } from '@angular/core';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import {environment} from '../environments/environment';
 // Importa tus variables de entorno

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    // Inicializa el SDK de Gemini con tu clave de API

    this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // <-- Usa 'gemini-1.5-flash'
    console.log('GeminiService inicializado con éxito usando gemini-1.5-flash.');
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error("Error al llamar a la API de Gemini:", error);
      return "Lo siento, hubo un error al generar la respuesta.";
    }
  }

  // Opcional: para conversaciones (chat)
  startNewChat() {
    return this.model.startChat({
      history: [], // Puedes precargar un historial si lo deseas
      generationConfig: {
        maxOutputTokens: 200, // Limita la longitud de la respuesta
      },
    });
  }
}
