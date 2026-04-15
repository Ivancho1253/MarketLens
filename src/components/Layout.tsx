import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { User } from 'firebase/auth';
import { UserProfile } from '../types';
import { LayoutDashboard, Wallet, Newspaper, LogOut, TrendingUp, Compass, Sun, Moon } from 'lucide-react';
import { auth } from '../lib/firebase';
import { cn } from '../lib/utils';

interface LayoutProps {
  user: User;
  profile: UserProfile | null;
}

export default function Layout({ user, profile }: LayoutProps) {
  const location = useLocation();
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsLight(true);
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isLight;
    setIsLight(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/portfolio', icon: Wallet, label: 'Portfolio' },
    { path: '/explorer', icon: Compass, label: 'Explorar' },
    { path: '/news', icon: Newspaper, label: 'Market News' },
  ];

  return (
    <div className="flex h-screen bg-bg text-text-main font-sans">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border-accent flex flex-col p-6 gap-8">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-accent" />
          <span className="font-bold tracking-tighter text-lg uppercase">MARKET<span className="text-accent">LENS</span></span>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all border border-transparent",
                    location.pathname === item.path 
                      ? "bg-surface text-white border-border-accent" 
                      : "text-text-dim hover:text-white"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-4 bg-surface rounded-xl border border-border-accent">
            <div className="text-[10px] text-text-dim uppercase font-bold">PLAN PRO</div>
            <div className="text-xs font-bold mt-1">Acceso Ilimitado</div>
          </div>
          
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-bg font-bold text-xs">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user.email}</p>
              <p className="text-[10px] text-text-dim uppercase">Premium User</p>
            </div>
          </div>
          
          <button
            onClick={() => auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs text-text-dim hover:text-loss hover:bg-loss/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b border-border-accent flex items-center justify-between px-8 bg-bg/50 backdrop-blur-md sticky top-0 z-10">
          <div className="bg-surface border border-border-accent px-4 py-2 rounded-full w-80 text-xs text-text-dim">
            Buscar activos (ej: AAPL, BTC, SOL)...
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button 
              onClick={toggleTheme}
              className="p-2 bg-surface border border-border-accent rounded-xl hover:text-accent transition-all"
              title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <span className="flex items-center gap-2 text-text-dim">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Live Market Data
            </span>
          </div>
        </header>
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
