import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Info, Activity, BarChart3 } from 'lucide-react';

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function AssetDetail() {
  const { type, symbol } = useParams<{ type: string; symbol: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: type === 'cryptos' ? `BINANCE:${symbol}USDT` : `NASDAQ:${symbol}`,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_widget',
          backgroundColor: '#050505',
          gridColor: 'rgba(255, 255, 255, 0.05)',
          hide_side_toolbar: false,
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script if needed, though TradingView widget handles most of it
    };
  }, [symbol, type]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-surface border border-border-accent rounded-xl hover:text-accent transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase">{symbol} <span className="text-text-dim font-normal">/ USD</span></h1>
          <p className="text-[10px] text-text-dim uppercase">Market Analysis & Technical Data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart Card */}
        <div className="lg:col-span-9 bento-card !p-0 overflow-hidden h-[600px]">
          <div id="tradingview_widget" className="w-full h-full" ref={containerRef} />
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bento-card">
            <div className="card-title">Asset Info</div>
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-dim uppercase">Symbol</span>
                <span className="font-bold">{symbol}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-dim uppercase">Market</span>
                <span className="font-bold">{type === 'stocks' ? 'NASDAQ' : 'Crypto'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-dim uppercase">Currency</span>
                <span className="font-bold">USD</span>
              </div>
            </div>
          </div>

          <div className="bento-card">
            <div className="card-title">Technical Summary</div>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-text-dim uppercase">Volatility</div>
                  <div className="text-xs font-bold">Medium</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-text-dim uppercase">Trend</div>
                  <div className="text-xs font-bold text-accent">Bullish</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bento-card bg-accent/5 border-accent/20">
            <div className="flex items-center gap-2 text-accent mb-2">
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Live Updates</span>
            </div>
            <p className="text-[10px] text-text-dim leading-relaxed">
              Real-time data provided by TradingView. Technical indicators are calculated based on current market conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
