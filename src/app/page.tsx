'use client';

import React, { useState, useRef } from 'react';
import { Ghost, Wand2, TerminalSquare, Sparkles, DownloadCloud, PlusCircle, RefreshCw, Crosshair, Globe, UploadCloud, Eye, ChevronDown, RotateCcw, FileText, Copy, Check } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/material.css';
import 'tippy.js/animations/scale-extreme.css';
import { ResumePreview, ResumeData } from '@/components/ResumePreview';

const I18N = {
  PT: {
    subtitle: 'A.I Powered Bypass System • Stealth Resume Generator',
    targetJob: 'TARGET JOB DESCRIPTION',
    placeholderJD: 'Cole a descrição da vaga (Job Description) desejada...',
    autoExtractDesc: 'Extraindo PDF Original:',
    btnCustomPdf: 'Ou faça upload do seu próprio currículo (PDF)',
    btnCustomPdfActive: 'Mestre atualizado:',
    linkGuide: '[ Ver Base Atual ]',
    btnHack: '[ INVADINDO ATS ]',
    btnBypass: 'OTIMIZAR ATS AGORA',
    btnPromptToggle: 'Adicionar ajuste no prompt da vaga',
    promptLabel: 'Ajuste Especifico da Vaga',
    promptPlaceholder: 'Ex: Priorize Java/Spring, resultados quantificaveis, foco em microsservicos e cloud...',
    coverLetterAction: 'Gerar carta de apresentacao baseada na vaga',
    coverLetterTitle: 'Carta de Apresentacao',
    coverLetterLoading: 'Gerando carta personalizada...',
    copyCoverLetter: 'Copiar carta',
    copied: 'Copiado',
    synthTitle: 'Sintetizando',
    synthDesc: 'Enviando PDF mestre para o motor Gemini...',
    successTitle: 'BYPASS CONCLUIDO',
    successDesc: 'A.I alinhou sua trajetoria com o algoritmo da empresa.',
    btnNew: 'NOVA VAGA',
    btnRecompile: 'REFAZER',
    btnRecompilePrompt: 'REFAZER COM AJUSTE',
    btnDownload: 'GERAR PDF',
    hintNew: 'Novo (N)',
    hintRecompile: 'Refazer (R)',
    hintRecompilePrompt: 'Refazer com ajuste (RP)',
    hintDownload: 'Baixar PDF (PDF)',
    hintCoverLetter: 'Gerar carta de apresentacao',
    alertJD: '⚠️ Cole a Descrição da Vaga (JD) para continuar.',
    alertError: 'Erro na requisição: ',
    footerPortfolio: 'Portfolio',
    footerBy: 'Por',
    langToggle: 'PT-BR'
  },
  EN: {
    subtitle: 'A.I Powered Bypass System • Stealth Resume Generator',
    targetJob: 'TARGET JOB DESCRIPTION',
    placeholderJD: 'Paste the target Job Description (JD) here...',
    autoExtractDesc: 'Extracting Master PDF:',
    btnCustomPdf: 'Or upload your own resume base (PDF)',
    btnCustomPdfActive: 'Master updated:',
    linkGuide: '[ View Current Base ]',
    btnHack: '[ HACKING ATS SYSTEM ]',
    btnBypass: 'BYPASS ATS NOW',
    btnPromptToggle: 'Add role-specific prompt tweak',
    promptLabel: 'Role-Specific Prompt Tweak',
    promptPlaceholder: 'Ex: Prioritize Java/Spring, quantified outcomes, microservices and cloud...',
    coverLetterAction: 'Generate cover letter based on job description',
    coverLetterTitle: 'Cover Letter',
    coverLetterLoading: 'Generating tailored cover letter...',
    copyCoverLetter: 'Copy letter',
    copied: 'Copied',
    synthTitle: 'Synthesizing',
    synthDesc: 'Feeding Master File to Gemini Engine...',
    successTitle: 'BYPASS SUCCESSFUL',
    successDesc: 'A.I aligned your trajectory with the company\'s algorithm.',
    btnNew: 'NEW JOB',
    btnRecompile: 'RETRY',
    btnRecompilePrompt: 'RETRY WITH TWEAK',
    btnDownload: 'GENERATE PDF',
    hintNew: 'New (N)',
    hintRecompile: 'Retry (R)',
    hintRecompilePrompt: 'Retry with tweak (RT)',
    hintDownload: 'Download PDF (PDF)',
    hintCoverLetter: 'Generate cover letter',
    alertJD: '⚠️ Paste the Job Description (JD) to continue.',
    alertError: 'Request error: ',
    footerPortfolio: 'Portfolio',
    footerBy: 'By',
    langToggle: 'EN-US'
  }
};

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [language, setLanguage] = useState<'PT' | 'EN'>('PT');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<ResumeData | null>(null);
  
  const [customPdf, setCustomPdf] = useState<{ name: string, data: string } | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);
  const t = I18N[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'PT' ? 'EN' : 'PT');
  };

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Unknown Error';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = (event.target?.result as string).split(',')[1];
      setCustomPdf({ name: file.name, data: base64Str });
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!jobDescription) {
      alert(t.alertJD);
      return;
    }

    setIsGenerating(true);
    setShowPromptInput(false);
    setGeneratedResume(null); // Reset
    setCoverLetter('');
    try {
      const payload: {
        jobDescription: string;
        language: 'PT' | 'EN';
        customPdfData?: string;
        customPrompt?: string;
      } = { jobDescription, language };
      if (customPdf) {
         payload.customPdfData = customPdf.data;
      }
      if (customPrompt.trim()) {
        payload.customPrompt = customPrompt.trim();
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Unknown Error');
      }

      const data = await response.json();
      setGeneratedResume(data);
    } catch (error: unknown) {
      console.error(error);
      alert(t.alertError + getErrorMessage(error));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription || isGeneratingCoverLetter) {
      return;
    }

    setIsGeneratingCoverLetter(true);
    try {
      const payload: {
        jobDescription: string;
        language: 'PT' | 'EN';
        customPdfData?: string;
        customPrompt?: string;
      } = { jobDescription, language };

      if (customPdf) {
        payload.customPdfData = customPdf.data;
      }
      if (customPrompt.trim()) {
        payload.customPrompt = customPrompt.trim();
      }

      const response = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Unknown Error');
      }

      const data = await response.json();
      setCoverLetter(data.coverLetter || '');
    } catch (error: unknown) {
      console.error(error);
      alert(t.alertError + getErrorMessage(error));
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleCopyCoverLetter = async () => {
    if (!coverLetter.trim()) return;
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopiedCoverLetter(true);
      setTimeout(() => setCopiedCoverLetter(false), 1600);
    } catch (error) {
      console.error(error);
      alert(t.alertError + getErrorMessage(error));
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Jorge_Soares_ATS',
  });

  return (
    <>
      <div className="mesh-bg no-print" />

      {/* Floating Language Translator Toggle */}
      <button 
        className="no-print"
        onClick={toggleLanguage}
        style={{
          position: 'fixed',
          top: '30px',
          right: '30px',
          zIndex: 9999,
          background: 'rgba(26, 27, 38, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-main)',
          padding: '10px 20px',
          borderRadius: '50px',
          cursor: 'pointer',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-glow)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)' }}
      >
        <Globe size={18} color="var(--primary-glow)" /> {t.langToggle}
      </button>
      
      <div className="cy-container fade-in">
        <header className="cy-header no-print">
          <Ghost size={48} color="var(--primary-glow)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
          <h1 className="cy-title">ATS NIGHTMARE</h1>
          <p className="cy-subtitle">{t.subtitle}</p>
        </header>

        <main className={generatedResume ? 'grid-layout' : 'fade-in'} style={!generatedResume ? { maxWidth: '800px', margin: '0 auto' } : {}}>
          
          {/* INPUT PANEL */}
          <section className="cyber-card no-print" style={{ display: generatedResume ? 'none' : 'block' }}>
            <div className="input-group">
               <label className="input-label" style={{ justifyContent: 'center' }}>
                 <Crosshair size={18} /> {t.targetJob}
               </label>
               <textarea 
                 className="input-element" 
                 style={{ minHeight: '280px', fontSize: '1.05rem', textAlign: 'center' }}
                 placeholder={t.placeholderJD}
                 value={jobDescription}
                 onChange={e => setJobDescription(e.target.value)}
                 disabled={isGenerating}
               />
               <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                   {t.autoExtractDesc} 
                   <a href="/curriculo_base.pdf" target="_blank" style={{ color: 'var(--secondary-glow)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', borderBottom: '1px dashed var(--secondary-glow)' }}>
                     <Eye size={14} /> {t.linkGuide}
                   </a>
                 </span>
                 <label style={{ cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,255,204,0.1)', padding: '6px 12px', borderRadius: '50px', transition: 'all 0.3s', border: '1px solid rgba(0,255,204,0.3)' }}>
                   <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={handleFileUpload} />
                   <UploadCloud size={16} /> {customPdf ? `${t.btnCustomPdfActive} ${customPdf.name}` : t.btnCustomPdf}
                 </label>
               </p>
            </div>

            <button 
              className="magic-btn" 
              onClick={handleGenerate} 
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Wand2 className="spin" size={24} />
                  {t.btnHack}
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  {t.btnBypass}
                </>
              )}
            </button>
            <button
              className="action-btn prompt-toggle-btn"
              style={{ width: '100%', justifyContent: 'space-between', marginTop: '0.8rem' }}
              onClick={() => setShowPromptInput(prev => !prev)}
              disabled={isGenerating}
              aria-expanded={showPromptInput}
            >
              <span>{t.btnPromptToggle}</span>
              <ChevronDown size={16} className={`chevron ${showPromptInput ? 'open' : ''}`} />
            </button>
            <div className={`prompt-accordion ${showPromptInput ? 'open' : ''}`}>
              <div style={{ marginTop: '0.9rem' }}>
                <label className="input-label" style={{ marginBottom: '0.6rem' }}>
                  <Wand2 size={16} /> {t.promptLabel}
                </label>
                <textarea
                  className="input-element"
                  style={{ minHeight: '120px' }}
                  placeholder={t.promptPlaceholder}
                  value={customPrompt}
                  onChange={e => setCustomPrompt(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
            </div>
          </section>

          {/* GENERATING OVERLAY */}
          {isGenerating && !generatedResume && (
            <section className="cyber-card fade-in" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', marginTop: '2rem' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '2rem' }}>
                <div style={{ position: 'absolute', inset: 0, border: '2px solid var(--border-color)', borderRadius: '50%', borderTopColor: 'var(--primary-glow)', animation: 'spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite' }} />
                <div style={{ position: 'absolute', inset: '15px', border: '2px dashed var(--secondary-glow)', borderRadius: '50%', animation: 'spin 3s linear infinite reverse' }} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-glow)', letterSpacing: '4px', textTransform: 'uppercase' }}>{t.synthTitle}</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center' }}>{t.synthDesc}</p>
            </section>
          )}

          {/* RESULT PANEL */}
          {generatedResume && (
             <div className="fade-in" style={{ gridColumn: '1 / -1' }}>
                <div className="cyber-card no-print" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
                   <div>
                     <h2 style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-glow)', fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <TerminalSquare size={20}/> {t.successTitle}
                     </h2>
                     <p style={{ color: '#aaa', margin: '5px 0 0', fontSize: '0.9rem' }}>{t.successDesc}</p>
                   </div>
                   <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <Tippy content={t.hintNew} theme="material" animation="scale-extreme">
                        <button className="action-btn icon-action-btn" onClick={() => { setGeneratedResume(null); setJobDescription(''); setShowPromptInput(false); }} aria-label={t.hintNew}>
                          <PlusCircle size={17} />
                        </button>
                      </Tippy>
                      <Tippy content={t.hintRecompile} theme="material" animation="scale-extreme">
                        <button className="action-btn icon-action-btn" onClick={handleGenerate} aria-label={t.hintRecompile}>
                          <RefreshCw size={17} />
                        </button>
                      </Tippy>
                      <Tippy content={t.hintRecompilePrompt} theme="material" animation="scale-extreme">
                        <button className="action-btn icon-action-btn" onClick={handleGenerate} aria-label={t.hintRecompilePrompt}>
                          <RotateCcw size={17} />
                        </button>
                      </Tippy>
                      <Tippy content={t.hintDownload} theme="material" animation="scale-extreme">
                        <button className="action-btn download-btn icon-action-btn" onClick={handlePrint} aria-label={t.hintDownload}>
                          <DownloadCloud size={17} />
                        </button>
                      </Tippy>
                      <Tippy content={t.hintCoverLetter} theme="material" animation="scale-extreme">
                        <button
                          className="action-btn icon-action-btn"
                          onClick={handleGenerateCoverLetter}
                          aria-label={t.hintCoverLetter}
                          disabled={isGeneratingCoverLetter}
                        >
                          <FileText size={17} className={isGeneratingCoverLetter ? 'spin' : ''} />
                        </button>
                      </Tippy>
                   </div>
                </div>
                <button
                  className={`action-btn no-print cover-letter-btn ${isGeneratingCoverLetter ? 'generating' : ''}`}
                  onClick={handleGenerateCoverLetter}
                  disabled={isGeneratingCoverLetter}
                  style={{ marginBottom: '1.2rem', width: '100%', justifyContent: 'center' }}
                >
                  <FileText size={16} className={isGeneratingCoverLetter ? 'spin' : ''} /> {t.coverLetterAction}
                </button>
                <div className={`cyber-card no-print prompt-card ${showPromptInput ? 'open' : ''}`} style={{ marginBottom: '1.2rem' }}>
                  <button
                    className="action-btn prompt-toggle-btn"
                    style={{ width: '100%', justifyContent: 'space-between' }}
                    onClick={() => setShowPromptInput(prev => !prev)}
                    disabled={isGenerating}
                    aria-expanded={showPromptInput}
                  >
                    <span>{t.btnPromptToggle}</span>
                    <ChevronDown size={16} className={`chevron ${showPromptInput ? 'open' : ''}`} />
                  </button>
                  <div className={`prompt-accordion ${showPromptInput ? 'open' : ''}`}>
                    <div style={{ marginTop: '0.9rem' }}>
                      <label className="input-label" style={{ marginBottom: '0.6rem' }}>
                        <Wand2 size={16} /> {t.promptLabel}
                      </label>
                      <textarea
                        className="input-element"
                        style={{ minHeight: '120px' }}
                        placeholder={t.promptPlaceholder}
                        value={customPrompt}
                        onChange={e => setCustomPrompt(e.target.value)}
                        disabled={isGenerating}
                      />
                    </div>
                  </div>
                </div>
                {coverLetter && (
                  <div className="cyber-card no-print" style={{ marginBottom: '1.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <label className="input-label" style={{ marginBottom: 0 }}>
                        <FileText size={16} /> {t.coverLetterTitle}
                      </label>
                      <button
                        className="action-btn"
                        onClick={handleCopyCoverLetter}
                        style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
                        aria-label={t.copyCoverLetter}
                      >
                        {copiedCoverLetter ? <Check size={14} /> : <Copy size={14} />}
                        {copiedCoverLetter ? t.copied : t.copyCoverLetter}
                      </button>
                    </div>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'var(--text-main)' }}>{coverLetter}</p>
                  </div>
                )}
                {isGeneratingCoverLetter && (
                  <div className="cyber-card no-print" style={{ marginBottom: '1.2rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>{t.coverLetterLoading}</p>
                  </div>
                )}

                <div className="no-print" style={{ 
                  background: '#1a1b26', 
                  padding: '3rem', 
                  borderRadius: '24px', 
                  overflowX: 'auto',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                   <div style={{ 
                       transform: 'scale(1)', 
                       transformOrigin: 'top center',
                       boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                   }}>
                      <div ref={printRef}>
                        <ResumePreview data={generatedResume} language={language} />
                      </div>
                   </div>
                </div>
             </div>
          )}

        </main>
        
        <footer className="no-print" style={{ textAlign: 'center', padding: '3rem 0 1rem', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', marginTop: '4rem' }}>
          {t.footerBy} Jorge Soares © {new Date().getFullYear()} — ATS Nightmare. <br />
          <div style={{ marginTop: '0.8rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <a href="https://www.linkedin.com/in/jorgesoar/" target="_blank" style={{ color: 'var(--primary-glow)', textDecoration: 'none' }}>LinkedIn</a>
            <a href="https://portfolio-jorge-soares.vercel.app" target="_blank" style={{ color: 'var(--primary-glow)', textDecoration: 'none' }}>{t.footerPortfolio}</a>
          </div>
        </footer>
      </div>
    </>
  );
}
