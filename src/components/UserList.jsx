import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import UserCard from './UserCard';
import ContactModal from './ContactModal';
import { 
  Search, 
  X, 
  RefreshCw, 
  AlertTriangle, 
  Users, 
  Filter, 
  Download, 
  Star, 
  LayoutGrid, 
  List, 
  Building2, 
  MapPin, 
  Sparkles, 
  Bug,
  Globe,
  ArrowUpDown,
  Mail,
  Phone
} from 'lucide-react';

/**
 * Composant UserList (TP N°7)
 * Implémente rigoureusement l'ensemble des questions Q3 -> Q12 :
 * - Q3: Composant UserList
 * - Q4: État users initialisé à []
 * - Q5: useEffect() pour GET au chargement
 * - Q6: Axios & response.data
 * - Q7: map() pour afficher les utilisateurs
 * - Q8: UserCard avec props
 * - Q9: Message « Chargement des contacts… »
 * - Q10: Gestion des erreurs avec message explicite
 * - Q11: Filtrage par nom
 * - Q12: Nombre total de contacts
 * 
 * + Bonus UI Ultra-Moderne :
 * - Grille Bento ou Vue Tableau compacte
 * - Raccourci clavier (focus recherche)
 * - Statistiques dynamiques SaaS
 * - Exportation CSV
 * - Test de l'erreur réseau en direct
 */
function UserList() {
  // Q4: Déclaration de l'état users initialisé à un tableau vide
  const [users, setUsers] = useState([]);

  // Q9: État de chargement
  const [loading, setLoading] = useState(true);

  // Q10: État d'erreur
  const [error, setError] = useState(null);

  // Q11: Champ de recherche par nom
  const [searchTerm, setSearchTerm] = useState('');

  // Bonus UX modernes
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'table'
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [sortBy, setSortBy] = useState('name-asc');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('contactbook_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedUserModal, setSelectedUserModal] = useState(null);
  const [simulateError, setSimulateError] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const searchInputRef = useRef(null);

  // Toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Toggle Favoris
  const handleToggleFavorite = (userId) => {
    setFavorites((prev) => {
      const updated = prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];
      try {
        localStorage.setItem('contactbook_favorites', JSON.stringify(updated));
      } catch (e) {
        console.error('LocalStorage error', e);
      }
      return updated;
    });
  };

  // Q5 & Q6: Récupération des données via Axios dans useEffect()
  const fetchUsers = async (forceSimulateError = false) => {
    setLoading(true);
    setError(null);

    try {
      // URL officielle du sujet du TP
      const apiUrl = forceSimulateError
        ? 'https://jsonplaceholder.typicode.com/invalid-test-endpoint-404'
        : 'https://jsonplaceholder.typicode.com/users';

      // Q6: Requête Axios GET
      const response = await axios.get(apiUrl);

      // Q6: Stockage dans l'état users via response.data
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      // Q10: Gestion de l'erreur si la requête échoue
      console.error('Erreur API:', err);
      setError('Les contacts n’ont pas pu être récupérés. Veuillez vérifier la connexion ou l’URL du service.');
      setLoading(false);
    }
  };

  // Q5: useEffect() exécuté au premier affichage du composant
  useEffect(() => {
    fetchUsers(simulateError);
  }, [simulateError]);

  // Villes uniques déduites dynamiquement
  const cities = useMemo(() => {
    const list = Array.from(new Set(users.map((u) => u.address?.city).filter(Boolean))).sort();
    return ['ALL', ...list];
  }, [users]);

  // Q11 & Bonus : Filtrage par nom, ville, favoris et tri
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        // Q11: Filtrer les contacts par nom
        const matchName = user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCity = selectedCity === 'ALL' || user.address?.city === selectedCity;
        const matchFav = !onlyFavorites || favorites.includes(user.id);
        return matchName && matchCity && matchFav;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'company-asc') return (a.company?.name || '').localeCompare(b.company?.name || '');
        return 0;
      });
  }, [users, searchTerm, selectedCity, onlyFavorites, favorites, sortBy]);

  // Export JSON (Bonus dev)
  const exportToJSON = () => {
    if (filteredUsers.length === 0) return;
    const jsonStr = JSON.stringify(filteredUsers, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ContactBook_Data_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Export JSON téléchargé avec succès !');
  };
  const formatPhoneForExcel = (phone) => {
    if (!phone) return '';
    // Nettoie les extensions complexes ex: "1-770-736-8031 x56442"
    return phone.replace(/[^\d+()\-\.\s]/g, ' ').trim();
  };

  // Export CSV compatible 100% avec Microsoft Excel (BOM UTF-8 + Séparateur point-virgule ';')
  const exportToCSV = () => {
    if (filteredUsers.length === 0) return;

    // Délimiteur point-virgule ';' indispensable pour Excel en version française/européenne
    const DELIMITER = ';';

    const headers = [
      'ID',
      'Nom complet',
      'Adresse E-mail',
      'Téléphone',
      'Ville',
      'Adresse postale',
      'Entreprise',
      'Site Web'
    ];

    const escapeCell = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""'); // Échappement des guillemets
      return `"${str}"`;
    };

    const rows = filteredUsers.map((u) => [
      escapeCell(u.id),
      escapeCell(u.name),
      escapeCell(u.email),
      escapeCell(formatPhoneForExcel(u.phone)),
      escapeCell(u.address?.city || ''),
      escapeCell(`${u.address?.street || ''}, ${u.address?.suite || ''}`),
      escapeCell(u.company?.name || ''),
      escapeCell(u.website ? `https://${u.website}` : '')
    ]);

    // Assemblage avec point-virgule
    const csvRows = [
      headers.map(escapeCell).join(DELIMITER),
      ...rows.map((row) => row.join(DELIMITER))
    ];

    const csvContent = csvRows.join('\r\n');

    // Ajout du BOM UTF-8 (\uFEFF) : Indispensable pour qu'Excel reconnaisse les accents (é, è, etc.)
    const blob = new Blob(['\uFEFF' + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ContactBook_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Export Excel (.CSV) généré avec succès avec colonnes séparées !');
  };

  return (
    <div className="user-list-wrapper">
      {/* ========================================================
          Q12 & STATISTIQUES BENTO HAUT DE PAGE
          ======================================================== */}
      <div className="bento-stats-grid">
        {/* Q12: Total des contacts récupérés */}
        <div className="bento-stat-card">
          <div className="stat-left">
            <span className="stat-tag">Total Contacts (Q12)</span>
            <div className="stat-number">{users.length}</div>
          </div>
          <div className="stat-glow-icon" style={{ '--icon-color': 'var(--accent-primary)', '--icon-bg': 'rgba(99, 102, 241, 0.15)' }}>
            <Users size={24} />
          </div>
        </div>

        {/* Contacts filtrés actifs */}
        <div className="bento-stat-card">
          <div className="stat-left">
            <span className="stat-tag">Contacts Affichés</span>
            <div className="stat-number">{filteredUsers.length}</div>
          </div>
          <div className="stat-glow-icon" style={{ '--icon-color': 'var(--accent-cyan)', '--icon-bg': 'rgba(6, 182, 212, 0.15)' }}>
            <Filter size={24} />
          </div>
        </div>

        {/* Entreprises partenaires uniques */}
        <div className="bento-stat-card">
          <div className="stat-left">
            <span className="stat-tag">Entreprises Clientes</span>
            <div className="stat-number">
              {new Set(users.map((u) => u.company?.name).filter(Boolean)).size}
            </div>
          </div>
          <div className="stat-glow-icon" style={{ '--icon-color': 'var(--accent-violet)', '--icon-bg': 'rgba(168, 85, 247, 0.15)' }}>
            <Building2 size={24} />
          </div>
        </div>

        {/* Favoris enregistrés */}
        <div className="bento-stat-card">
          <div className="stat-left">
            <span className="stat-tag">Favoris Épinglés</span>
            <div className="stat-number">{favorites.length}</div>
          </div>
          <div className="stat-glow-icon" style={{ '--icon-color': 'var(--accent-amber)', '--icon-bg': 'rgba(245, 158, 11, 0.15)' }}>
            <Star size={24} fill="currentColor" />
          </div>
        </div>
      </div>

      {/* ========================================================
          BARRE DE COMMANDE SPOTLIGHT (Recherche Q11 & Filtres)
          ======================================================== */}
      <div className="command-bar">
        <div className="command-bar-row">
          {/* Q11: Champ de recherche permettant de filtrer les contacts par nom */}
          <div className="spotlight-search-wrapper">
            <Search size={18} className="spotlight-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="spotlight-input"
              placeholder="Rechercher par nom de contact... (Q11)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Recherche par nom"
            />
            {searchTerm ? (
              <button 
                type="button" 
                className="search-clear-btn" 
                onClick={() => setSearchTerm('')}
                title="Effacer la recherche"
              >
                <X size={16} />
              </button>
            ) : null}
          </div>

          {/* Contrôles interactifs */}
          <div className="controls-group">
            {/* Filtre par Ville */}
            <select
              className="select-futuristic"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="ALL">Villes : Toutes ({cities.length - 1})</option>
              {cities.filter(c => c !== 'ALL').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Tri */}
            <select
              className="select-futuristic"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name-asc">Nom (A → Z)</option>
              <option value="name-desc">Nom (Z → A)</option>
              <option value="company-asc">Société (A → Z)</option>
            </select>

            {/* Toggle Favoris */}
            <button
              type="button"
              className={`btn-glass ${onlyFavorites ? 'active' : ''}`}
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              style={onlyFavorites ? { borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' } : {}}
            >
              <Star size={15} fill={onlyFavorites ? 'currentColor' : 'none'} />
              <span>Favoris ({favorites.length})</span>
            </button>

            {/* Bascule Grille / Tableau */}
            <div className="view-mode-toggle">
              <button
                type="button"
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Affichage en Grille Bento"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Affichage en Tableau compact"
              >
                <List size={16} />
              </button>
            </div>

            {/* Export Excel (CSV) */}
            <button
              type="button"
              className="btn-glass"
              onClick={exportToCSV}
              disabled={filteredUsers.length === 0}
              title="Exporter vers Excel avec colonnes séparées et accents propres"
            >
              <Download size={15} color="var(--accent-emerald)" />
              <span>Export Excel</span>
            </button>

            {/* Export JSON */}
            <button
              type="button"
              className="btn-glass"
              onClick={exportToJSON}
              disabled={filteredUsers.length === 0}
              title="Exporter les données brutes en JSON"
            >
              <Download size={15} color="var(--accent-cyan)" />
              <span>JSON</span>
            </button>

            {/* Bouton Actualiser */}
            <button
              type="button"
              className="btn-neon"
              onClick={() => {
                setSimulateError(false);
                fetchUsers(false);
              }}
              title="Recharger les données"
            >
              <RefreshCw size={15} className={loading ? 'ring-spinner' : ''} />
              <span>Actualiser</span>
            </button>

            {/* Bouton de test Erreur Réseau (Q10) */}
            <button
              type="button"
              className="btn-test-error"
              onClick={() => setSimulateError(!simulateError)}
              title="Simule une erreur de requête pour tester la question 10"
            >
              <Bug size={14} />
              <span>{simulateError ? 'Désactiver Erreur' : 'Test Erreur API (Q10)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          Q9: ÉTAT DE CHARGEMENT
          ======================================================== */}
      {loading && (
        <div className="loading-box-futuristic">
          <div className="ring-spinner"></div>
          {/* Message explicitement exigé à la question 9 du TP */}
          <h3 className="loading-label">Chargement des contacts…</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            Requête Axios GET vers https://jsonplaceholder.typicode.com/users
          </p>

          {/* Squelettes animés */}
          <div className="cards-grid" style={{ width: '100%', marginTop: '3rem' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-bento">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div className="skeleton-pulse" style={{ width: 62, height: 62, borderRadius: 18 }}></div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton-pulse" style={{ width: '70%', height: 18 }}></div>
                    <div className="skeleton-pulse" style={{ width: '40%', height: 14 }}></div>
                  </div>
                </div>
                <div className="skeleton-pulse" style={{ width: '90%', height: 38, marginTop: 12 }}></div>
                <div className="skeleton-pulse" style={{ width: '90%', height: 38 }}></div>
                <div className="skeleton-pulse" style={{ width: '90%', height: 38 }}></div>
                <div className="skeleton-pulse" style={{ width: '100%', height: 42, marginTop: 12 }}></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          Q10: GESTION DES ERREURS
          ======================================================== */}
      {!loading && error && (
        <div className="error-bento-card">
          <div className="error-badge-icon">
            <AlertTriangle size={32} />
          </div>
          {/* Message de la Question 10 */}
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-rose)', marginBottom: '0.5rem' }}>
            Erreur de récupération
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            {error}
          </p>
          <button
            type="button"
            className="btn-neon"
            onClick={() => {
              setSimulateError(false);
              fetchUsers(false);
            }}
          >
            <RefreshCw size={16} />
            <span>Réessayer de récupérer les contacts</span>
          </button>
        </div>
      )}

      {/* Aucun résultat */}
      {!loading && !error && filteredUsers.length === 0 && (
        <div className="error-bento-card" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}>
          <Users size={40} color="var(--text-dim)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Aucun contact trouvé
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Aucun contact ne correspond au critère de recherche « {searchTerm} ».
          </p>
          <button
            type="button"
            className="btn-glass"
            onClick={() => {
              setSearchTerm('');
              setSelectedCity('ALL');
              setOnlyFavorites(false);
            }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* ========================================================
          Q7 & Q8: AFFICHAGE DE LA LISTE AVEC map() & UserCard
          ======================================================== */}
      {!loading && !error && filteredUsers.length > 0 && (
        viewMode === 'grid' ? (
          <div className="cards-grid">
            {/* Q7: Utiliser map() pour parcourir le tableau users */}
            {filteredUsers.map((user) => (
              /* Q8: Composant UserCard avec transmission des props */
              <UserCard
                key={user.id}
                user={user}
                isFavorite={favorites.includes(user.id)}
                onToggleFavorite={handleToggleFavorite}
                onSelectUser={(u) => setSelectedUserModal(u)}
                showToast={showToast}
              />
            ))}
          </div>
        ) : (
          /* Vue Tableau Compact (Bonus moderne) */
          <div className="table-container-modern">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Entreprise</th>
                  <th>E-mail</th>
                  <th>Téléphone</th>
                  <th>Ville</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div 
                          className="futuristic-avatar" 
                          style={{ width: 38, height: 38, fontSize: '0.85rem', borderRadius: 10, background: 'var(--accent-primary)' }}
                        >
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{user.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>@{user.username || 'user'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="company-chip" style={{ fontSize: '0.725rem' }}>
                        {user.company?.name || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <a href={`mailto:${user.email}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                        {user.email}
                      </a>
                    </td>
                    <td>
                      <a href={`tel:${user.phone}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                        {user.phone}
                      </a>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                        <MapPin size={13} color="var(--accent-primary)" />
                        {user.address?.city}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn-glass"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                        onClick={() => setSelectedUserModal(user)}
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Modal Fiche Détaillée */}
      {selectedUserModal && (
        <ContactModal
          user={selectedUserModal}
          onClose={() => setSelectedUserModal(null)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-bar-neon">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default UserList;
