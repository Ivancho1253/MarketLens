import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Proxy for Twelve Data
  app.get("/api/market/price", async (req, res) => {
    const { symbol } = req.query;
    const apiKey = process.env.TWELVE_DATA_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: "Twelve Data API key missing" });
    }

    try {
      const response = await axios.get(`https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch price" });
    }
  });

  app.get("/api/market/time_series", async (req, res) => {
    const { symbol, interval } = req.query;
    const apiKey = process.env.TWELVE_DATA_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Twelve Data API key missing" });
    }

    try {
      const response = await axios.get(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval || '1h'}&apikey=${apiKey}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch time series" });
    }
  });

  app.get("/api/market/logo", async (req, res) => {
    const { symbol } = req.query;
    const apiKey = process.env.TWELVE_DATA_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API key missing" });
    try {
      const response = await axios.get(`https://api.twelvedata.com/logo?symbol=${symbol}&apikey=${apiKey}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch logo" });
    }
  });

  const SP500_SYMBOLS = [
    'AAPL', 'MSFT', 'AMZN', 'NVDA', 'GOOGL', 'GOOG', 'META', 'TSLA', 'BRK.B', 'UNH',
    'JPM', 'XOM', 'LLY', 'JNJ', 'V', 'PG', 'MA', 'AVGO', 'HD', 'CVX', 'MRK', 'ABBV',
    'COST', 'PEP', 'ADBE', 'KO', 'WMT', 'TMO', 'MCD', 'CSCO', 'CRM', 'PFE', 'BAC',
    'ACN', 'ABT', 'LIN', 'ORCL', 'AMD', 'NFLX', 'DIS', 'TXN', 'PM', 'INTC', 'VZ',
    'NEE', 'UPS', 'RTX', 'LOW', 'HON', 'COP', 'UNP', 'CAT', 'IBM', 'MS', 'AMAT',
    'GE', 'INTU', 'GS', 'DE', 'PLD', 'AXP', 'SBUX', 'BKNG', 'EL', 'MDLZ', 'GILD',
    'ISRG', 'TJX', 'ADI', 'LMT', 'SYK', 'VRTX', 'REGN', 'AMT', 'ZTS', 'MMC', 'CB',
    'PANW', 'LRCX', 'CI', 'BSX', 'MU', 'SLB', 'C', 'BDX', 'ETN', 'FI', 'ITW', 'SNPS',
    'CDNS', 'EOG', 'WM', 'CVS', 'MO', 'T', 'ICE', 'CL', 'SHW', 'APD', 'MCK', 'ORLY',
    'PH', 'EMR', 'MAR', 'APH', 'CTAS', 'NXPI', 'ROP', 'MCO', 'ADP', 'AIG', 'TT', 'TEL',
    'ECL', 'MSI', 'COF', 'CARR', 'AZO', 'DHR', 'A', 'MDT', 'EW', 'SYY', 'HUM', 'MET',
    'GD', 'TGT', 'HCA', 'MPC', 'VLO', 'PSX', 'BKR', 'KMB', 'AON', 'AJG', 'TRV', 'PGR',
    'ALL', 'PRU', 'AFL', 'SPGI', 'NSC', 'CSX', 'FDX', 'D', 'SO', 'DUK', 'AEP', 'SRE',
    'PCG', 'EXC', 'XEL', 'ED', 'PEG', 'WEC', 'AWK', 'EIX', 'FE', 'ETR', 'DTE', 'ES',
    'LNT', 'CMS', 'ATO', 'NI', 'PNW', 'NRG', 'AES', 'CNP', 'VMC', 'MLM', 'FAST', 'URI',
    'PWR', 'CMI', 'PCAR', 'DOV', 'XYL', 'AME', 'ROK', 'OTIS', 'IR', 'HUBB', 'GWW', 'RSG',
    'STLD', 'NUE', 'FCX', 'NEM', 'CTVA', 'CF', 'MOS', 'FMC', 'ALB', 'IFF', 'DOW', 'LYB',
    'CE', 'EMN', 'PPG', 'SHW', 'RPM', 'DD', 'VLY', 'KEY', 'HBAN', 'FITB', 'RF', 'CFG',
    'CMA', 'ZION', 'TFC', 'USB', 'PNC', 'MTB', 'STT', 'BK', 'IVZ', 'BEN', 'AMP', 'TROW',
    'SCHW', 'RJF', 'LPLA', 'GS', 'MS', 'AXP', 'COF', 'DFS', 'SYF', 'V', 'MA', 'FI',
    'FIS', 'JKHY', 'GPN', 'PYPL', 'ADBE', 'ORCL', 'CRM', 'INTU', 'NOW', 'SNPS', 'CDNS',
    'ROP', 'ANSS', 'PTC', 'TYL', 'AKAM', 'VRSN', 'GEN', 'FIVN', 'NET', 'DDOG', 'MDB',
    'ZS', 'OKTA', 'PANW', 'FTNT', 'CRWD', 'CHKP', 'CSCO', 'MSI', 'JNPR', 'FFIV', 'FSLR',
    'ENPH', 'SEDG', 'TER', 'LRCX', 'AMAT', 'KLAC', 'ASML', 'TSM', 'AMD', 'NVDA', 'INTC',
    'TXN', 'ADI', 'MU', 'NXPI', 'MCHP', 'ON', 'QRVO', 'SWKS', 'AVGO', 'QCOM', 'MRVL',
    'MPWR', 'ALGN', 'IDXX', 'ZTS', 'VRTX', 'REGN', 'GILD', 'AMGN', 'BIIB', 'MRNA',
    'ILMN', 'TECH', 'DXCM', 'PODD', 'TMO', 'DHR', 'A', 'WAT', 'MTD', 'RVTY', 'IQV',
    'CRL', 'WST', 'STE', 'BAX', 'BDX', 'ZBH', 'SYK', 'BSX', 'EW', 'MDT', 'ABT', 'ISRG',
    'RMD', 'RES', 'HWM', 'TDG', 'LMT', 'NOC', 'GD', 'RTX', 'BA', 'GE', 'HON', 'MMM',
    'CAT', 'DE', 'PCAR', 'CMI', 'ITW', 'EMR', 'PH', 'ROK', 'AME', 'DOV', 'XYL', 'OTIS',
    'CARR', 'TT', 'IR', 'HUBB', 'FAST', 'GWW', 'URI', 'PWR', 'NSC', 'CSX', 'UNP', 'FDX',
    'UPS', 'MAR', 'HLT', 'SBUX', 'YUM', 'MCD', 'DRI', 'CMG', 'DPZ', 'BKNG', 'EXPE',
    'ABNB', 'RCL', 'CCL', 'NCLH', 'LVS', 'MGM', 'WYNN', 'CZR', 'PENN', 'DKNG', 'TSLA',
    'F', 'GM', 'STLA', 'RIVN', 'LCID', 'NIO', 'BYDDF', 'LI', 'XPEV', 'HMC', 'TM',
    'VWAGY', 'BMWYY', 'MBGYY', 'RACE', 'TSLA', 'AMZN', 'EBAY', 'ETSY', 'WMT', 'TGT',
    'COST', 'TJX', 'ROST', 'DLTR', 'DG', 'LOW', 'HD', 'ORLY', 'AZO', 'BBY', 'TSCO',
    'HD', 'LOW', 'LEN', 'DHI', 'PHM', 'NVR', 'TOL', 'MTH', 'TMHC', 'KBH', 'GRBK',
    'MDC', 'LGIH', 'CCS', 'SHW', 'PPG', 'RPM', 'DD', 'CE', 'EMN', 'IFF', 'ALB', 'FMC',
    'MOS', 'CF', 'CTVA', 'NEM', 'FCX', 'NUE', 'STLD', 'RSG', 'WM', 'VMC', 'MLM', 'EXP',
    'SUM', 'JCI', 'ALLE', 'FBHS', 'AOS', 'MAS', 'MHK', 'TTC', 'GIC', 'WMS', 'FIX',
    'EME', 'DY', 'MTZ', 'AECOM', 'KBR', 'ACM', 'TTEK', 'STV', 'VRSK', 'MCO', 'SPGI',
    'MSCI', 'FDS', 'INFO', 'TRI', 'RELX', 'LDOS', 'SAIC', 'BAH', 'CACI', 'MANT',
    'KBR', 'VRTU', 'EPAM', 'GLOB', 'ACN', 'CTSH', 'INFY', 'WIT', 'TCS', 'HCLTECH'
  ];

  app.get("/api/market/stocks", async (req, res) => {
    const apiKey = process.env.TWELVE_DATA_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API key missing" });
    try {
      // Fetch NASDAQ and NYSE stocks to cover S&P 500
      const [nasdaqRes, nyseRes] = await Promise.all([
        axios.get(`https://api.twelvedata.com/stocks?exchange=NASDAQ&apikey=${apiKey}`),
        axios.get(`https://api.twelvedata.com/stocks?exchange=NYSE&apikey=${apiKey}`)
      ]);

      const allStocks = [...(nasdaqRes.data.data || []), ...(nyseRes.data.data || [])];
      
      // Filter for S&P 500 symbols
      const sp500Stocks = allStocks.filter(stock => SP500_SYMBOLS.includes(stock.symbol));
      
      // Sort to match our priority list order
      sp500Stocks.sort((a, b) => SP500_SYMBOLS.indexOf(a.symbol) - SP500_SYMBOLS.indexOf(b.symbol));

      res.json({ data: sp500Stocks });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stocks" });
    }
  });

  app.get("/api/market/cryptos", async (req, res) => {
    const apiKey = process.env.TWELVE_DATA_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API key missing" });
    try {
      const response = await axios.get(`https://api.twelvedata.com/cryptocurrencies?apikey=${apiKey}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cryptos" });
    }
  });

  // API Proxy for NewsAPI
  app.get("/api/news", async (req, res) => {
    const { q } = req.query;
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "NewsAPI key missing" });
    }

    try {
      const response = await axios.get(`https://newsapi.org/v2/everything?q=${q || 'finance'}&sortBy=publishedAt&apiKey=${apiKey}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
