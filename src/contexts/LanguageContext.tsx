import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en' | 'pt';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  // Landing
  heroTitle: {
    es: 'Rastrea mercados. Muévete más rápido.',
    en: 'Track markets. Move faster.',
    pt: 'Rastreie mercados. Mova-se mais rápido.'
  },
  heroSub: {
    es: 'Análisis de portafolio de grado institucional e inteligencia de mercado en tiempo real. La terminal definitiva para traders de alto rendimiento.',
    en: 'Institutional-grade portfolio analysis and real-time market intelligence. The ultimate terminal for high-performance traders.',
    pt: 'Análise de portfólio de nível institucional e inteligência de mercado em tempo real. O terminal definitivo para traders de alto desempenho.'
  },
  getStarted: {
    es: 'Empezar Ahora',
    en: 'Get Started Now',
    pt: 'Começar Agora'
  },
  launchApp: {
    es: 'Lanzar App',
    en: 'Launch App',
    pt: 'Lançar App'
  },
  features: {
    es: 'Características',
    en: 'Features',
    pt: 'Recursos'
  },
  intelligence: {
    es: 'Inteligencia',
    en: 'Intelligence',
    pt: 'Inteligência'
  },
  terminal: {
    es: 'Terminal',
    en: 'Terminal',
    pt: 'Terminal'
  },
  predictiveInsights: {
    es: 'Insights Predictivos',
    en: 'Predictive Insights',
    pt: 'Insights Preditivos'
  },
  predictiveDesc: {
    es: 'Nuestro motor de inteligencia artificial procesa millones de puntos de datos para brindarte una ventaja injusta.',
    en: 'Our AI engine processes millions of data points to give you an unfair advantage.',
    pt: 'Nosso motor de IA processa milhões de pontos de dados para lhe dar uma vantagem injusta.'
  },
  professionalExecution: {
    es: 'Ejecución Profesional',
    en: 'Professional Execution',
    pt: 'Execução Profissional'
  },
  marketCap: {
    es: 'Capitalización',
    en: 'Market Cap',
    pt: 'Valor de Mercado'
  },
  volume: {
    es: 'Volumen',
    en: 'Volume',
    pt: 'Volume'
  },
  dominance: {
    es: 'Dominancia',
    en: 'Dominance',
    pt: 'Dominância'
  },
  dominateMarket: {
    es: 'Todo lo que necesitas para dominar el mercado.',
    en: 'Everything you need to dominate the market.',
    pt: 'Tudo o que você precisa para dominar o mercado.'
  },
  advAnalyticsTitle: {
    es: 'Análisis Avanzado',
    en: 'Advanced Analytics',
    pt: 'Análise Avançada'
  },
  advAnalyticsDesc: {
    es: 'Profundiza en las métricas del mercado con nuestro motor de análisis propietario.',
    en: 'Deep dive into market metrics with our proprietary analysis engine.',
    pt: 'Mergulhe nas métricas do mercado com nosso motor de análise proprietário.'
  },
  globalCoverageTitle: {
    es: 'Cobertura Global',
    en: 'Global Coverage',
    pt: 'Cobertura Global'
  },
  globalCoverageDesc: {
    es: 'Rastrea acciones, criptomonedas y mercados de predicción de todo el mundo.',
    en: 'Track stocks, crypto, and prediction markets from around the world.',
    pt: 'Rastreie ações, criptomoedas e mercados de previsão de todo o mundo.'
  },
  aiInsightsTitle: {
    es: 'Perspectivas IA',
    en: 'AI Insights',
    pt: 'Insights de IA'
  },
  aiInsightsDesc: {
    es: 'Aprovecha el aprendizaje automático para identificar patrones antes de que ocurran.',
    en: 'Leverage machine learning to identify patterns before they happen.',
    pt: 'Aproveite o aprendizado de máquina para identificar padrões antes que aconteçam.'
  },
  realtimeDataTitle: {
    es: 'Datos en Tiempo Real',
    en: 'Real-time Data',
    pt: 'Dados em Tempo Real'
  },
  realtimeDataDesc: {
    es: 'Feeds de datos con precisión de milisegundos para la visión más precisa del mercado.',
    en: 'Millisecond precision data feeds for the most accurate market view.',
    pt: 'Feeds de dados com precisão de milissegundos para a visão de mercado mais precisa.'
  },
  coreIntelligence: {
    es: 'Inteligencia Central',
    en: 'Core Intelligence',
    pt: 'Inteligência Central'
  },
  dominateMarketText: {
    es: 'Todo lo que necesitas para <span class="text-accent">dominar</span> el mercado.',
    en: 'Everything you need to <span class="text-accent">dominate</span> the market.',
    pt: 'Tudo o que você precisa para <span class="text-accent">dominar</span> o mercado.'
  },
  stopJuggling: {
    es: 'Deja de hacer malabares con múltiples herramientas. MarketLens combina seguimiento de portafolio, análisis en tiempo real y ejecución en una interfaz fluida.',
    en: 'Stop juggling multiple tools. MarketLens combines portfolio tracking, real-time analytics, and execution in one seamless interface.',
    pt: 'Pare de fazer malabarismos com várias ferramentas. O MarketLens combina rastreamento de portfólio, análises em tempo real e execução em uma interface perfeita.'
  },
  smartWalletTrackingTitle: {
    es: 'Seguimiento de Billetera Inteligente',
    en: 'Smart Wallet Tracking',
    pt: 'Rastreamento de Carteira Inteligente'
  },
  smartWalletTrackingDesc: {
    es: 'Monitorea todos tus activos en múltiples cadenas e intercambios en tiempo real.',
    en: 'Monitor all your assets across multiple chains and exchanges in real-time.',
    pt: 'Monitore todos os seus ativos em várias cadeias e exchanges em tempo real.'
  },
  instantExecutionTitle: {
    es: 'Ejecución Instantánea',
    en: 'Instant Execution',
    pt: 'Execução Instantânea'
  },
  instantExecutionDesc: {
    es: 'Ejecuta operaciones con latencia mínima directamente desde tu terminal de análisis.',
    en: 'Execute trades with minimal latency directly from your analysis terminal.',
    pt: 'Execute negociações com latência mínima diretamente do seu terminal de análise.'
  },
  institutionalSecurityTitle: {
    es: 'Seguridad Institucional',
    en: 'Institutional Security',
    pt: 'Segurança Institucional'
  },
  institutionalSecurityDesc: {
    es: 'Tus datos están encriptados y protegidos por protocolos de seguridad líderes en la industria.',
    en: 'Your data is encrypted and protected by industry-leading security protocols.',
    pt: 'Seus dados são criptografados e protegidos por protocolos de segurança líderes do setor.'
  },
  // Auth
  backToLanding: {
    es: 'Volver a la Landing',
    en: 'Back to Landing',
    pt: 'Voltar para a Landing'
  },
  systemAccess: {
    es: 'Acceso al Sistema',
    en: 'System Access',
    pt: 'Acesso ao Sistema'
  },
  createAccount: {
    es: 'Crear Cuenta',
    en: 'Create Account',
    pt: 'Criar Conta'
  },
  emailLabel: {
    es: 'Correo Electrónico',
    en: 'Email Address',
    pt: 'Endereço de Email'
  },
  passwordLabel: {
    es: 'Contraseña',
    en: 'Password',
    pt: 'Senha'
  },
  signIn: {
    es: 'Iniciar Sesión',
    en: 'Sign In',
    pt: 'Entrar'
  },
  register: {
    es: 'Registrarse',
    en: 'Register',
    pt: 'Registrar'
  },
  orContinueWith: {
    es: 'O continuar con',
    en: 'Or continue with',
    pt: 'Ou continuar com'
  },
  noAccount: {
    es: '¿No tienes cuenta?',
    en: "Don't have an account?",
    pt: 'Não tem uma conta?'
  },
  haveAccount: {
    es: '¿Ya tienes cuenta?',
    en: 'Already have an account?',
    pt: 'Já tem uma conta?'
  },
  registerNow: {
    es: 'Regístrate ahora',
    en: 'Register now',
    pt: 'Registre-se agora'
  },
  signInNow: {
    es: 'Inicia sesión',
    en: 'Sign in',
    pt: 'Entrar agora'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'es';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
