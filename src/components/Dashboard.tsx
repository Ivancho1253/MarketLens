import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, limit } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import CompanyLogo from './CompanyLogo';
import { Asset } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, PieChart, Star, TrendingUp as TrendingUpIcon } from 'lucide-react';
import TickerTape from './TickerTape';

export default function Dashboard() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Portfolio Assets
    const qAssets = query(collection(db, 'users', auth.currentUser.uid, 'assets'));
    const unsubscribeAssets = onSnapshot(qAssets, (snapshot) => {
      const assetList: Asset[] = [];
      let total = 0;
      snapshot.forEach((doc) => {
        const data = doc.data() as Asset;
        assetList.push({ ...data, id: doc.id });
        total += data.averagePrice * data.totalQuantity;
      });
      setAssets(assetList);
      setTotalValue(total);
      setLoading(false);
    });

    // Favorites
    const qFavs = query(collection(db, 'users', auth.currentUser.uid, 'favorites'), limit(5));
    const unsubscribeFavs = onSnapshot(qFavs, (snapshot) => {
      const favList: any[] = [];
      snapshot.forEach((doc) => {
        favList.push({ ...doc.data(), id: doc.id });
      });
      setFavorites(favList);
    });

    return () => {
      unsubscribeAssets();
      unsubscribeFavs();
    };
  }, []);

  const mockChartData = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent animate-pulse">Initializing Terminal...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Ticker */}
      <div className="bento-card !p-0 overflow-hidden border-accent/20">
        <TickerTape />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto">
        {/* Portfolio Main Card */}
        <div className="md:col-span-8 bento-card group">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="card-title">Net Portfolio Value</div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-black tracking-tighter data-value">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <span className="text-xs font-bold text-text-dim uppercase tracking-widest">USD</span>
              </div>
            </div>
            <div className="text-right">
              <div className="card-title">30D Performance</div>
              <div className="flex flex-col items-end gap-1">
                <div className="stat-badge stat-up text-sm">
                  +12.42%
                </div>
                <div className="text-[10px] font-mono text-accent">
                  +${(totalValue * 0.1242).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative background element */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/5 blur-3xl rounded-full group-hover:bg-accent/10 transition-all duration-700" />
        </div>

        {/* Quick Stats Grid */}
        <div className="md:col-span-4 grid grid-cols-2 gap-4">
          <div className="bento-card !p-4 flex flex-col justify-between">
            <div className="card-title !mb-0">Assets</div>
            <div className="text-2xl font-black data-value">{assets.length}</div>
          </div>
          <div className="bento-card !p-4 flex flex-col justify-between">
            <div className="card-title !mb-0">Favorites</div>
            <div className="text-2xl font-black data-value">{favorites.length}</div>
          </div>
        </div>

        {/* Chart Card */}
        <div className="md:col-span-8 bento-card">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="card-title !mb-1">Portfolio Growth</div>
              <div className="text-[10px] text-text-dim uppercase font-bold tracking-widest">Historical Performance Index</div>
            </div>
            <div className="flex gap-2">
              {['1D', '1W', '1M', '1Y'].map(t => (
                <button key={t} className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all ${t === '1M' ? 'bg-accent text-bg' : 'hover:bg-accent/10 text-text-dim'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-accent)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-dim)', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-dim)', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'var(--surface)', border: '1px solid var(--border-accent)', borderRadius: '16px', color: 'var(--text-main)', fontSize: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.2)'}}
                  itemStyle={{color: 'var(--accent)', fontWeight: 800}}
                  cursor={{stroke: 'var(--accent)', strokeWidth: 1, strokeDasharray: '4 4'}}
                />
                <Area type="monotone" dataKey="value" stroke="var(--accent)" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assets List Card */}
        <div className="md:col-span-4 bento-card flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="card-title !mb-0">Top Holdings</div>
            <Activity className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1 space-y-2">
            {assets.slice(0, 5).map((asset) => (
              <div key={asset.id} className="flex justify-between items-center gap-3 p-3 rounded-2xl hover:bg-accent/5 transition-all cursor-pointer group border border-transparent hover:border-accent/10">
                <div className="flex items-center gap-3 min-w-0">
                  <CompanyLogo 
                    symbol={asset.symbol} 
                    name={asset.name} 
                    type={asset.type === 'crypto' ? 'crypto' : 'stock'}
                    className="w-10 h-10 rounded-xl flex-shrink-0"
                    imgClassName="w-6 h-6 grayscale group-hover:grayscale-0 transition-all"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-black group-hover:text-accent transition-colors truncate">{asset.symbol}</div>
                    <div className="text-[9px] text-text-dim uppercase font-bold tracking-tighter truncate">{asset.name}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-black data-value">${asset.averagePrice.toLocaleString()}</div>
                  <div className="text-[9px] font-bold text-accent mt-0.5">+2.4%</div>
                </div>
              </div>
            ))}
            {assets.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-text-dim gap-2">
                <PieChart className="w-8 h-8 opacity-20" />
                <div className="text-[10px] uppercase font-black tracking-widest italic">No assets found</div>
              </div>
            )}
          </div>
          <button className="mt-6 w-full py-3 rounded-xl border border-border-accent text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-bg hover:border-accent transition-all">
            Full Portfolio View
          </button>
        </div>

        {/* Bottom Stats / Social Feed Placeholder */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bento-card">
            <div className="flex justify-between items-start mb-6">
              <div className="card-title !mb-0">Watchlist</div>
              <Star className="w-4 h-4 text-accent fill-accent" />
            </div>
            <div className="space-y-4">
              {favorites.map((fav) => (
                <div key={fav.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CompanyLogo symbol={fav.symbol} name={fav.name} type={fav.type} className="w-8 h-8 rounded-lg" imgClassName="w-4 h-4" />
                    <span className="text-xs font-black group-hover:text-accent transition-colors">{fav.symbol}</span>
                  </div>
                  <div className="stat-badge stat-up">+1.2%</div>
                </div>
              ))}
              {favorites.length === 0 && (
                <div className="text-[10px] text-text-dim italic text-center py-4 font-bold uppercase">Empty Watchlist</div>
              )}
            </div>
          </div>
          
          {[
            { tag: 'Reciente', source: 'X / Twitter', content: '"La adopción institucional de $SOL está alcanzando niveles récord este trimestre. #CryptoNews"', meta: '@AltcoinSherpa • 2m' },
            { tag: 'Mercados', source: 'Reuters', content: 'La Reserva Federal mantiene tasas estables; Wall Street reacciona con optimismo moderado.', meta: 'Economía Global • 15m' },
            { tag: 'Sentimiento', source: 'Analista Pro', content: '$AAPL: El análisis de sentimiento muestra una tendencia alcista del 78% tras anuncio de IA.', meta: '@FintechWhale • 40m' }
          ].map((item, i) => (
            <div key={i} className="bento-card group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] text-accent uppercase font-black tracking-[0.2em]">{item.tag}</span>
                <span className="text-[9px] text-text-dim uppercase font-bold">{item.source}</span>
              </div>
              <p className="text-xs leading-relaxed font-medium group-hover:text-text-main transition-colors">{item.content}</p>
              <div className="mt-6 text-[9px] text-text-dim font-bold uppercase tracking-tighter">{item.meta}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
