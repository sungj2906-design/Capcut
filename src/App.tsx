/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { generateInitialPages, PageData, ThemeConfig, defaultTheme } from './data/initialPages';
import EbookReader from './components/EbookReader';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [view, setView] = useState<'reader' | 'login' | 'admin'>('reader');
  
  useEffect(() => {
    const saved = localStorage.getItem('ebook_pages');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check for old schema and clear if necessary
      if (parsed.length > 0 && ('imageCaption' in parsed[0] || 'imageUrl' in parsed[0])) {
        const migrated = parsed.map((p: any) => {
          const newP = { ...p };
          if (newP.imageUrl) {
            newP.imageUrls = [newP.imageUrl];
          } else if (!newP.imageUrls) {
            newP.imageUrls = [];
          }
          delete newP.imageUrl;
          delete newP.imageCaption;
          return newP;
        });
        setPages(migrated);
        localStorage.setItem('ebook_pages', JSON.stringify(migrated));
      } else {
        setPages(parsed);
      }
    } else {
      setPages(generateInitialPages());
    }

    const savedTheme = localStorage.getItem('ebook_theme');
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }
  }, []);

  const savePages = (newPages: PageData[], newTheme: ThemeConfig) => {
    setPages(newPages);
    setTheme(newTheme);
    localStorage.setItem('ebook_pages', JSON.stringify(newPages));
    localStorage.setItem('ebook_theme', JSON.stringify(newTheme));
  };

  if (pages.length === 0) return <div className="min-h-screen bg-pitch text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-pitch text-white font-sans selection:bg-neon-blue selection:text-pitch">
      {view === 'reader' && <EbookReader pages={pages} theme={theme} onAdminClick={() => setView('login')} />}
      {view === 'login' && <AdminLogin onLoginSuccess={() => setView('admin')} onCancel={() => setView('reader')} />}
      {view === 'admin' && <AdminPanel pages={pages} theme={theme} onSave={savePages} onExit={() => setView('reader')} />}
    </div>
  );
}
