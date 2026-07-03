import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Nota: Si vas a usar italiano como dice tu sitemap, debes añadir 'it' aquí: 'de' | 'fr' | 'it'
export type Language = 'de' | 'fr';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    // 1. PRIORIDAD SEO: Revisar la URL actual primero
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/fr')) return 'fr';
      if (path.startsWith('/de')) return 'de';
      // Si añades italiano: if (path.startsWith('/it')) return 'it';
    }

    // 2. Si entra a la raíz (/), miramos si tiene preferencia guardada
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_language');
      if (saved === 'de' || saved === 'fr') return saved;
    }

    // 3. Fallback por defecto
    return 'de';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app_language', newLang);
    
    // Opcional pero recomendado: Si el usuario cambia el idioma desde un selector, 
    // lo ideal sería redirigirlo a la URL correcta. Por ejemplo:
    // window.location.pathname = `/${newLang}${window.location.pathname.substring(3)}`;
  };

  useEffect(() => {
    // Esto está perfecto, se mantendrá sincronizado con el estado
    document.documentElement.lang = lang === 'de' ? 'de-CH' : 'fr-CH';
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
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