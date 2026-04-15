import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, LayoutGrid, List as ListIcon, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

import CompanyLogo from './CompanyLogo';

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
    asset.symbol.toLowerCase().includes(search.toLowerCase()) || 
    asset.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase">Market Explorer</h1>
          <p className="text-[10px] text-accent uppercase font-bold tracking-widest">S&P 500 Index Companies</p>
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
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all ${activeTab === 'favorites' ? 'bg-accent text-bg' : 'text-text-dim hover:text-white'} flex items-center gap-1.5`}
          >
            <Star className={`w-3 h-3 ${activeTab === 'favorites' ? 'fill-bg' : ''}`} />
            Favorites
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
          {filteredAssets.slice(0, 200).map((asset) => (
            <Link 
              key={asset.symbol} 
              to={`/explorer/${activeTab}/${asset.symbol}`}
              className="bento-card hover:border-accent/50 group"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="relative">
                  <CompanyLogo 
                    symbol={asset.symbol} 
                    name={asset.name} 
                    type={asset.type === 'crypto' ? 'crypto' : 'stock'}
                    className="w-12 h-12"
                    imgClassName="w-8 h-8 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-surface flex items-center justify-center">
                    <TrendingUp className="w-2 h-2 text-bg" />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button 
                    onClick={(e) => toggleFavorite(e, asset)}
                    className={`p-2 rounded-lg border border-border-accent hover:border-accent/50 transition-all ${favorites.includes(asset.symbol) ? 'bg-accent/10 border-accent/30' : 'bg-surface'}`}
                  >
                    <Star className={`w-4 h-4 ${favorites.includes(asset.symbol) ? 'fill-accent text-accent' : 'text-text-dim'}`} />
                  </button>
                  <div className="text-right">
                    <div className="text-[9px] text-text-dim uppercase font-bold tracking-widest">{asset.exchange || 'Global'}</div>
                    <div className="text-xs font-black text-white mt-1">{asset.symbol}</div>
                  </div>
                </div>
              </div>
              
              <h3 className="font-bold text-sm truncate group-hover:text-accent transition-colors">{asset.name}</h3>
              
              <div className="mt-4 flex items-center gap-2">
                <div className="stat-badge stat-up">+2.45%</div>
                <div className="text-[9px] text-text-dim uppercase font-bold">24H Vol</div>
              </div>

              <div className="mt-6 flex justify-between items-center pt-4 border-t border-white/5">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-5 h-5 rounded-full border border-surface bg-bg flex items-center justify-center text-[8px] text-text-dim">
                      {i}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] uppercase font-bold text-accent group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Analyze <TrendingUp className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
