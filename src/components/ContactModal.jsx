import React from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Globe, 
  Compass, 
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

/**
 * Modal affichant la fiche détaillée complète d'un utilisateur (Bonus SaaS)
 */
function ContactModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-glass-container" onClick={(e) => e.stopPropagation()}>
        {/* En-tête */}
        <div className="modal-header-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <div 
              className="futuristic-avatar" 
              style={{ width: '48px', height: '48px', fontSize: '1.1rem', background: 'var(--gradient-brand)' }}
            >
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                {user.name}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                <span>@{user.username || 'user'}</span>
                <span>•</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>ID #{user.id}</span>
              </div>
            </div>
          </div>

          <button 
            type="button" 
            className="action-pill-btn" 
            onClick={onClose}
            aria-label="Fermer la fenêtre"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corps du modal */}
        <div className="modal-body-content">
          {/* Entreprise */}
          <div>
            <span className="spec-label" style={{ marginBottom: '0.6rem' }}>Entreprise & Activité</span>
            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '1.15rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                <Building2 size={18} color="var(--accent-cyan)" />
                <span>{user.company?.name || 'Entreprise non renseignée'}</span>
              </div>
              {user.company?.catchPhrase && (
                <p style={{ fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                  « {user.company.catchPhrase} »
                </p>
              )}
              {user.company?.bs && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {user.company.bs.split(' ').map((tag, i) => (
                    <span key={i} className="company-chip" style={{ fontSize: '0.7rem' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Coordonnées directes */}
          <div>
            <span className="spec-label" style={{ marginBottom: '0.6rem' }}>Coordonnées vérifiées</span>
            <div className="contact-specs">
              <div className="spec-tile">
                <Mail size={16} className="spec-tile-icon" />
                <div className="spec-content">
                  <span className="spec-label">Email professionnel</span>
                  <a href={`mailto:${user.email}`} className="spec-value-link">{user.email}</a>
                </div>
              </div>

              <div className="spec-tile">
                <Phone size={16} className="spec-tile-icon" />
                <div className="spec-content">
                  <span className="spec-label">Numéro de téléphone</span>
                  <a href={`tel:${user.phone}`} className="spec-value-link">{user.phone}</a>
                </div>
              </div>

              {user.website && (
                <div className="spec-tile">
                  <Globe size={16} className="spec-tile-icon" />
                  <div className="spec-content">
                    <span className="spec-label">Site internet</span>
                    <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className="spec-value-link">
                      https://{user.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Localisation */}
          <div>
            <span className="spec-label" style={{ marginBottom: '0.6rem' }}>Localisation & Coordonnées GPS</span>
            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '1.15rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <MapPin size={17} color="var(--accent-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {user.address?.street}, {user.address?.suite}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginLeft: '1.5rem', marginBottom: '0.75rem' }}>
                {user.address?.zipcode} {user.address?.city}
              </p>

              {user.address?.geo && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)' }}>
                    <Compass size={14} />
                    <span>Lat: {user.address.geo.lat} | Lng: {user.address.geo.lng}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${user.address.geo.lat},${user.address.geo.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    Google Maps <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="modal-footer-action">
          <button type="button" className="btn-glass" onClick={onClose}>
            Fermer
          </button>
          <a href={`mailto:${user.email}`} className="btn-neon">
            <Mail size={14} />
            <span>Envoyer un email</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
