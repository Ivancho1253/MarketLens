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
  professionalExecution: {
    es: 'Ejecución Profesional',
    en: 'Professional Execution',
    pt: 'Execução Profissional'
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
