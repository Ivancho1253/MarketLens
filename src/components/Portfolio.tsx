import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Asset, Transaction } from '../types';
import { Plus, Search, Filter, History, Trash2 } from 'lucide-react';

export default function Portfolio() {
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

  if (loading) return <div className="font-mono text-xs animate-pulse">LOADING PORTFOLIO DATA...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase">Asset Management</h1>
          <p className="text-[10px] text-text-dim uppercase">Manage your holdings and history</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-accent text-bg px-4 py-2 rounded-lg text-xs uppercase font-bold hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? 'Cancel' : 'Add New Asset'}
        </button>
      </div>

      {isAdding && (
        <div className="bento-card animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-sm font-bold uppercase mb-4 border-b border-border-accent pb-2">Register Operation</h2>
          <form onSubmit={handleAddAsset} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-[10px] uppercase text-text-dim mb-1">Symbol</label>
              <input value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="AAPL / BTC" className="w-full bg-bg border border-border-accent rounded-lg p-2 text-xs focus:outline-none focus:border-accent" required />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-text-dim mb-1">Name (Optional)</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Apple Inc" className="w-full bg-bg border border-border-accent rounded-lg p-2 text-xs focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-text-dim mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-bg border border-border-accent rounded-lg p-2 text-xs focus:outline-none">
                <option value="stock">Stock</option>
                <option value="crypto">Crypto</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-text-dim mb-1">Quantity</label>
              <input type="number" step="any" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0.00" className="w-full bg-bg border border-border-accent rounded-lg p-2 text-xs focus:outline-none focus:border-accent" required />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-text-dim mb-1">Price</label>
              <input type="number" step="any" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className="w-full bg-bg border border-border-accent rounded-lg p-2 text-xs focus:outline-none focus:border-accent" required />
            </div>
            <div className="md:col-span-2 lg:col-span-5 flex justify-end">
              <button type="submit" className="bg-accent text-bg px-8 py-2 rounded-lg text-xs uppercase font-bold">Execute Transaction</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assets List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-[10px] uppercase text-text-dim px-2">
            <span>Active Holdings</span>
            <span>{assets.length} Total</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assets.map((asset) => (
              <div key={asset.id} className="bento-card hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-bg text-accent flex items-center justify-center font-bold border border-border-accent rounded-xl">
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <h3 className="font-bold">{asset.symbol}</h3>
                      <p className="text-[10px] text-text-dim uppercase">{asset.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-text-main">${(asset.averagePrice * asset.totalQuantity).toLocaleString()}</div>
                    <div className="text-[10px] text-text-dim">{asset.totalQuantity} Units</div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border-accent">
                  <div className="text-[10px] uppercase text-text-dim">Avg Price: ${asset.averagePrice.toFixed(2)}</div>
                  <button className="text-[10px] uppercase text-accent underline opacity-0 group-hover:opacity-100 transition-opacity">Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bento-card flex flex-col h-fit">
          <div className="flex items-center gap-2 mb-4 border-b border-border-accent pb-2">
            <History className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold uppercase">Recent Activity</h2>
          </div>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((tx) => (
              <div key={tx.id} className="border-l-2 border-accent pl-4 py-1">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase">{tx.type} {tx.assetSymbol}</span>
                  <span className="text-[10px] text-text-dim">{new Date(tx.date).toLocaleDateString()}</span>
                </div>
                <div className="text-[10px] text-text-dim">
                  {tx.quantity} units @ ${tx.price.toFixed(2)}
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="text-center py-8 text-[10px] uppercase text-text-dim italic">No activity recorded</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
