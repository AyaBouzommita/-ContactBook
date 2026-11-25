import React from 'react';
import Header from './components/Header';
import UserList from './components/UserList';

function App() {
  return (
    <>
      {/* Pattern de fond micro-grid subtile */}
      <div className="bg-grid-pattern" aria-hidden="true"></div>

      <div className="app-container">
        {/* En-tête futuriste avec Glassmorphism & status live */}
        <Header />

        {/* Composant principal UserList (TP N°7) */}
        <main>
          <UserList />
        </main>

        {/* Footer moderne */}
        <footer className="app-footer">
          <p>
            <strong>ContactBook SaaS</strong> • TP N°7 : Consommation d’une API avec React et Axios
          </p>
          <p style={{ marginTop: '0.4rem', fontSize: '0.8rem' }}>
            Flux de données REST :{' '}
            <a
              href="https://jsonplaceholder.typicode.com/users"
              target="_blank"
              rel="noopener noreferrer"
            >
              jsonplaceholder.typicode.com/users
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
