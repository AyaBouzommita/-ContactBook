import React, { useState, useEffect } from 'react';
import { BookUser, Sun, Moon, Sparkles, Layers, Activity } from 'lucide-react';

function Header() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('contactbook_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('contactbook_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-logo-hex">
          <BookUser size={26} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 className="brand-title">ContactBook</h1>
            <span className="pulse-badge">
              <span className="pulse-dot"></span>
              API LIVE 200 OK
            </span>
          </div>
          <div className="brand-meta">
            <span className="brand-subtitle">
              SaaS Directory • Consommation REST API JSONPlaceholder
            </span>
          </div>
        </div>
      </div>

      <div className="header-actions">
        <div className="btn-glass" style={{ cursor: 'default' }}>
          <Sparkles size={14} color="var(--accent-violet)" />
          <span>TP N°7 • React + Axios</span>
        </div>

        <button
          type="button"
          className="btn-glass btn-theme-toggle"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Basculer en Dark Mode' : 'Basculer en Light Mode'}
          aria-label="Basculer le thème"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="var(--accent-amber)" />}
        </button>
      </div>
    </header>
  );
}

export default Header;
