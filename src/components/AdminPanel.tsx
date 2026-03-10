import React, { useState } from 'react';
import { PageData, ThemeConfig } from '../data/initialPages';
import { Save, LogOut, Search, Upload, X, Layout, FileText } from 'lucide-react';

interface Props {
  pages: PageData[];
  theme: ThemeConfig;
  onSave: (pages: PageData[], theme: ThemeConfig) => void;
  onExit: () => void;
}

export default function AdminPanel({ pages, theme, onSave, onExit }: Props) {
  const [localPages, setLocalPages] = useState<PageData[]>(pages);
  const [localTheme, setLocalTheme] = useState<ThemeConfig>(theme);
  const [selectedPageNum, setSelectedPageNum] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'pages'>('pages');

  const selectedPage = localPages.find(p => p.pageNumber === selectedPageNum) || localPages[0];

  const handleUpdatePage = (field: keyof PageData, value: string | string[]) => {
    setLocalPages(prev => prev.map(p => 
      p.pageNumber === selectedPageNum ? { ...p, [field]: value } : p
    ));
  };

  const handleUpdateTheme = (field: keyof ThemeConfig, value: string) => {
    setLocalTheme(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newUrls: string[] = [];
    let processed = 0;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newUrls.push(event.target.result as string);
        }
        processed++;
        if (processed === files.length) {
          const currentUrls = selectedPage.imageUrls || [];
          handleUpdatePage('imageUrls', [...currentUrls, ...newUrls]);
        }
      };
      reader.readAsDataURL(file as Blob);
    });
  };

  const handleSaveAll = () => {
    onSave(localPages, localTheme);
    alert('All changes saved successfully.');
  };

  const filteredPages = localPages.filter(p => 
    p.pageNumber.toString().includes(searchQuery) || 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-pitch flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-charcoal border-r border-white/5 flex flex-col h-screen">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-black text-cyber-lime uppercase tracking-widest mb-4">Admin Panel</h2>
          
          <div className="flex gap-2 mb-4 bg-pitch p-1 rounded-lg border border-white/10">
            <button 
              onClick={() => setActiveTab('home')} 
              className={`flex-1 py-2 rounded-md text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'home' ? 'bg-charcoal text-neon-blue shadow' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Layout className="w-4 h-4" /> Home
            </button>
            <button 
              onClick={() => setActiveTab('pages')} 
              className={`flex-1 py-2 rounded-md text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'pages' ? 'bg-charcoal text-neon-blue shadow' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <FileText className="w-4 h-4" /> Pages
            </button>
          </div>

          {activeTab === 'pages' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-pitch border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neon-blue font-mono"
              />
            </div>
          )}
        </div>
        
        {activeTab === 'pages' ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
            {filteredPages.map(p => (
              <button
                key={p.pageNumber}
                onClick={() => setSelectedPageNum(p.pageNumber)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  selectedPageNum === p.pageNumber 
                    ? 'bg-neon-blue/10 border border-neon-blue/30 text-neon-blue' 
                    : 'hover:bg-white/5 text-gray-400 border border-transparent'
                }`}
              >
                <span className="font-mono text-xs opacity-50 w-8">{p.pageNumber}</span>
                <span className="truncate text-sm font-medium">{p.title}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <p className="text-sm text-gray-400 font-mono">Configure global theme and layout settings from the main panel.</p>
          </div>
        )}

        <div className="p-4 border-t border-white/5 space-y-3">
          <button 
            onClick={handleSaveAll}
            className="w-full flex items-center justify-center gap-2 bg-neon-blue text-pitch font-bold uppercase tracking-wider py-3 rounded-lg hover:bg-white transition-colors"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
          <button 
            onClick={onExit}
            className="w-full flex items-center justify-center gap-2 bg-transparent border border-white/10 text-gray-400 font-bold uppercase tracking-wider py-3 rounded-lg hover:text-white hover:border-white/30 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Exit Editor
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto h-screen custom-scrollbar">
        {activeTab === 'pages' ? (
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-charcoal border border-white/10 flex items-center justify-center font-mono text-xl text-neon-blue font-bold">
                  {selectedPage.pageNumber}
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight">Edit Page</h1>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Page Title</label>
                  <input 
                    type="text" 
                    value={selectedPage.title}
                    onChange={(e) => handleUpdatePage('title', e.target.value)}
                    className="w-full bg-charcoal border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue font-sans text-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Content (Markdown/Text)</label>
                  <textarea 
                    value={selectedPage.content}
                    onChange={(e) => handleUpdatePage('content', e.target.value)}
                    rows={12}
                    className="w-full bg-charcoal border border-white/10 rounded-lg px-4 py-4 text-gray-300 focus:outline-none focus:border-neon-blue font-sans leading-relaxed resize-y custom-scrollbar"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Images</label>
                  
                  <div className="space-y-3 mb-4">
                    {(selectedPage.imageUrls || []).map((url, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={url.startsWith('data:image') ? '[Local Image Uploaded]' : url}
                          onChange={(e) => {
                            if (url.startsWith('data:image')) return; // Don't allow editing base64 text directly
                            const newUrls = [...(selectedPage.imageUrls || [])];
                            newUrls[idx] = e.target.value;
                            handleUpdatePage('imageUrls', newUrls);
                          }}
                          readOnly={url.startsWith('data:image')}
                          className={`flex-1 bg-charcoal border border-white/10 rounded-lg px-3 py-2 text-cyber-lime focus:outline-none focus:border-cyber-lime font-mono text-sm ${url.startsWith('data:image') ? 'opacity-50' : ''}`}
                          placeholder="Enter image URL..."
                        />
                        <button 
                          onClick={() => {
                            const newUrls = [...(selectedPage.imageUrls || [])];
                            newUrls.splice(idx, 1);
                            handleUpdatePage('imageUrls', newUrls);
                          }}
                          className="p-2 text-gray-500 hover:text-red-400 bg-white/5 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        handleUpdatePage('imageUrls', [...(selectedPage.imageUrls || []), '']);
                      }}
                      className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors"
                    >
                      <span>+ Add URL</span>
                    </button>
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Upload Images</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            <div className="w-full lg:w-96 shrink-0 flex flex-col">
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Image Preview ({(selectedPage.imageUrls || []).filter(u => u.trim() !== '').length})</label>
              <div className="w-full h-[600px] bg-pitch border border-white/10 rounded-xl overflow-x-auto overflow-y-hidden flex snap-x snap-mandatory custom-scrollbar">
                {selectedPage.imageUrls && selectedPage.imageUrls.filter(u => u.trim() !== '').length > 0 ? (
                  selectedPage.imageUrls.filter(u => u.trim() !== '').map((url, idx, arr) => (
                    <div key={idx} className="w-full h-full shrink-0 snap-center flex items-center justify-center p-4 relative">
                      <div className="absolute top-2 left-2 bg-charcoal/80 text-white text-xs px-2 py-1 rounded backdrop-blur z-10">
                        {idx + 1} / {arr.length}
                      </div>
                      <img 
                        src={url.trim()} 
                        alt={`Preview ${idx + 1}`} 
                        className="max-w-full max-h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full shrink-0 flex items-center justify-center text-gray-600 font-mono text-sm">
                    <span className="opacity-50">No Images</span>
                  </div>
                )}
              </div>
              {selectedPage.imageUrls && selectedPage.imageUrls.filter(u => u.trim() !== '').length > 1 && (
                <div className="text-center text-xs text-gray-500 mt-2 font-mono">
                  Scroll horizontally to see more images
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-charcoal border border-white/10 flex items-center justify-center font-mono text-xl text-neon-blue font-bold">
                <Layout className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Home & Theme Settings</h1>
            </div>

            <div className="space-y-6 bg-charcoal p-8 rounded-2xl border border-white/5">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Book Title</label>
                <input 
                  type="text" 
                  value={localTheme.title}
                  onChange={(e) => handleUpdateTheme('title', e.target.value)}
                  className="w-full bg-pitch border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue font-sans text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Watermark Text</label>
                <input 
                  type="text" 
                  value={localTheme.watermarkText}
                  onChange={(e) => handleUpdateTheme('watermarkText', e.target.value)}
                  className="w-full bg-pitch border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue font-sans text-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Background Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={localTheme.backgroundColor}
                      onChange={(e) => handleUpdateTheme('backgroundColor', e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <input 
                      type="text" 
                      value={localTheme.backgroundColor}
                      onChange={(e) => handleUpdateTheme('backgroundColor', e.target.value)}
                      className="flex-1 bg-pitch border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Card/Panel Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={localTheme.cardColor}
                      onChange={(e) => handleUpdateTheme('cardColor', e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <input 
                      type="text" 
                      value={localTheme.cardColor}
                      onChange={(e) => handleUpdateTheme('cardColor', e.target.value)}
                      className="flex-1 bg-pitch border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Text Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={localTheme.textColor}
                      onChange={(e) => handleUpdateTheme('textColor', e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <input 
                      type="text" 
                      value={localTheme.textColor}
                      onChange={(e) => handleUpdateTheme('textColor', e.target.value)}
                      className="flex-1 bg-pitch border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={localTheme.accentColor}
                      onChange={(e) => handleUpdateTheme('accentColor', e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <input 
                      type="text" 
                      value={localTheme.accentColor}
                      onChange={(e) => handleUpdateTheme('accentColor', e.target.value)}
                      className="flex-1 bg-pitch border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Page Layout</label>
                <select 
                  value={localTheme.layout}
                  onChange={(e) => handleUpdateTheme('layout', e.target.value as 'horizontal' | 'vertical')}
                  className="w-full bg-pitch border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue font-sans"
                >
                  <option value="horizontal">Horizontal (Side-by-Side)</option>
                  <option value="vertical">Vertical (Stacked)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
