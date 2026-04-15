import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Auth() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />

      {/* Language Selector Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-md relative z-10">
        <button 
          onClick={() => navigate('/')}
          className="absolute -top-16 left-0 flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-text-dim hover:text-accent transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('backToLanding')}
        </button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="https://chatgpt.com/backend-api/estuary/content?id=file_00000000ae1871f5a8f925de14542cf8&ts=493413&p=fs&cid=1&sig=544363e48ba03522eb389bda4b571cef7a8914e5f4ed2e5fbff1756e14c09479&v=0" 
              alt="MarketLens Logo" 
              className="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(0,255,136,0.3)]" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">MARKET<span className="text-accent">LENS</span></h1>
          <p className="text-[10px] text-text-dim uppercase tracking-widest mt-2 font-bold">Institutional Grade Portfolio Analysis</p>
        </div>

        <div className="bento-card !bg-white/5 border-white/10 backdrop-blur-xl">
          <h2 className="text-xs font-black uppercase mb-8 border-b border-white/5 pb-4 tracking-widest">
            {isLogin ? t('systemAccess') : t('createAccount')}
          </h2>

          {error && (
            <div className="bg-loss/10 border border-loss/50 p-4 mb-8 text-[10px] text-loss uppercase font-black rounded-xl animate-shake">
              ERROR: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase text-text-dim mb-2 font-bold tracking-widest">{t('emailLabel')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs focus:outline-none focus:border-accent transition-all font-bold"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-text-dim mb-2 font-bold tracking-widest">{t('passwordLabel')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs focus:outline-none focus:border-accent transition-all font-bold"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-accent text-bg py-4 rounded-xl text-xs uppercase font-black tracking-widest hover:opacity-90 transition-all shadow-[0_10px_20px_-5px_rgba(0,255,136,0.3)]"
            >
              {isLogin ? t('signIn') : t('register')}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-widest">
              <span className="bg-[#0A0A0A] px-4 text-text-dim">{t('orContinueWith')}</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 rounded-xl text-xs uppercase font-black tracking-widest hover:bg-white hover:text-bg transition-all"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" referrerPolicy="no-referrer" />
            Google Account
          </button>

          <p className="mt-10 text-center text-[10px] text-text-dim uppercase font-bold tracking-widest">
            {isLogin ? t('noAccount') : t('haveAccount')}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-accent font-black hover:underline"
            >
              {isLogin ? t('registerNow') : t('signInNow')}
            </button>
          </p>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 opacity-20">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[8px] uppercase tracking-widest font-bold">End-to-End Encryption Active</span>
        </div>
      </div>
    </div>
  );
}
