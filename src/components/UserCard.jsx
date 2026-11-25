import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  ExternalLink, 
  Star, 
  Copy, 
  Check, 
  Globe,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

const AVATAR_PALETTES = [
  { bg: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)', bar: 'linear-gradient(90deg, #6366f1, #3b82f6)' },
  { bg: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', bar: 'linear-gradient(90deg, #8b5cf6, #ec4899)' },
  { bg: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', bar: 'linear-gradient(90deg, #06b6d4, #3b82f6)' },
  { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', bar: 'linear-gradient(90deg, #10b981, #06b6d4)' },
  { bg: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', bar: 'linear-gradient(90deg, #f59e0b, #ef4444)' },
  { bg: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', bar: 'linear-gradient(90deg, #ec4899, #8b5cf6)' },
];

/**
 * Composant UserCard (Question 8)
 * Affiche toutes les informations obligatoires :
 * - name, email, phone, address.city, company.name
 * 
 * Présentation : Bento Card haute fidélité SaaS
 */
function UserCard({ user, onSelectUser, isFavorite, onToggleFavorite, showToast }) {
  const [copied, setCopied] = useState(false);

  // Initiales stylisées (ex: "Leanne Graham" -> "LG")
  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join('');
  };

  const palette = AVATAR_PALETTES[(user.id || 0) % AVATAR_PALETTES.length];

  const handleCopyContact = (e) => {
    e.stopPropagation();
    const contactInfo = `${user.name} — ${user.email} — ${user.phone} (${user.company?.name || ''})`;
    navigator.clipboard.writeText(contactInfo).then(() => {
      setCopied(true);
      if (showToast) showToast(`Coordonnées de ${user.name} copiées au presse-papier !`);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div 
      className="bento-card"
      style={{ '--card-glow-bar': palette.bar }}
    >
      <div>
        {/* En-tête : Avatar avec indicateur en ligne + Actions rapides */}
        <div className="card-header-flex">
          <div className="avatar-with-status">
            <div className="futuristic-avatar" style={{ background: palette.bg }}>
              {getInitials(user.name)}
            </div>
            <div className="avatar-badge-online" title="Statut actif"></div>
          </div>

          <div className="quick-actions-bar">
            {/* Bouton Favori */}
            <button
              type="button"
              className={`action-pill-btn ${isFavorite ? 'active-fav' : ''}`}
              title={isFavorite ? 'Retirer des favoris' : 'Marquer comme favori'}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(user.id);
              }}
            >
              <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>

            {/* Bouton Copier coordonnées */}
            <button
              type="button"
              className="action-pill-btn"
              title="Copier les coordonnées"
              onClick={handleCopyContact}
            >
              {copied ? <Check size={15} color="var(--accent-emerald)" /> : <Copy size={15} />}
            </button>
          </div>
        </div>

        {/* Identité : Nom & Entreprise (Q8) */}
        <div className="user-identity">
          <h3 className="user-full-name">
            <span>{user.name}</span>
          </h3>
          {user.company?.name && (
            <div className="company-chip">
              <Building2 size={13} />
              <span>{user.company.name}</span>
            </div>
          )}
        </div>

        {/* Détails du contact sous forme de tuiles specs (Q8) */}
        <div className="contact-specs">
          {/* Email */}
          <div className="spec-tile">
            <Mail size={16} className="spec-tile-icon" />
            <div className="spec-content">
              <span className="spec-label">E-mail professionnel</span>
              <a href={`mailto:${user.email}`} className="spec-value-link" title={user.email}>
                {user.email}
              </a>
            </div>
          </div>

          {/* Téléphone */}
          <div className="spec-tile">
            <Phone size={16} className="spec-tile-icon" />
            <div className="spec-content">
              <span className="spec-label">Téléphone</span>
              <a href={`tel:${user.phone}`} className="spec-value-link" title={user.phone}>
                {user.phone}
              </a>
            </div>
          </div>

          {/* Ville */}
          <div className="spec-tile">
            <MapPin size={16} className="spec-tile-icon" />
            <div className="spec-content">
              <span className="spec-label">Localisation</span>
              <span style={{ fontWeight: 600 }}>{user.address?.city || 'Non renseigné'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de la carte Bento : Actions interactives */}
      <div className="card-bottom-actions">
        <button
          type="button"
          className="btn-card-action btn-card-secondary"
          onClick={() => onSelectUser(user)}
        >
          <span>Fiche complète</span>
          <ArrowUpRight size={14} />
        </button>

        <a
          href={`mailto:${user.email}`}
          className="btn-card-action btn-card-primary"
        >
          <Mail size={14} />
          <span>Contacter</span>
        </a>
      </div>
    </div>
  );
}

export default UserCard;
