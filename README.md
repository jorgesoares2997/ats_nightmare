<div align="center">
  <img src="https://img.shields.io/badge/NEXT.JS-16-black?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Gemini%20AI-0056FF?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini" />
  <br />
  <br />
  <h1 align="center">ATS NIGHTMARE 👻</h1>
  <p align="center"><b>A.I Powered Bypass System • Stealth Resume Generator</b></p>
</div>

<br/>

## 🎯 Sobre o Projeto

Se você está cansado de enviar centenas de currículos e ser bloqueado pelos robôs de **ATS (Applicant Tracking Systems)** antes mesmo de um humano ler suas experiências, o **ATS Nightmare** foi feito para você. 

Trata-se de uma aplicação Web Cyberpunk altamente afiada que funciona como um "Bypass" para recrutadores. Ela pega seu **currículo vitrine original (PDF Mestre)** e o submete a um algoritmo de Inteligência Artificial ([Google Gemini 2.5 Flash](https://aistudio.google.com/)). A IA atua como um hacker reescrevendo totalmente sua narrativa técnica, aplicando as *keywords* ideais, podando informações mortas e criando um PDF cirurgicamente alinhado à **descrição da vaga desejada**. 

Seja o que a vaga quiser que você seja, desde que você saiba fazer.

---

## ⚡ Features (Arsenal)
- 🧠 **Narrativa Técnica Direcionada**: A IA não só insere palavras-chave espalhadas, ela reescreve todo o seu "Resumo Profissional" e as suas experiências com base nas tecnologias da Vaga (ex: foca toda sua experiência em Java num viés de Microsserviços e Eureca se a vaga pedir isso).
- 🧹 **Filtro Maximalista**: Oculta linguagens que você conhece mas que não servem para a vaga alvo, eliminando ruído e destacando o "Match Perfeito" logo nos primeiros 6 segundos.
- 🌎 **Tradutor Global (I18N + AI)**: Com o clique de um botão flutuante, você pode instruir a plataforma e a IA a transformar todo o contexto e gerar seu PDF em **Inglês Exato** ou **Português**, adaptando também a sua interface de visualização em tempo real.
- 🖨️ **Gerador de PDF Raw**: Pula geradores pesados baseados em servidores. A renderização do PDF é desenhada diretamente através do DOM (*react-to-print*), permitindo que você extraia o documento em 1 segundo e com hiperlinks reais e clicáveis para seu GitHub/LinkedIn.
- 🕵️ **Stateless & Privado**: Sem bando de dados. Sem autenticação. O código pega a Job Description, envia pra AI, e morre. Super seguro.

---

## 🛠️ Como rodar o sistema localmente

### 1. Requisitos
- Node.js (via Pnpm de preferência)
- Chave de API Válida do **Google Gemini AI**

### 2. Instalação & Setup
Faça o clone mágico deste projeto, instale os pacotes e inicialize as variáveis:

```bash
git clone https://github.com/jorgesoares2997/ats_nightmare.git
cd ats_nightmare
pnpm install
```

Crie um arquivo `.env` na raiz do repositório baseado no modelo e aplique sua chave da Google:
```env
GEMINI_API_KEY="SUA_CHAVE_AQUI"
```

### 3. O Segredo (PDF Mestre)
Você **precisa** adicionar o seu currículo oficial que servirá como banco de dados da sua vida acadêmica/profissional.
Pegue o seu PDF Mestre e coloque-o na pasta `public/` com o exato nome: **`curriculo_base.pdf`**.
*O projeto irá ler esse PDF invisivelmente em Node via \`fs.readFileSync()\`*

### 4. Execute a Aplicação
```bash
pnpm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador, cole a descrição (JD) da vaga dos sonhos no terminal central, clique em `"BYPASS ATS NOW"` e veja a mágica da otimização neural.

---

## 👨‍💻 Desenvolvido Por
Feito para dominar os mercados corporativos.
**Jorge Soares**
- [LinkedIn](https://www.linkedin.com/in/jorgesoar/)
- [Portfólio / Website](https://portfolio-jorge-soares.vercel.app)

*Copyright © ATS Nightmare. Distribuído para fins de alinhamento com sistemas algorítmicos corporativos.*
