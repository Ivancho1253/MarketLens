import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown, LayoutGrid, List as ListIcon, Star, Flame, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { cn } from '../lib/utils';
import CompanyLogo from './CompanyLogo';

interface MarketAsset {
  symbol: string;
  name: string;
  currency: string;
  exchange?: string;
  type: string;
}

export default function MarketExplorer() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<MarketAsset[]>([]);
  const [cryptos, setCryptos] = useState<MarketAsset[]>([]);
  const [hotAssets, setHotAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'stocks' | 'cryptos' | 'favorites'>('stocks');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, 'users', auth.currentUser.uid, 'favorites'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favList: string[] = [];
      snapshot.forEach((doc) => {
        favList.push(doc.id);
      });
      setFavorites(favList);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [stocksRes, cryptosRes, hotRes] = await Promise.all([
          fetch('/api/market/stocks'),
          fetch('/api/market/cryptos'),
          fetch('/api/market/hot')
        ]);
        const stocksData = await stocksRes.json();
        const cryptosData = await cryptosRes.json();
        const hotData = await hotRes.json();
        
        setStocks(stocksData.data || []);
        setCryptos(cryptosData.data || []);
        setHotAssets(hotData.data || []);
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleFavorite = async (e: React.MouseEvent, asset: MarketAsset) => {
    e.preventDefault();
    e.stopPropagation();
    if (!auth.currentUser) return;

    const favRef = doc(db, 'users', auth.currentUser.uid, 'favorites', asset.symbol);
    if (favorites.includes(asset.symbol)) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, {
        symbol: asset.symbol,
        name: asset.name,
        type: activeTab === 'cryptos' ? 'crypto' : 'stock',
        addedAt: new Date().toISOString()
      });
    }
  };

  const getAssetsToDisplay = () => {
    if (activeTab === 'favorites') {
      const allAssets = [...stocks, ...cryptos];
      return allAssets.filter(asset => favorites.includes(asset.symbol));
    }
    return activeTab === 'stocks' ? stocks : cryptos;
  };

  const filteredAssets = getAssetsToDisplay().filter(asset => 
    (asset.symbol?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (asset.name?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-surface border border-border-accent rounded-2xl hover:text-accent transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Market Explorer</h1>
            <p className="text-[10px] text-accent uppercase font-bold tracking-[0.2em] mt-1">S&P 500 Index Companies</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-surface border border-border-accent p-1 rounded-2xl">
          {(['stocks', 'cryptos', 'favorites'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === t ? "bg-accent text-bg shadow-lg" : "text-text-dim hover:text-text-main"
              )}
            >
              {t === 'cryptos' ? 'Cryptocurrencies' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Hot Assets Header */}
      {!loading && hotAssets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Flame className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Trending Now</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {hotAssets.map((asset) => (
              <Link 
                key={asset.symbol}
                to={`/explorer/${asset.type === 'crypto' ? 'cryptos' : 'stocks'}/${asset.symbol}`}
                className="bento-card !p-4 hover:border-accent/50 transition-all group !bg-accent/10 border-accent/30 shadow-[0_8px_20px_-10px_rgba(0,255,136,0.3)] hover:-translate-y-2"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-text-main group-hover:text-accent transition-colors">{asset.symbol}</span>
                  <TrendingUp className="w-3 h-3 text-accent" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-black text-accent">+{asset.change}%</span>
                  <span className="text-[8px] text-text-dim uppercase font-black">7D</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-accent transition-colors" />
        <input 
          type="text"
          placeholder="Search by symbol or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-border-accent rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-all font-bold"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bento-card h-40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAssets.slice(0, 200).map((asset) => (
            <Link 
              key={asset.symbol} 
              to={`/explorer/${activeTab === 'favorites' ? (asset.type === 'crypto' ? 'cryptos' : 'stocks') : activeTab}/${asset.symbol}`}
              className="bento-card hover:border-accent/50 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="relative">
                  <CompanyLogo 
                    symbol={asset.symbol} 
                    name={asset.name} 
                    type={asset.type === 'crypto' ? 'crypto' : 'stock'}
                    className="w-14 h-14 rounded-2xl bg-bg border border-border-accent group-hover:border-accent/30 transition-colors"
                    imgClassName="w-8 h-8 grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-surface flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-bg" />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button 
                    onClick={(e) => toggleFavorite(e, asset)}
                    className={cn(
                      "p-2.5 rounded-xl border border-border-accent hover:border-accent/50 transition-all",
                      favorites.includes(asset.symbol) ? 'bg-accent/10 border-accent/30' : 'bg-surface'
                    )}
                  >
                    <Star className={cn("w-4 h-4 transition-all", favorites.includes(asset.symbol) ? "fill-accent text-accent scale-110" : "text-text-dim")} />
                  </button>
                  <div className="text-right">
                    <div className="text-[9px] text-text-dim uppercase font-black tracking-widest">{asset.exchange || 'Global'}</div>
                    <div className="text-xs font-black text-text-main mt-1 tracking-tighter">{asset.symbol}</div>
                  </div>
                </div>
              </div>
              
              <h3 className="font-black text-sm truncate group-hover:text-accent transition-colors mb-4">{asset.name}</h3>
              
              <div className="flex justify-between items-end pt-4 border-t border-border-accent opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <span className="text-[9px] font-black uppercase tracking-widest text-accent">View Analysis</span>
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-accent" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
