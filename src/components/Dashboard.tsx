import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, limit } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import CompanyLogo from './CompanyLogo';
import { Asset } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, PieChart, Star } from 'lucide-react';

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
    return <div className="font-mono text-xs animate-pulse">LOADING ANALYTICS...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-auto">
      {/* Portfolio Main Card */}
      <div className="md:col-span-8 bento-card flex justify-between items-center">
        <div>
          <div className="card-title">Valor Total del Portafolio</div>
          <h2 className="text-3xl font-bold tracking-tighter">${totalValue.toLocaleString()} <span className="text-sm font-normal text-text-dim ml-2">USD</span></h2>
        </div>
        <div className="text-right">
          <div className="card-title">Retorno Mensual</div>
          <div className="px-3 py-1 bg-accent-soft text-accent rounded-full text-sm font-semibold">
            +12.4% (+${(totalValue * 0.124).toLocaleString()})
          </div>
        </div>
      </div>

      {/* Assets List Card - Spans 2 rows */}
      <div className="md:col-span-4 md:row-span-2 bento-card flex flex-col">
        <div className="card-title">Activos Destacados</div>
        <div className="flex-1 space-y-1">
          {assets.slice(0, 6).map((asset) => (
            <div key={asset.id} className="flex justify-between items-center py-3 border-b border-border-accent last:border-0 hover:bg-white/5 transition-colors px-2 -mx-2 rounded-lg cursor-pointer group">
              <div className="flex items-center gap-3">
                <CompanyLogo 
                  symbol={asset.symbol} 
                  name={asset.name} 
                  type={asset.type === 'crypto' ? 'crypto' : 'stock'}
                  className="w-10 h-10"
                  imgClassName="w-7 h-7 grayscale group-hover:grayscale-0"
                />
                <div>
                  <div className="text-sm font-semibold group-hover:text-accent transition-colors">{asset.name}</div>
                  <div className="text-[10px] text-text-dim uppercase font-bold tracking-widest">{asset.type}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">${asset.averagePrice.toLocaleString()}</div>
                <div className="stat-badge stat-up mt-1">+2.4%</div>
              </div>
            </div>
          ))}
          {assets.length === 0 && (
            <div className="text-center py-12 text-text-dim text-xs uppercase italic">No assets found</div>
          )}
        </div>
        <button className="mt-4 text-center text-accent text-xs font-semibold hover:underline">
          Ver todos los activos &rarr;
        </button>
      </div>

      {/* Chart Card */}
      <div className="md:col-span-8 bento-card">
        <div className="card-title">Tendencia del Mercado (24h)</div>
        <div className="text-[10px] text-text-dim mb-6 uppercase">Portfolio Performance Index</div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF88" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#00FF88" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8F8F91', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#8F8F91', fontSize: 10}} />
              <Tooltip 
                contentStyle={{backgroundColor: '#121214', border: '1px solid #222224', borderRadius: '8px', color: '#fff', fontSize: 12}}
                itemStyle={{color: '#00FF88'}}
              />
              <Area type="monotone" dataKey="value" stroke="#00FF88" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Stats / Social Feed Placeholder */}
      <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bento-card">
          <div className="flex justify-between items-start mb-4">
            <div className="card-title !mb-0">Watchlist</div>
            <Star className="w-4 h-4 text-accent fill-accent" />
          </div>
          <div className="space-y-3">
            {favorites.map((fav) => (
              <div key={fav.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2">
                  <CompanyLogo symbol={fav.symbol} name={fav.name} type={fav.type} className="w-6 h-6 rounded-lg" imgClassName="w-4 h-4" />
                  <span className="text-xs font-bold group-hover:text-accent transition-colors">{fav.symbol}</span>
                </div>
                <div className="text-[10px] text-accent font-bold">+1.2%</div>
              </div>
            ))}
            {favorites.length === 0 && (
              <div className="text-[10px] text-text-dim italic text-center py-4">No favorites yet</div>
            )}
          </div>
        </div>
        <div className="bento-card">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] text-accent uppercase font-bold tracking-widest">Reciente</span>
            <span className="text-[10px] text-text-dim uppercase">X / Twitter</span>
          </div>
          <p className="text-sm leading-relaxed">"La adopción institucional de $SOL está alcanzando niveles récord este trimestre. #CryptoNews"</p>
          <div className="mt-4 text-[10px] text-text-dim">@AltcoinSherpa • hace 2m</div>
        </div>
        <div className="bento-card">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] text-accent uppercase font-bold tracking-widest">Mercados</span>
            <span className="text-[10px] text-text-dim uppercase">Reuters</span>
          </div>
          <p className="text-sm leading-relaxed">La Reserva Federal mantiene tasas estables; Wall Street reacciona con optimismo moderado.</p>
          <div className="mt-4 text-[10px] text-text-dim">Economía Global • hace 15m</div>
        </div>
        <div className="bento-card">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] text-accent uppercase font-bold tracking-widest">Sentimiento</span>
            <span className="text-[10px] text-text-dim uppercase">Analista Pro</span>
          </div>
          <p className="text-sm leading-relaxed">$AAPL: El análisis de sentimiento muestra una tendencia alcista del 78% tras anuncio de IA.</p>
          <div className="mt-4 text-[10px] text-text-dim">@FintechWhale • hace 40m</div>
        </div>
      </div>
    </div>
  );
}
