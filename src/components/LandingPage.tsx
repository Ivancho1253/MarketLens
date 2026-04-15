import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  BarChart3, 
  Wallet, 
  ArrowRight, 
  Globe, 
  Cpu, 
  LineChart,
  ChevronRight,
  Activity
} from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-accent/30 selection:text-accent overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 blur-[100px] rounded-full" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img 
            src="https://chatgpt.com/backend-api/estuary/content?id=file_00000000ae1871f5a8f925de14542cf8&ts=493413&p=fs&cid=1&sig=544363e48ba03522eb389bda4b571cef7a8914e5f4ed2e5fbff1756e14c09479&v=0" 
            alt="MarketLens Logo" 
            className="w-10 h-10 object-contain" 
            referrerPolicy="no-referrer" 
          />
          <span className="text-xl font-black tracking-tighter uppercase">Market<span className="text-accent">Lens</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-8 text-[10px] uppercase font-bold tracking-widest text-text-dim">
            <a href="#features" className="hover:text-accent transition-colors">{t('features')}</a>
            <a href="#intelligence" className="hover:text-accent transition-colors">{t('intelligence')}</a>
            <a href="#terminal" className="hover:text-accent transition-colors">{t('terminal')}</a>
          </div>
          <LanguageSelector />
        </div>
        <button 
          onClick={() => navigate('/auth')}
          className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-all"
        >
          {t('launchApp')}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] uppercase font-black tracking-[0.2em]">
              <Activity className="w-3 h-3 animate-pulse" />
              Next-Gen Market Intelligence
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
              {t('heroTitle').split('.').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {i === 0 ? part + '.' : <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-blue-400 to-purple-500">{part}</span>}
                  {i === 0 && <br />}
                </React.Fragment>
              ))}
            </motion.h1>
            
            <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-text-dim text-lg md:text-xl font-medium leading-relaxed">
              {t('heroSub')}
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button 
                onClick={() => navigate('/auth')}
                className="group relative px-10 py-5 bg-accent text-bg rounded-2xl text-sm uppercase font-black tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_-10px_rgba(0,255,136,0.3)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t('getStarted')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero Visual */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-24 max-w-6xl mx-auto relative group"
        >
          <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="ml-4 px-4 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-mono text-text-dim">
                marketlens.app/terminal/dashboard
              </div>
            </div>
            <div className="p-8 grid grid-cols-12 gap-6">
              <div className="col-span-8 space-y-6">
                <div className="h-64 bg-white/5 rounded-2xl border border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="px-2 py-1 rounded bg-accent/20 text-[8px] font-bold text-accent uppercase">Live Feed</div>
                    <div className="px-2 py-1 rounded bg-white/5 text-[8px] font-bold text-text-dim uppercase">Volatility: High</div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-end px-4 pb-4 gap-2">
                    {[40, 70, 45, 90, 65, 80, 55, 75, 95, 60, 85, 50, 65, 40].map((h, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 1 + (i * 0.05), duration: 0.5 }}
                        className="flex-1 bg-accent/30 rounded-t-sm" 
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Market Cap', val: '$2.4T' },
                    { label: 'Volume', val: '$84B' },
                    { label: 'Dominance', val: '42%' }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="text-[8px] text-text-dim uppercase font-bold mb-1">{item.label}</div>
                      <div className="text-sm font-black text-accent">{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-4 space-y-4">
                {[
                  { name: 'BTC/USD', price: '64,231', change: '+2.4%' },
                  { name: 'ETH/USD', price: '3,452', change: '+1.8%' },
                  { name: 'SOL/USD', price: '142.5', change: '-0.5%' },
                  { name: 'AAPL', price: '182.4', change: '+0.2%' }
                ].map((asset, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                    <div>
                      <div className="text-[10px] font-black">{asset.name}</div>
                      <div className="text-[8px] text-text-dim">{asset.price}</div>
                    </div>
                    <div className={`text-[8px] font-bold ${asset.change.startsWith('+') ? 'text-accent' : 'text-loss'}`}>
                      {asset.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Value Section */}
      <section id="features" className="relative z-10 py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">Core Intelligence</div>
              <h2 className="text-5xl font-black tracking-tighter uppercase leading-[0.9]">
                Everything you need to <span className="text-accent">dominate</span> the market.
              </h2>
              <p className="text-text-dim text-lg font-medium leading-relaxed">
                Stop juggling multiple tools. MarketLens combines portfolio tracking, 
                real-time analytics, and execution in one seamless interface.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Wallet, title: "Smart Wallet Tracking", desc: "Monitor all your assets across multiple chains and exchanges in real-time." },
                  { icon: Zap, title: "Instant Execution", desc: "Execute trades with minimal latency directly from your analysis terminal." },
                  { icon: Shield, title: "Institutional Security", desc: "Your data is encrypted and protected by industry-leading security protocols." }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg transition-all duration-500">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-tight mb-1">{feature.title}</h4>
                      <p className="text-sm text-text-dim leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <div className="bento-card !bg-white/5 border-white/10 p-8 space-y-4 hover:border-accent/50 transition-all">
                  <BarChart3 className="w-8 h-8 text-accent" />
                  <h3 className="font-black uppercase tracking-tight">Advanced Analytics</h3>
                  <p className="text-xs text-text-dim leading-relaxed">Deep dive into market metrics with our proprietary analysis engine.</p>
                </div>
                <div className="bento-card !bg-white/5 border-white/10 p-8 space-y-4 hover:border-accent/50 transition-all">
                  <Globe className="w-8 h-8 text-blue-400" />
                  <h3 className="font-black uppercase tracking-tight">Global Coverage</h3>
                  <p className="text-xs text-text-dim leading-relaxed">Track stocks, crypto, and prediction markets from around the world.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bento-card !bg-white/5 border-white/10 p-8 space-y-4 hover:border-accent/50 transition-all">
                  <Cpu className="w-8 h-8 text-purple-400" />
                  <h3 className="font-black uppercase tracking-tight">AI Insights</h3>
                  <p className="text-xs text-text-dim leading-relaxed">Leverage machine learning to identify patterns before they happen.</p>
                </div>
                <div className="bento-card !bg-white/5 border-white/10 p-8 space-y-4 hover:border-accent/50 transition-all">
                  <LineChart className="w-8 h-8 text-orange-400" />
                  <h3 className="font-black uppercase tracking-tight">Real-time Data</h3>
                  <p className="text-xs text-text-dim leading-relaxed">Millisecond precision data feeds for the most accurate market view.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Section */}
      <section id="intelligence" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <div className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">{t('intelligence')}</div>
            <h2 className="text-5xl font-black tracking-tighter uppercase">{t('predictiveInsights').split(' ')[0]} <span className="text-accent">{t('predictiveInsights').split(' ')[1]}</span></h2>
            <p className="text-text-dim max-w-2xl mx-auto">Our AI engine processes millions of data points to give you an unfair advantage.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Sentiment Analysis", desc: "Real-time social media and news sentiment tracking for every major asset." },
              { title: "Whale Alerts", desc: "Track large institutional movements before they impact the order book." },
              { title: "Pattern Recognition", desc: "Automated identification of complex technical patterns across all timeframes." }
            ].map((item, i) => (
              <div key={i} className="bento-card group hover:border-accent/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-black uppercase tracking-tight mb-3">{item.title}</h3>
                <p className="text-xs text-text-dim leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terminal Section */}
      <section id="terminal" className="relative z-10 py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full" />
              <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="text-[10px] font-black uppercase">{t('terminal')}</div>
                    <div className="text-[8px] text-accent uppercase font-bold">Live</div>
                  </div>
                  <div className="space-y-1">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="flex justify-between text-[9px] font-mono">
                        <span className="text-loss">64,231.{i}</span>
                        <span className="text-text-dim">0.452 BTC</span>
                      </div>
                    ))}
                    <div className="py-2 text-center text-xs font-black border-y border-white/5 my-2">64,230.50</div>
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="flex justify-between text-[9px] font-mono">
                        <span className="text-accent">64,229.{i}</span>
                        <span className="text-text-dim">1.234 BTC</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">{t('terminal')}</div>
              <h2 className="text-5xl font-black tracking-tighter uppercase leading-[0.9]">
                {t('professionalExecution').split(' ')[0]} <span className="text-accent">{t('professionalExecution').split(' ')[1]}</span>
              </h2>
              <p className="text-text-dim text-lg font-medium leading-relaxed">
                A high-performance trading interface designed for speed. Low-latency order execution and deep liquidity integration.
              </p>
              <ul className="space-y-4">
                {['Direct Market Access', 'Advanced Order Types', 'Multi-Exchange Routing', 'Custom Workspace Layouts'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                    <Zap className="w-4 h-4 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-40 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
            Ready to upgrade your <span className="text-accent">trading</span>?
          </h2>
          <p className="text-text-dim text-xl font-medium">
            Join thousands of high-performance traders using MarketLens to stay ahead of the curve.
          </p>
          <div className="pt-8">
            <button 
              onClick={() => navigate('/auth')}
              className="group relative px-12 py-6 bg-white text-black rounded-2xl text-sm uppercase font-black tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Launch Platform <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
          <div className="pt-12 flex items-center justify-center gap-8 opacity-30 grayscale">
            <div className="text-[10px] font-black uppercase tracking-widest">Trusted by</div>
            <div className="flex gap-8">
              <span className="font-black italic">QUANTUM</span>
              <span className="font-black italic">NEXUS</span>
              <span className="font-black italic">VELOCITY</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <img 
              src="https://chatgpt.com/backend-api/estuary/content?id=file_00000000ae1871f5a8f925de14542cf8&ts=493413&p=fs&cid=1&sig=544363e48ba03522eb389bda4b571cef7a8914e5f4ed2e5fbff1756e14c09479&v=0" 
              alt="MarketLens Logo" 
              className="w-5 h-5 object-contain grayscale" 
              referrerPolicy="no-referrer" 
            />
            <span className="text-sm font-black tracking-tighter uppercase">MarketLens</span>
          </div>
          <div className="text-[10px] text-text-dim uppercase font-bold tracking-widest">
            © 2026 MarketLens Intelligence. All rights reserved.
          </div>
          <div className="flex gap-6 text-[10px] uppercase font-bold tracking-widest text-text-dim">
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
            <a href="#" className="hover:text-accent transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
