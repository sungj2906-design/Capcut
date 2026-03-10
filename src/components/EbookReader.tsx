import React, { useState, useEffect } from 'react';
import { PageData, ThemeConfig } from '../data/initialPages';
import { ChevronLeft, ChevronRight, Settings, BookOpen, Search, Menu, X, Bookmark, BookmarkCheck, ZoomIn, ZoomOut } from 'lucide-react';

interface Props {
  pages: PageData[];
  theme: ThemeConfig;
  onAdminClick: () => void;
}

export default function EbookReader({ pages, theme, onAdminClick }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpTo, setJumpTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('ebook_bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  const page = pages[currentPage - 1];

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setZoomLevel(1);
    }
  };

  const handleNext = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
      setZoomLevel(1);
    }
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpTo);
    if (!isNaN(num) && num >= 1 && num <= pages.length) {
      setCurrentPage(num);
      setJumpTo('');
      setZoomLevel(1);
    }
  };

  const handleSearchSelect = (pageNum: number) => {
    setCurrentPage(pageNum);
    setShowSearch(false);
    setSearchQuery('');
    setZoomLevel(1);
  };

  const toggleBookmark = () => {
    let newBookmarks;
    if (bookmarks.includes(currentPage)) {
      newBookmarks = bookmarks.filter(b => b !== currentPage);
    } else {
      newBookmarks = [...bookmarks, currentPage].sort((a, b) => a - b);
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('ebook_bookmarks', JSON.stringify(newBookmarks));
  };

  const searchResults = searchQuery.trim() === '' ? [] : pages.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, pages.length]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 overflow-x-hidden overflow-y-auto transition-colors duration-300" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      {/* Watermark */}
      <div className="pointer-events-none fixed inset-0 flex items-end justify-end p-8 opacity-15 z-0">
        <span className="text-6xl md:text-8xl font-black tracking-tighter transform -rotate-12 select-none" style={{ color: theme.accentColor }}>
          {theme.watermarkText}
        </span>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-3 md:p-4 flex justify-between items-center z-30 border-b border-white/10 backdrop-blur-md transition-colors duration-300" style={{ backgroundColor: `${theme.cardColor}CC` }}>
        <div className="flex items-center gap-2 shrink-0" style={{ color: theme.accentColor }}>
          <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
          <h1 className="font-bold tracking-widest uppercase text-xs md:text-base hidden sm:block truncate max-w-[150px] lg:max-w-none">{theme.title}</h1>
        </div>
        
        <div className="flex-1 max-w-md mx-2 md:mx-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" style={{ color: theme.textColor }} />
            <input 
              type="text" 
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearch(true);
              }}
              onFocus={() => setShowSearch(true)}
              className="w-full border border-white/10 rounded-full pl-9 pr-4 py-1.5 md:py-2 text-xs md:text-sm focus:outline-none font-mono transition-colors duration-300"
              style={{ backgroundColor: theme.cardColor, color: theme.textColor, borderColor: 'rgba(255,255,255,0.1)' }}
            />
          </div>
          {showSearch && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 border border-white/10 rounded-xl shadow-2xl max-h-64 overflow-y-auto custom-scrollbar z-50 transition-colors duration-300" style={{ backgroundColor: theme.cardColor }}>
              {searchResults.map(res => (
                <button 
                  key={res.pageNumber}
                  onClick={() => handleSearchSelect(res.pageNumber)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 flex items-center gap-3 transition-colors"
                >
                  <span className="font-mono text-xs w-8" style={{ color: theme.accentColor }}>{res.pageNumber}</span>
                  <span className="text-sm truncate" style={{ color: theme.textColor }}>{res.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="opacity-70 hover:opacity-100 transition-opacity p-2" style={{ color: theme.textColor }}>
            {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          {showMenu && (
            <div className="absolute top-full right-0 mt-2 w-64 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 transition-colors duration-300" style={{ backgroundColor: theme.cardColor }}>
              <div className="p-4 border-b border-white/5">
                <button 
                  onClick={() => {
                    setShowMenu(false);
                    onAdminClick();
                  }}
                  className="w-full flex items-center gap-3 text-left transition-colors py-2 opacity-80 hover:opacity-100"
                  style={{ color: theme.textColor }}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-mono text-sm uppercase tracking-wider">Admin Panel</span>
                </button>
              </div>
              <div className="p-4 max-h-64 overflow-y-auto custom-scrollbar">
                <h3 className="text-xs font-mono uppercase tracking-widest mb-3 opacity-50" style={{ color: theme.textColor }}>Bookmarks</h3>
                {bookmarks.length === 0 ? (
                  <p className="text-sm italic opacity-60" style={{ color: theme.textColor }}>No bookmarks yet.</p>
                ) : (
                  <div className="space-y-2">
                    {bookmarks.map(b => (
                      <button 
                        key={b}
                        onClick={() => {
                          setCurrentPage(b);
                          setShowMenu(false);
                          setZoomLevel(1);
                        }}
                        className="w-full text-left flex items-center gap-3 text-sm transition-colors py-1 opacity-80 hover:opacity-100"
                        style={{ color: theme.textColor }}
                      >
                        <BookmarkCheck className="w-4 h-4" style={{ color: theme.accentColor }} />
                        <span>Page {b}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Book Page Container */}
      <div className="relative z-10 w-full max-w-7xl h-[85vh] md:h-[80vh] rounded-xl md:rounded-2xl shadow-2xl border border-white/5 flex flex-col overflow-hidden mt-14 md:mt-16 transition-colors duration-300" style={{ backgroundColor: theme.cardColor }}>
        
        {/* Page Content */}
        <div className={`flex-1 flex ${theme.layout === 'vertical' ? 'flex-col overflow-y-auto custom-scrollbar' : 'flex-col md:flex-row overflow-y-auto md:overflow-hidden'}`}>
          
          {/* Left Page: Text */}
          <div className={`shrink-0 p-6 md:p-12 ${theme.layout === 'vertical' ? 'w-full h-auto' : 'w-full md:w-1/2 h-auto md:h-full md:overflow-y-auto custom-scrollbar'}`}>
            <div className="max-w-2xl mx-auto relative">
              <div className="flex justify-between items-start mb-6 md:mb-8">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight" style={{ color: theme.textColor }}>
                  {page.title}
                </h2>
                <button 
                  onClick={toggleBookmark}
                  className={`p-2 rounded-full transition-colors shrink-0 ml-4 ${bookmarks.includes(currentPage) ? 'bg-white/10' : 'hover:bg-white/5 opacity-50 hover:opacity-100'}`}
                  style={{ color: bookmarks.includes(currentPage) ? theme.accentColor : theme.textColor }}
                  title={bookmarks.includes(currentPage) ? "Remove Bookmark" : "Add Bookmark"}
                >
                  {bookmarks.includes(currentPage) ? <BookmarkCheck className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
                </button>
              </div>
              
              <div className="prose prose-base md:prose-lg max-w-none" style={{ color: theme.textColor }}>
                {page.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed mb-4 font-sans opacity-90">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Right Page: Images */}
          {page.imageUrls && page.imageUrls.filter(u => u.trim() !== '').length > 0 && (
            <div className={`shrink-0 p-4 md:p-8 lg:p-12 overflow-hidden bg-black/20 flex flex-col items-center justify-center relative ${theme.layout === 'vertical' ? 'w-full h-[50vh] md:h-[60vh] border-t border-white/5' : 'w-full md:w-1/2 h-[50vh] md:h-full border-t md:border-t-0 md:border-l border-white/5'}`}>
              <div className="relative w-full h-full flex flex-col">
                <div className="absolute top-0 right-0 flex gap-2 z-20 p-1 md:p-2 rounded-lg backdrop-blur-sm border border-white/10" style={{ backgroundColor: `${theme.cardColor}CC` }}>
                  <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 3))} className="opacity-70 hover:opacity-100 p-1" style={{ color: theme.textColor }}>
                    <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 0.5))} className="opacity-70 hover:opacity-100 p-1" style={{ color: theme.textColor }}>
                    <ZoomOut className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
                <div className="flex-1 w-full overflow-x-auto overflow-y-hidden flex snap-x snap-mandatory custom-scrollbar">
                  {page.imageUrls.filter(u => u.trim() !== '').map((url, idx, arr) => (
                    <div key={idx} className="w-full h-full shrink-0 snap-center flex items-center justify-center relative overflow-auto custom-scrollbar">
                      {arr.length > 1 && (
                        <div className="absolute top-2 left-2 md:top-4 md:left-4 text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full backdrop-blur z-10 font-mono border border-white/10" style={{ backgroundColor: `${theme.cardColor}CC`, color: theme.textColor }}>
                          {idx + 1} / {arr.length}
                        </div>
                      )}
                      <img 
                        src={url.trim()} 
                        alt={`${page.title} - Image ${idx + 1}`} 
                        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
                        className="max-w-full h-auto rounded-xl shadow-2xl border border-white/10 object-contain max-h-full transition-transform duration-200" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                  ))}
                </div>
                {page.imageUrls.filter(u => u.trim() !== '').length > 1 && (
                  <div className="text-center text-[10px] md:text-xs mt-2 md:mt-4 font-mono shrink-0 opacity-50" style={{ color: theme.textColor }}>
                    Scroll horizontally to see more images
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Page Footer / Controls */}
        <div className="h-16 md:h-20 border-t border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0 bg-black/10">
          <button 
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="flex items-center gap-1 md:gap-2 disabled:opacity-30 transition-opacity opacity-70 hover:opacity-100 p-2"
            style={{ color: theme.textColor }}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            <span className="hidden sm:inline font-mono text-xs md:text-sm uppercase tracking-wider">Prev</span>
          </button>

          <div className="flex items-center gap-2 md:gap-4">
            <span className="font-mono text-sm md:text-base" style={{ color: theme.accentColor }}>
              {currentPage} <span className="opacity-50" style={{ color: theme.textColor }}>/ {pages.length}</span>
            </span>
            <form onSubmit={handleJump} className="flex items-center gap-2">
              <input 
                type="text" 
                value={jumpTo}
                onChange={(e) => setJumpTo(e.target.value)}
                placeholder="Jump"
                className="w-16 md:w-20 border border-white/10 rounded px-2 py-1 text-xs md:text-sm font-mono text-center focus:outline-none transition-colors duration-300"
                style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
              />
            </form>
          </div>

          <button 
            onClick={handleNext}
            disabled={currentPage === pages.length}
            className="flex items-center gap-1 md:gap-2 disabled:opacity-30 transition-opacity opacity-70 hover:opacity-100 p-2"
            style={{ color: theme.textColor }}
          >
            <span className="hidden sm:inline font-mono text-xs md:text-sm uppercase tracking-wider">Next</span>
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Bottom Embed */}
      {theme.embedEnabled && (
        <div className="w-full max-w-7xl mt-8 rounded-2xl shadow-2xl border border-white/5 p-8 transition-colors duration-300 flex flex-col md:flex-row gap-8 items-center z-10" style={{ backgroundColor: theme.cardColor }}>
          {theme.embedImageUrl && (
            <div className="w-full md:w-1/3 shrink-0">
              <img 
                src={theme.embedImageUrl} 
                alt="Embed" 
                className="w-full h-auto rounded-xl shadow-lg border border-white/10 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div className="flex-1 prose prose-lg max-w-none" style={{ color: theme.textColor }}>
            {(theme.embedContent || '').split('\n').map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed mb-4 font-sans opacity-90">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
