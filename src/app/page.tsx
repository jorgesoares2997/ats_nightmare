'use client';

import React, { useState, useRef } from 'react';
import { Ghost, Wand2, TerminalSquare, Sparkles, DownloadCloud, PlusCircle, RefreshCw, Crosshair, Globe, UploadCloud, Eye } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
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
    btnHack: '[ HACKING ATS SYSTEM ]',
    btnBypass: 'BYPASS ATS NOW',
    synthTitle: 'Synthesizing',
    synthDesc: 'Feeding Master File to Gemini Engine...',
    successTitle: 'BYPASS SUCCESSFUL',
    successDesc: 'A.I aligned your trajectory com o algoritmo da empresa.',
    btnNew: 'NOVA VAGA',
    btnRecompile: 'REFAZER',
    btnDownload: 'GENERATE PDF',
    alertJD: '⚠️ Cole a Descrição da Vaga (JD) para continuar.',
    alertError: 'Erro na requisição: ',
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
    synthTitle: 'Synthesizing',
    synthDesc: 'Feeding Master File to Gemini Engine...',
    successTitle: 'BYPASS SUCCESSFUL',
    successDesc: 'A.I aligned your trajectory with the company\'s algorithm.',
    btnNew: 'NEW JOB',
    btnRecompile: 'REMAKE',
    btnDownload: 'GENERATE PDF',
    alertJD: '⚠️ Paste the Job Description (JD) to continue.',
    alertError: 'Request error: ',
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

  const printRef = useRef<HTMLDivElement>(null);
  const t = I18N[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'PT' ? 'EN' : 'PT');
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
    setGeneratedResume(null); // Reset
    try {
      const payload: any = { jobDescription, language };
      if (customPdf) {
         payload.customPdfData = customPdf.data;
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
    } catch (error: any) {
      console.error(error);
      alert(t.alertError + error.message);
    } finally {
      setIsGenerating(false);
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
                      <button className="action-btn" onClick={() => { setGeneratedResume(null); setJobDescription(''); }}>
                        <PlusCircle size={16} /> {t.btnNew}
                      </button>
                      <button className="action-btn" onClick={handleGenerate}>
                        <RefreshCw size={16} /> {t.btnRecompile}
                      </button>
                      <button className="action-btn download-btn" onClick={handlePrint} style={{ padding: '0.8rem 2rem' }}>
                        <DownloadCloud size={18} /> {t.btnDownload}
                      </button>
                   </div>
                </div>

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
                        <ResumePreview data={generatedResume} />
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
            <a href="https://portfolio-jorge-soares.vercel.app" target="_blank" style={{ color: 'var(--primary-glow)', textDecoration: 'none' }}>Portfólio</a>
          </div>
        </footer>
      </div>
    </>
  );
}
