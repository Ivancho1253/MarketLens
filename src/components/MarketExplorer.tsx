import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, LayoutGrid, List as ListIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MarketAsset {
  symbol: string;
  name: string;
  currency: string;
  exchange?: string;
  type: string;
}

export default function MarketExplorer() {
  const [stocks, setStocks] = useState<MarketAsset[]>([]);
  const [cryptos, setCryptos] = useState<MarketAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'stocks' | 'cryptos'>('stocks');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [stocksRes, cryptosRes] = await Promise.all([
          fetch('/api/market/stocks'),
          fetch('/api/market/cryptos')
        ]);
        const stocksData = await stocksRes.json();
        const cryptosData = await cryptosRes.json();
        
        setStocks(stocksData.data?.slice(0, 100) || []);
        setCryptos(cryptosData.data?.slice(0, 100) || []);
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAssets = (activeTab === 'stocks' ? stocks : cryptos).filter(asset => 
    asset.symbol.toLowerCase().includes(search.toLowerCase()) || 
    asset.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase">Market Explorer</h1>
          <p className="text-[10px] text-text-dim uppercase">Browse and analyze global assets</p>
        </div>
        
        <div className="flex items-center gap-2 bg-surface border border-border-accent p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('stocks')}
            className={`px-4 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all ${activeTab === 'stocks' ? 'bg-accent text-bg' : 'text-text-dim hover:text-white'}`}
          >
            Stocks
          </button>
          <button 
            onClick={() => setActiveTab('cryptos')}
            className={`px-4 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all ${activeTab === 'cryptos' ? 'bg-accent text-bg' : 'text-text-dim hover:text-white'}`}
          >
            Cryptocurrencies
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
        <input 
          type="text"
          placeholder="Search by symbol or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-border-accent rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-all"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bento-card h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredAssets.slice(0, 40).map((asset) => (
            <Link 
              key={asset.symbol} 
              to={`/explorer/${activeTab}/${asset.symbol}`}
              className="bento-card hover:border-accent/50 group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 bg-bg border border-border-accent rounded-xl flex items-center justify-center font-bold text-accent group-hover:bg-accent group-hover:text-bg transition-all">
                  {asset.symbol[0]}
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-text-dim uppercase">{asset.exchange || 'Global'}</div>
                  <div className="text-xs font-bold text-accent">{asset.symbol}</div>
                </div>
              </div>
              <h3 className="font-bold text-sm truncate">{asset.name}</h3>
              <div className="mt-4 flex justify-between items-center text-[10px] uppercase text-text-dim">
                <span>{asset.currency}</span>
                <span className="text-accent group-hover:translate-x-1 transition-transform">Analyze &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
