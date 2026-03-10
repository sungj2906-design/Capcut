import React, { useState } from 'react';
import { BookOpen, ShieldAlert } from 'lucide-react';
import { ThemeConfig } from '../data/initialPages';

interface Props {
  theme: ThemeConfig;
  onLoginSuccess: () => void;
  onAdminClick: () => void;
}

export default function UserLogin({ theme, onLoginSuccess, onAdminClick }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validCodes = theme.ebookAccessCodes || ['FREE-EBOOK-2026'];
    if (validCodes.includes(code.trim())) {
      onLoginSuccess();
    } else {
      setError('Invalid access code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative transition-colors duration-300" style={{ backgroundColor: theme.backgroundColor }}>
      {/* Admin Login Button */}
      <button 
        onClick={onAdminClick} 
        className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors z-10"
        style={{ color: theme.textColor }}
      >
        <ShieldAlert className="w-4 h-4" />
        <span className="text-sm font-mono uppercase tracking-wider">Admin Login</span>
      </button>

      {/* Watermark */}
      <div className="pointer-events-none fixed inset-0 flex items-end justify-end p-8 opacity-15 z-0">
        <span className="text-6xl md:text-8xl font-black tracking-tighter transform -rotate-12 select-none" style={{ color: theme.accentColor }}>
          {theme.watermarkText}
        </span>
      </div>

      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-2xl relative z-10 backdrop-blur-sm" style={{ backgroundColor: `${theme.cardColor}EE` }}>
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 rounded-full border flex items-center justify-center mb-6 shadow-lg" style={{ borderColor: theme.accentColor, backgroundColor: theme.backgroundColor }}>
            <BookOpen className="w-8 h-8" style={{ color: theme.accentColor }} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2" style={{ color: theme.textColor }}>
            {theme.loginPageTitle || "Welcome to The Neon Archive"}
          </h2>
          <p className="text-sm opacity-80" style={{ color: theme.textColor }}>
            {theme.loginPageDescription || "Enter your access code to read the ebook."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-2 opacity-70" style={{ color: theme.textColor }}>Access Code</label>
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-white/10 rounded-lg px-4 py-3 focus:outline-none font-mono transition-colors"
              style={{ backgroundColor: theme.backgroundColor, color: theme.textColor, borderColor: 'rgba(255,255,255,0.1)' }}
              placeholder="Enter your free ebook code..."
            />
          </div>

          {error && <p className="text-red-400 text-sm font-mono text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full font-bold uppercase tracking-widest py-4 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: theme.accentColor, color: theme.backgroundColor }}
          >
            Unlock Ebook
          </button>
        </form>
      </div>
    </div>
  );
}