import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jobDescription, language, customPdfData } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Chave de API do Gemini não configurada no servidor (.env).' }, { status: 400 });
    }

    if (!jobDescription) {
      return NextResponse.json({ error: 'Job Description é obrigatório.' }, { status: 400 });
    }

    // Tenta ler o currículo base do PDF local ou usa o providenciado pelo usuario
    let pdfData: string;
    if (customPdfData) {
      pdfData = customPdfData;
    } else {
      const pdfPath = path.join(process.cwd(), 'public', 'curriculo_base.pdf');
      try {
        pdfData = fs.readFileSync(pdfPath).toString("base64");
      } catch (err) {
        return NextResponse.json({ 
          error: 'Arquivo curriculo_base.pdf não encontrado na pasta public. Certifique-se de adicioná-lo.' 
        }, { status: 404 });
      }
    }

    const pdfPart = {
      inlineData: {
        data: pdfData,
        mimeType: "application/pdf"
      }
    };

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const promptText = `
Você é um especialista em ATS (Applicant Tracking System) nível expert e um recrutador sênior de tecnologia.
Vou te fornecer o meu CURRÍCULO BASE (documento PDF original anexo) e uma DESCRIÇÃO DE VAGA (Job Description).

Sua tarefa:
Leia profundamente as informações do arquivo PDF anexo, perceba perfeitamente todas minhas habilidades, e então adapte e destaque esses pontos para que combinem perfeitamente com a descrição da vaga fornecida, garantindo que eu passe em qualquer filtro ATS.

# REGRAS RÍGIDAS:
1. SUBSTITUIÇÃO TOTAL E TRADUÇÃO: A versão gerada deve ser a VERSÃO DEFINITIVA otimizada. Reescreva completamente as informações dando foco absoluto à Vaga. Obrigatório gerar todo o conteúdo e idioma final sendo **${language === 'EN' ? 'INGLÊS (English)' : 'PORTUGUÊS (PT-BR)'}**.
2. NARRATIVA TÉCNICA DIRECIONADA: As seções "Resumo" e as descrições de "Experiência" DEVEM ser geradas e reescritas baseadas fortemente no contexto das tecnologias exigidas pela vaga. Por exemplo, se a vaga pedir Java com Microsserviços, construa a narrativa inteira em torno de microsserviços, API Gateway, Eureka, Spring Cloud, etc (desde que presentes/compatíveis com sua base histórica).
3. FILTRO MAXIMALISTA DE TECNOLOGIAS: O currículo DEVE conter APENAS as tecnologias informadas e relevantes para a Job Description enviada. Oculte e limpe totalmente as linguagens e frameworks antigos/paralelos que você saiba mas não servem para esta vaga.
4. Não invente empregos ou graus acadêmicos. Adapte e molde a realidade.
5. NUNCA USE MARKDOWN COMO **texto**: Caso queira enfatizar palavras-chave (bold), utilize SOMENTE tags HTML como <strong>palavra</strong> diretamente inseridas nas strings alvo.
6. GÊNERO MASCULINO: O currículo é para um HOMEM. Sempre escreva no masculino.
7. Otimize os "highlights" das experiências com FOCO nos resultados e terminologia da vaga. Use a tag HTML <strong> nas keywords dentro do highlight.
8. VOCÊ DEVE RETORNAR APENAS UM JSON VÁLIDO puro. Sem backticks/markdown por fora.

# ESTRUTURA DO JSON ESPERADA:
{
  "personalInfo": {
    "name": "Nome Completo (extraído do currículo)",
    "title": "Título Profissional Otimizado para a Vaga (sempre no masculino)",
    "contact": "jorgesoares2997@gmail.com | (81) 98759-4291",
    "linkedin": "https://www.linkedin.com/in/jorgesoar/",
    "github": "https://github.com/jorgesoares2997"
  },
  "summary": "Resumo executivo em 3-4 linhas perfeitamente alinhado...",
  "skills": ["Habilidade 1", "Habilidade 2", "Palavra-chave exata da vaga"],
  "experience": [
    {
      "company": "Nome da Empresa",
      "role": "Cargo Otimizado",
      "period": "Período (ex: Jan 2020 - Atual)",
      "highlights": [
        "Conquista 1 usando palavra-chave",
        "Conquista 2..."
      ]
    }
  ],
  "education": [
    {
      "institution": "Nome da Instituição",
      "degree": "Grau/Diploma",
      "period": "Período"
    }
  ]
}

# DESCRIÇÃO DA VAGA (JD):
${jobDescription}
`;

    // Chamamos a model com 2 parts: documento PDF e o texto do Prompt
    const result = await model.generateContent([pdfPart, promptText]);
    const responseText = result.response.text();
    
    let cleanJsonStr = responseText.trim();
    if (cleanJsonStr.startsWith('\`\`\`json')) {
      cleanJsonStr = cleanJsonStr.replace(/^\`\`\`json/m, '');
      cleanJsonStr = cleanJsonStr.replace(/\`\`\`$/m, '');
    } else if (cleanJsonStr.startsWith('\`\`\`')) {
      cleanJsonStr = cleanJsonStr.replace(/^\`\`\`/m, '');
      cleanJsonStr = cleanJsonStr.replace(/\`\`\`$/m, '');
    }

    const data = JSON.parse(cleanJsonStr.trim());

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Erro na geração:', error);
    return NextResponse.json(
      { error: 'Falha ao processar com a IA. Verifique as credenciais ou texto enviado.', details: error.message },
      { status: 500 }
    );
  }
}
