import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Asset, Transaction } from '../types';
import { Plus, Search, Filter, History, Trash2, DollarSign, Activity, ArrowLeft } from 'lucide-react';

export default function Portfolio() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<'stock' | 'crypto'>('stock');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;

    const assetsQuery = query(collection(db, 'users', auth.currentUser.uid, 'assets'));
    const txQuery = query(collection(db, 'users', auth.currentUser.uid, 'transactions'));

    const unsubAssets = onSnapshot(assetsQuery, (snapshot) => {
      setAssets(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Asset)));
    });

    const unsubTx = onSnapshot(txQuery, (snapshot) => {
      setTransactions(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Transaction)));
      setLoading(false);
    });

    return () => {
      unsubAssets();
      unsubTx();
    };
  }, []);

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const qtyNum = parseFloat(quantity);
    const priceNum = parseFloat(price);

    try {
      // 1. Add Transaction
      await addDoc(collection(db, 'users', userId, 'transactions'), {
        assetSymbol: symbol.toUpperCase(),
        type: 'buy',
        quantity: qtyNum,
        price: priceNum,
        date: new Date().toISOString(),
        userId
      });

      // 2. Update/Create Asset
      const assetRef = doc(db, 'users', userId, 'assets', symbol.toUpperCase());
      const assetSnap = await getDoc(assetRef);

      if (assetSnap.exists()) {
        const currentData = assetSnap.data() as Asset;
        const newQty = currentData.totalQuantity + qtyNum;
        const newAvgPrice = ((currentData.averagePrice * currentData.totalQuantity) + (priceNum * qtyNum)) / newQty;
        
        await updateDoc(assetRef, {
          totalQuantity: newQty,
          averagePrice: newAvgPrice,
          lastUpdated: new Date().toISOString()
        });
      } else {
        await setDoc(assetRef, {
          symbol: symbol.toUpperCase(),
          name: name || symbol.toUpperCase(),
          type,
          averagePrice: priceNum,
          totalQuantity: qtyNum,
          lastUpdated: new Date().toISOString()
        });
      }

      // Reset form
      setSymbol('');
      setName('');
      setQuantity('');
      setPrice('');
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding asset:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent animate-pulse">Syncing Portfolio...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-surface border border-border-accent rounded-2xl hover:text-accent transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Asset Management</h1>
            <p className="text-[10px] text-text-dim uppercase font-bold tracking-[0.2em] mt-1">Manage your holdings and history</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-accent text-bg px-6 py-3 rounded-2xl text-[10px] uppercase font-black hover:scale-105 transition-all shadow-[0_10px_20px_-5px_rgba(0,255,136,0.3)]"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? 'Cancel' : 'Add New Asset'}
        </button>
      </div>

      {isAdding && (
        <div className="bento-card animate-in fade-in slide-in-from-top-4 duration-500 border-accent/30">
          <h2 className="text-[10px] font-black uppercase tracking-widest mb-6 border-b border-border-accent pb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            Register Operation
          </h2>
          <form onSubmit={handleAddAsset} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <label className="block text-[9px] uppercase font-black text-text-dim mb-2 tracking-widest">Symbol</label>
              <input value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="AAPL / BTC" className="w-full bg-bg border border-border-accent rounded-xl p-3 text-xs focus:outline-none focus:border-accent transition-colors font-bold" required />
            </div>
            <div>
              <label className="block text-[9px] uppercase font-black text-text-dim mb-2 tracking-widest">Name (Optional)</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Apple Inc" className="w-full bg-bg border border-border-accent rounded-xl p-3 text-xs focus:outline-none focus:border-accent transition-colors font-bold" />
            </div>
            <div>
              <label className="block text-[9px] uppercase font-black text-text-dim mb-2 tracking-widest">Type</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-bg border border-border-accent rounded-xl p-3 text-xs focus:outline-none font-bold">
                <option value="stock">Stock</option>
                <option value="crypto">Crypto</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] uppercase font-black text-text-dim mb-2 tracking-widest">Quantity</label>
              <input type="number" step="any" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0.00" className="w-full bg-bg border border-border-accent rounded-xl p-3 text-xs focus:outline-none focus:border-accent transition-colors font-bold" required />
            </div>
            <div>
              <label className="block text-[9px] uppercase font-black text-text-dim mb-2 tracking-widest">Price</label>
              <input type="number" step="any" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className="w-full bg-bg border border-border-accent rounded-xl p-3 text-xs focus:outline-none focus:border-accent transition-colors font-bold" required />
            </div>
            <div className="md:col-span-2 lg:col-span-5 flex justify-end">
              <button type="submit" className="bg-accent text-bg px-10 py-3 rounded-xl text-[10px] uppercase font-black hover:opacity-90 transition-all">Execute Transaction</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assets List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between text-[10px] uppercase font-black text-text-dim px-2 tracking-widest">
            <span className="flex items-center gap-2"><DollarSign className="w-3 h-3" /> Active Holdings</span>
            <span>{assets.length} Total</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assets.map((asset) => (
              <div key={asset.id} className="bento-card group hover:border-accent/30">
                <div className="flex justify-between items-start gap-4 mb-6">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 flex-shrink-0 bg-bg text-accent flex items-center justify-center font-black border border-border-accent rounded-2xl group-hover:border-accent/50 transition-colors">
                      {asset.symbol[0]}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-lg tracking-tighter group-hover:text-accent transition-colors truncate">{asset.symbol}</h3>
                      <p className="text-[9px] text-text-dim uppercase font-bold tracking-widest truncate">{asset.name}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-black text-text-main data-value">${(asset.averagePrice * asset.totalQuantity).toLocaleString()}</div>
                    <div className="text-[9px] text-text-dim font-bold uppercase mt-1">{asset.totalQuantity} Units</div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-border-accent">
                  <div className="text-[9px] uppercase font-black text-text-dim tracking-widest">Avg Price: <span className="text-text-main font-mono">${asset.averagePrice.toFixed(2)}</span></div>
                  <button className="text-[9px] uppercase font-black text-accent hover:underline transition-all">Details &rarr;</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bento-card flex flex-col h-fit border-accent/10">
          <div className="flex items-center gap-3 mb-6 border-b border-border-accent pb-4">
            <History className="w-5 h-5 text-accent" />
            <h2 className="text-xs font-black uppercase tracking-widest">Recent Activity</h2>
          </div>
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((tx) => (
              <div key={tx.id} className="border-l-2 border-accent/30 hover:border-accent pl-4 py-1 transition-colors group">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase tracking-tighter group-hover:text-accent transition-colors">{tx.type} {tx.assetSymbol}</span>
                  <span className="text-[9px] text-text-dim font-bold">{new Date(tx.date).toLocaleDateString()}</span>
                </div>
                <div className="text-[10px] text-text-dim font-medium mt-1">
                  {tx.quantity} units @ <span className="font-mono">${tx.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-text-dim gap-2">
                <Activity className="w-8 h-8 opacity-20" />
                <div className="text-[10px] uppercase font-black tracking-widest italic">No activity recorded</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
