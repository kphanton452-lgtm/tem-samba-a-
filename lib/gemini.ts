
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Analisa conteúdo de textos brutos ou URLs usando Gemini 3.
 */
export async function parseContentWithAI(rawText: string, type: 'event' | 'video' | 'article') {
  // Inicialização local para evitar erro de 'process' no topo do arquivo
  const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || "";
  if (!apiKey) {
    console.error("Gemini API Key não encontrada em process.env.API_KEY");
    return null;
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  const isUrl = rawText.trim().startsWith('http');
  
  const systemInstructions = {
    event: `Você é um scanner de eventos. Extraia dados para JSON. 
    Se o link for Instagram/Facebook/Sympla, use o Google Search para encontrar informações reais. 
    Retorne APENAS o JSON: { "title": "max 30 letras", "day": "00", "month": "3 letras", "location": "local", "price": "atrações/preço", "image_url": "url_da_imagem", "ticket_url": "url_do_ingresso" }`,
    video: "Extraia do texto/link para JSON: { \"title\": \"título do vídeo\", \"category\": \"categoria\", \"video_url\": \"url\", \"thumbnail\": \"url_da_capa\" }",
    article: "Extraia do texto/link para JSON: { \"title\": \"título\", \"excerpt\": \"resumo curto\", \"category\": \"categoria\", \"read_time\": \"X min\", \"content\": \"conteúdo completo\", \"image_url\": \"url_da_foto\" }"
  };

  try {
    const config: any = {
      systemInstruction: systemInstructions[type],
      responseMimeType: "application/json",
      temperature: 0.1,
    };

    if (isUrl) {
      config.tools = [{ googleSearch: {} }];
    }

    const prompt = isUrl 
      ? `EXTRAIA AS INFORMAÇÕES E A IMAGEM PRINCIPAL DESTE CONTEÚDO: ${rawText}` 
      : `Analise este texto e preencha os campos: "${rawText}"`;

    const response = await ai.models.generateContent({ 
      model, 
      contents: prompt, 
      config 
    });
    
    const result = response.text;
    if (!result) return null;
    
    return {
      data: JSON.parse(result.trim()),
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((s: any) => s.web?.uri).filter(Boolean) || []
    };
  } catch (e) {
    console.error("Erro Gemini:", e);
    return null;
  }
}

/**
 * Revisa textos mantendo a identidade cultural afro-brasileira.
 */
export async function reviseContentWithAI(text: string) {
  const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || "";
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';

  const systemInstruction = `Você é um editor de conteúdo cultural afro-brasileiro especializado em Samba e tradições de matriz africana. 
  Seu trabalho é: 
  - Resumir textos se necessário;
  - Melhorar clareza e fluidez;
  - Manter e fortalecer a identidade cultural;
  - NÃO remover termos ancestrais (ex: axé, fundamento, terreiro, baluarte, etc);
  - NÃO simplificar ou "embranquecer" expressões culturais;
  - Usar um tom vibrante, respeitoso e ancestral.
  
  Entrada: texto bruto.
  Saída: APENAS o texto revisado, bem formatado em parágrafos, pronto para publicação imediata.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Revise o seguinte texto para o radar cultural: "${text}"`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text?.trim() || null;
  } catch (e) {
    console.error("Erro na Revisão Cultural IA:", e);
    return null;
  }
}
