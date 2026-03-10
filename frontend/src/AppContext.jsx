import { createContext, useContext, useState, useEffect } from 'react';
import translations from './translations';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [lang, setLang] = useState(() => localStorage.getItem('sv-lang') || 'en');
    const [theme, setTheme] = useState(() => localStorage.getItem('sv-theme') || 'light');

    // Apply theme class to <html>
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('sv-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('sv-lang', lang);
    }, [lang]);

    const t = (key) => translations[lang]?.[key] || translations['en'][key] || key;

    const toggleLang = () => setLang(prev => prev === 'en' ? 'te' : 'en');
    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    return (
        <AppContext.Provider value={{ lang, theme, t, toggleLang, toggleTheme }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
