import React from 'react';

export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    contact: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    period: string;
    highlights: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    period: string;
  }[];
}

interface ResumePreviewProps {
  data: ResumeData;
}

export const ResumePreview = React.forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data }, ref) => {
    return (
      <div 
        ref={ref} 
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '20mm',
          margin: '0 auto',
          background: 'white',
          color: 'black',
          boxSizing: 'border-box',
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          lineHeight: '1.4',
        }}
      >
        <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', textTransform: 'uppercase', marginBottom: '5px', color: '#111' }}>
            {data.personalInfo.name}
          </h1>
          <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#444', marginBottom: '10px' }}>
            {data.personalInfo.title}
          </h2>
          <div style={{ fontSize: '12px', color: '#555', display: 'flex', gap: '15px' }}>
            <span>jorgesoares2997@gmail.com | (81) 98759-4291</span>
            {data.personalInfo.linkedin && (
              <a href={data.personalInfo.linkedin} style={{ color: '#0066cc', textDecoration: 'none' }} target="_blank">LinkedIn</a>
            )}
            {data.personalInfo.github && (
              <a href={data.personalInfo.github} style={{ color: '#0066cc', textDecoration: 'none' }} target="_blank">GitHub</a>
            )}
          </div>
        </header>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '10px', color: '#222' }}>
            Resumo Profissional
          </h3>
          <p style={{ fontSize: '12px', color: '#333' }} dangerouslySetInnerHTML={{ __html: data.summary }} />
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '10px', color: '#222' }}>
            Habilidades
          </h3>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: 0, margin: 0, listStyle: 'none' }}>
            {data.skills.map((skill, i) => (
              <li key={i} style={{ fontSize: '12px', background: '#f0f0f0', padding: '3px 8px', borderRadius: '4px', color: '#333' }} dangerouslySetInnerHTML={{ __html: skill }} />
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '10px', color: '#222' }}>
            Experiência Profissional
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#111' }}>{exp.role} — <span style={{ fontWeight: 'normal', color: '#444' }}>{exp.company}</span></h4>
                  <span style={{ fontSize: '12px', color: '#555' }}>{exp.period}</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#333' }}>
                  {exp.highlights.map((item, j) => (
                    <li key={j} style={{ marginBottom: '3px' }} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '10px', color: '#222' }}>
            Formação Acadêmica
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.education.map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '13px', color: '#111' }}>{edu.degree}</h4>
                  <div style={{ fontSize: '12px', color: '#444' }}>{edu.institution}</div>
                </div>
                <span style={{ fontSize: '12px', color: '#555' }}>{edu.period}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }
);
ResumePreview.displayName = 'ResumePreview';
