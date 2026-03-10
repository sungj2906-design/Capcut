import React from 'react';
import { ThemeConfig } from '../data/initialPages';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  theme: ThemeConfig;
  onContinue: () => void;
}

export default function StarterPage({ theme, onContinue }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative transition-colors duration-300" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      {/* Watermark */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="pointer-events-none fixed inset-0 flex items-end justify-end p-8 z-0"
      >
        <span className="text-6xl md:text-8xl font-black tracking-tighter transform -rotate-12 select-none" style={{ color: theme.accentColor }}>
          {theme.watermarkText}
        </span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-5xl rounded-2xl shadow-2xl border border-white/5 flex flex-col md:flex-row overflow-hidden z-10" 
        style={{ backgroundColor: theme.cardColor }}
      >
        {/* Top Left Image Area (on mobile it's top, on desktop it's left) */}
        {theme.starterPageImageUrl && (
          <div className="w-full md:w-1/2 h-64 md:h-auto shrink-0 relative overflow-hidden">
            <motion.img 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src={theme.starterPageImageUrl} 
              alt="Starter" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        
        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3
                }
              }
            }}
            className="prose prose-lg max-w-none mb-12" 
            style={{ color: theme.textColor }}
          >
            {(theme.starterPageContent || '').split('\n').map((paragraph, idx) => {
              const itemVariants = {
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              };

              if (paragraph.startsWith('# ')) {
                return <motion.h1 variants={itemVariants} key={idx} className="text-3xl md:text-4xl font-black tracking-tight mb-6" style={{ color: theme.textColor }}>{paragraph.replace('# ', '')}</motion.h1>;
              }
              if (paragraph.startsWith('## ')) {
                return <motion.h2 variants={itemVariants} key={idx} className="text-2xl md:text-3xl font-bold tracking-tight mb-4 mt-8" style={{ color: theme.textColor }}>{paragraph.replace('## ', '')}</motion.h2>;
              }
              if (paragraph.trim() === '') {
                return <br key={idx} />;
              }
              return (
                <motion.p variants={itemVariants} key={idx} className="leading-relaxed mb-4 font-sans opacity-90">
                  {paragraph}
                </motion.p>
              );
            })}
          </motion.div>

          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            className="self-start flex items-center gap-3 px-8 py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg"
            style={{ backgroundColor: theme.accentColor, color: theme.backgroundColor }}
          >
            <span>Start Reading</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
