import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

interface CompanyLogoProps {
  symbol: string;
  name: string;
  type?: 'stock' | 'crypto';
  className?: string;
  imgClassName?: string;
}

export default function CompanyLogo({ symbol, name, type = 'stock', className = '', imgClassName = '' }: CompanyLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLogo = async () => {
      if (!symbol) return;

      if (type === 'crypto') {
        setLogoUrl(`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${symbol.toLowerCase()}.png`);
        return;
      }

      try {
        // Try Twelve Data Logo API
        const response = await fetch(`/api/market/logo?symbol=${symbol}`);
        const data = await response.json();
        
        if (data.url) {
          setLogoUrl(data.url);
        } else {
          // Fallback 1: Clearbit with ticker (common for big companies)
          const tickerUrl = `https://logo.clearbit.com/${symbol.toLowerCase()}.com`;
          setLogoUrl(tickerUrl);
        }
      } catch (e) {
        // Fallback 2: Clearbit with first word of name
        if (name) {
          const nameUrl = `https://logo.clearbit.com/${name.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com`;
          setLogoUrl(nameUrl);
        }
      }
    };

    fetchLogo();
  }, [symbol, name, type]);

  if (error || (!logoUrl && !error)) {
    return (
      <div className={`flex items-center justify-center bg-accent/10 rounded-xl ${className}`}>
        <TrendingUp className="w-1/2 h-1/2 text-accent" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center bg-bg border border-border-accent rounded-xl overflow-hidden ${className}`}>
      <img
        src={logoUrl!}
        alt={symbol}
        className={`object-contain transition-all duration-500 ${imgClassName}`}
        onError={() => {
          if (logoUrl?.includes('clearbit')) {
            // Last resort: Finnhub
            setLogoUrl(`https://static2.finnhub.io/logo/${symbol}.png`);
          } else {
            setError(true);
          }
        }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
