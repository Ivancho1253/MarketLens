import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { TrendingUp, ShieldCheck } from 'lucide-react';

export default function Auth() {
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
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-bg">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase">NEXUS<span className="text-accent">FINANCE</span></h1>
          <p className="text-[10px] text-text-dim uppercase tracking-widest mt-2">Institutional Grade Portfolio Analysis</p>
        </div>

        <div className="bento-card">
          <h2 className="text-sm font-bold uppercase mb-6 border-b border-border-accent pb-2">
            {isLogin ? 'Acceso al Sistema' : 'Registro de Usuario'}
          </h2>

          {error && (
            <div className="bg-loss/10 border border-loss/50 p-3 mb-6 text-[10px] text-loss uppercase font-bold rounded-lg">
              ERROR: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase text-text-dim mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg border border-border-accent rounded-lg p-3 text-xs focus:outline-none focus:border-accent transition-all"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-text-dim mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg border border-border-accent rounded-lg p-3 text-xs focus:outline-none focus:border-accent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-accent text-bg py-3 rounded-lg text-xs uppercase font-bold hover:opacity-90 transition-all"
            >
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-accent"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-surface px-2 text-text-dim">O continuar con</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-bg border border-border-accent py-3 rounded-lg text-xs uppercase font-bold hover:bg-white hover:text-bg transition-all"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" referrerPolicy="no-referrer" />
            Google Account
          </button>

          <p className="mt-8 text-center text-[10px] text-text-dim uppercase">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-accent font-bold hover:underline"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 opacity-20">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[8px] uppercase tracking-widest">End-to-End Encryption Active</span>
        </div>
      </div>
    </div>
  );
}
