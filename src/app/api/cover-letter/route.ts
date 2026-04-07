import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

const FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-1.5-flash',
];

function isRetryableGeminiError(error: unknown) {
  const maybeError = error as { status?: number; message?: string };
  const status = maybeError?.status;
  const message = String(maybeError?.message ?? '');

  if (status === 429 || status === 500 || status === 503) {
    return true;
  }

  return /\b(429|500|503)\b|Service Unavailable|high demand|temporarily unavailable/i.test(message);
}

async function generateWithFallbackModels(
  genAI: GoogleGenerativeAI,
  pdfPart: { inlineData: { data: string; mimeType: string } },
  promptText: string
) {
  let lastError: unknown = null;

  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([pdfPart, promptText]);
      return { responseText: result.response.text(), modelName };
    } catch (error) {
      lastError = error;
      if (!isRetryableGeminiError(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jobDescription, language, customPdfData, customPrompt } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Chave de API do Gemini não configurada no servidor (.env).' }, { status: 400 });
    }

    if (!jobDescription) {
      return NextResponse.json({ error: 'Job Description é obrigatório.' }, { status: 400 });
    }

    let pdfData: string;
    if (customPdfData) {
      pdfData = customPdfData;
    } else {
      const pdfPath = path.join(process.cwd(), 'public', 'curriculo_base.pdf');
      try {
        pdfData = fs.readFileSync(pdfPath).toString('base64');
      } catch {
        return NextResponse.json(
          { error: 'Arquivo curriculo_base.pdf não encontrado na pasta public. Certifique-se de adicioná-lo.' },
          { status: 404 }
        );
      }
    }

    const pdfPart = {
      inlineData: {
        data: pdfData,
        mimeType: 'application/pdf',
      },
    };

    const promptText = `
Você é um especialista em recrutamento técnico e redação de carta de apresentação.
Com base no currículo em PDF anexo e na descrição da vaga abaixo, escreva uma carta de apresentação curta, objetiva e estratégica.

Regras:
1. Carta em ${language === 'EN' ? 'INGLÊS (English)' : 'PORTUGUÊS (PT-BR)'}.
2. Tom profissional, confiante e humano.
3. Tamanho ideal: entre 1.000 e 2.000 caracteres (aprox. 150 a 300 palavras).
4. Estrutura: 3 a 5 parágrafos curtos, com leitura total em 30-45 segundos.
5. Cada frase deve justificar sua presença. Evite floreios, repetições e frases genéricas.
6. Cite aderência com tecnologias e desafios da vaga usando evidências do currículo base.
7. Não inventar experiência, empresa, projeto ou resultado que não exista no currículo base.
8. Evite texto cansativo (acima de 3.000 caracteres) e evite texto curto demais/genérico (abaixo de 800 caracteres).
9. Retorne APENAS um JSON válido no formato: {"coverLetter":"texto da carta"}.

# DESCRIÇÃO DA VAGA (JD):
${jobDescription}

${customPrompt ? `# AJUSTES ESPECÍFICOS DO USUÁRIO:\n${customPrompt}` : ''}
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const { responseText, modelName } = await generateWithFallbackModels(genAI, pdfPart, promptText);

    let cleanJsonStr = responseText.trim();
    if (cleanJsonStr.startsWith('```json')) {
      cleanJsonStr = cleanJsonStr.replace(/^```json/m, '');
      cleanJsonStr = cleanJsonStr.replace(/```$/m, '');
    } else if (cleanJsonStr.startsWith('```')) {
      cleanJsonStr = cleanJsonStr.replace(/^```/m, '');
      cleanJsonStr = cleanJsonStr.replace(/```$/m, '');
    }

    const data = JSON.parse(cleanJsonStr.trim()) as { coverLetter?: string };

    return NextResponse.json({
      coverLetter: data.coverLetter ?? '',
      _meta: { generatedWithModel: modelName },
    });
  } catch (error: unknown) {
    console.error('Erro na geração da carta:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar carta de apresentação com a IA.', details: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
