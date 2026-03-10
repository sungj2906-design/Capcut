import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface Props {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export default function AdminLogin({ onLoginSuccess, onCancel }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === 'sungj222@#&-neonsenpai') {
      onLoginSuccess();
    } else {
      setError('Invalid credentials. Access denied.');
    }
  };

  return (
    <div className="min-h-screen bg-pitch flex items-center justify-center p-4 relative">
      <button onClick={onCancel} className="absolute top-8 right-8 text-gray-500 hover:text-white">
        <X className="w-8 h-8" />
      </button>

      <div className="w-full max-w-md bg-charcoal p-8 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(204,255,0,0.05)]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-pitch border border-cyber-lime flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(204,255,0,0.2)]">
            <Lock className="w-8 h-8 text-cyber-lime" />
          </div>
          <h2 className="text-2xl font-black tracking-widest uppercase text-white">Admin Access</h2>
          <p className="text-gray-400 text-sm mt-2 font-mono">Restricted Area</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Admin Code</label>
            <input 
              type="password" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-pitch border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-lime font-mono transition-colors"
              placeholder="Enter admin code"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-mono text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-cyber-lime text-pitch font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-white transition-colors"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
