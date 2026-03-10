/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { generateInitialPages, PageData, ThemeConfig, defaultTheme } from './data/initialPages';
import EbookReader from './components/EbookReader';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import UserLogin from './components/UserLogin';
import StarterPage from './components/StarterPage';
import { io } from 'socket.io-client';

export default function App() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [view, setView] = useState<'user_login' | 'starter_page' | 'reader' | 'admin_login' | 'admin'>('user_login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data');
        if (response.ok) {
          const data = await response.json();
          let loadedPages = data.pages;
          let loadedTheme = data.theme;

          if (loadedPages) {
            // Check for old schema and clear if necessary
            if (loadedPages.length > 0 && ('imageCaption' in loadedPages[0] || 'imageUrl' in loadedPages[0])) {
              loadedPages = loadedPages.map((p: any) => {
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
              // Save migrated back to server
              fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pages: loadedPages })
              });
            }
            setPages(loadedPages);
          } else {
            setPages(generateInitialPages());
          }

          let currentTheme = defaultTheme;
          if (loadedTheme) {
            currentTheme = { ...defaultTheme, ...loadedTheme };
            setTheme(currentTheme);
          }

          const accessGranted = localStorage.getItem('ebook_access_granted');
          if (accessGranted === 'true') {
            setIsAuthenticated(true);
            if (currentTheme.starterPageEnabled) {
              setView('starter_page');
            } else {
              setView('reader');
            }
          }
        } else {
          setPages(generateInitialPages());
        }
      } catch (error) {
        console.error("Failed to load data from server:", error);
        setPages(generateInitialPages());
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Setup Socket.IO for real-time updates
    const socket = io();
    
    socket.on('data_updated', (data: { pages?: PageData[], theme?: ThemeConfig }) => {
      if (data.pages) {
        setPages(data.pages);
      }
      if (data.theme) {
        setTheme(prevTheme => ({ ...prevTheme, ...data.theme }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const savePages = async (newPages: PageData[], newTheme: ThemeConfig) => {
    setPages(newPages);
    setTheme(newTheme);
    
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages: newPages, theme: newTheme })
      });
    } catch (error) {
      console.error("Failed to save data to server:", error);
      alert("Failed to save changes to the server. Please try again.");
    }
  };

  const handleUserLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('ebook_access_granted', 'true');
    if (theme.starterPageEnabled) {
      setView('starter_page');
    } else {
      setView('reader');
    }
  };

  if (isLoading || pages.length === 0) return <div className="min-h-screen bg-pitch text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-pitch text-white font-sans selection:bg-neon-blue selection:text-pitch">
      {view === 'user_login' && (
        <UserLogin 
          theme={theme} 
          onLoginSuccess={handleUserLoginSuccess} 
          onAdminClick={() => setView('admin_login')} 
        />
      )}
      {view === 'starter_page' && (
        <StarterPage 
          theme={theme} 
          onContinue={() => setView('reader')} 
        />
      )}
      {view === 'reader' && (
        <EbookReader 
          pages={pages} 
          theme={theme} 
          onAdminClick={() => setView('admin_login')} 
        />
      )}
      {view === 'admin_login' && (
        <AdminLogin 
          onLoginSuccess={() => setView('admin')} 
          onCancel={() => setView(isAuthenticated ? (theme.starterPageEnabled ? 'starter_page' : 'reader') : 'user_login')} 
        />
      )}
      {view === 'admin' && (
        <AdminPanel 
          pages={pages} 
          theme={theme} 
          onSave={savePages} 
          onExit={() => setView(isAuthenticated ? (theme.starterPageEnabled ? 'starter_page' : 'reader') : 'user_login')} 
        />
      )}
    </div>
  );
}
