import React, { useEffect, useState } from 'react';
import { Sun, Moon, CheckSquare } from 'lucide-react';
import '../styles/global.css';

const Layout = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <a href="/" className="brand">
          <CheckSquare size={28} className="brand-icon" style={{ color: 'var(--primary)' }} />
          <h1>Ziptrrip Tasks</h1>
        </a>
        <button 
          onClick={toggleTheme} 
          className="theme-toggle" 
          aria-label="Toggle light/dark theme"
          title="Toggle light/dark theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      <main className="app-container">
        {children}
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Ziptrrip Tasks.</p>
      </footer>
    </div>
  );
};

export default Layout;
