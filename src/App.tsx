import React, { useState, useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import NewsFeed from './components/NewsFeed';
import MarketExplorer from './components/MarketExplorer';
import AssetDetail from './components/AssetDetail';
import Auth from './components/Auth';
import { UserProfile } from './types';
import LandingPage from './components/LandingPage';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            currency: 'USD',
          };
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <div className="text-accent text-xs uppercase tracking-[0.3em] animate-pulse font-bold">MARKETLENS INITIALIZING...</div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {!user ? (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <Route element={<Layout user={user} profile={profile} />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/explorer" element={<MarketExplorer />} />
              <Route path="/explorer/:type/:symbol" element={<AssetDetail />} />
              <Route path="/news" element={<NewsFeed />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          )}
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
