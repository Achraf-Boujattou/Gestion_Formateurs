# 🎨 Guide d'Utilisation du Design System

## 📚 Exemples de Code Pratiques

Ce guide contient des exemples concrets pour utiliser le nouveau design system dans vos composants React.

---

## 1. 🎴 Cartes (Cards)

### Card Premium Basique
```jsx
<div className="card-premium animate-fade-in">
  <h3>Titre de la carte</h3>
  <p className="text-muted">Description de la carte</p>
</div>
```

### Card avec Icon Box
```jsx
<div className="card-premium animate-slide-up">
  <div className="icon-box icon-box-primary">
    <FiUsers />
  </div>
  <h3>Utilisateurs</h3>
  <p className="stat-value">1,234</p>
  <p className="stat-label">Total</p>
</div>
```

### Card Gradient
```jsx
<div className="card-gradient">
  <h3 style={{ color: 'white' }}>Premium Feature</h3>
  <p style={{ color: 'rgba(255,255,255,0.9)' }}>
    Contenu avec fond gradient
  </p>
</div>
```

### Card Glass (Glassmorphism)
```jsx
<div className="card-glass">
  <h3>Effet Verre</h3>
  <p>Fond flou avec transparence</p>
</div>
```

---

## 2. 🏷️ Badges

### Badges de Statut
```jsx
{/* Success */}
<span className="badge badge-success">
  <FiCheckCircle />
  Actif
</span>

{/* Warning */}
<span className="badge badge-warning">
  <FiAlertTriangle />
  En attente
</span>

{/* Danger */}
<span className="badge badge-danger">
  <FiXCircle />
  Inactif
</span>

{/* Info */}
<span className="badge badge-info">
  <FiInfo />
  Information
</span>

{/* Primary */}
<span className="badge badge-primary">
  <FiStar />
  Nouveau
</span>
```

---

## 3. 🔘 Boutons

### Bouton Primary
```jsx
<button className="btn-primary">
  Enregistrer <FiSave />
</button>
```

### Bouton Secondary
```jsx
<button className="btn-secondary">
  Annuler
</button>
```

### Bouton Gradient avec Effet
```jsx
<button className="btn-gradient">
  Commencer <FiArrowRight />
</button>
```

### Bouton Ghost
```jsx
<button className="btn-ghost">
  Fermer
</button>
```

### Bouton avec Loading
```jsx
const [loading, setLoading] = useState(false);

<button 
  className="btn-primary" 
  disabled={loading}
>
  {loading ? (
    <>
      <span className="animate-pulse">Chargement...</span>
    </>
  ) : (
    <>
      Envoyer <FiSend />
    </>
  )}
</button>
```

---

## 4. 📝 Formulaires

### Input avec Icône
```jsx
<div className="form-group">
  <label>Email <span className="req">*</span></label>
  <div className="input-with-icon">
    <FiMail className="field-icon" />
    <input 
      type="email" 
      placeholder="votre@email.com"
      required
    />
  </div>
</div>
```

### Textarea avec Icône
```jsx
<div className="form-group full-width">
  <label>Description</label>
  <div className="input-with-icon">
    <FiFileText className="field-icon" />
    <textarea 
      placeholder="Décrivez votre projet..."
      rows="4"
    />
  </div>
</div>
```

### Formulaire en Grille
```jsx
<form className="premium-form">
  <div className="form-grid">
    <div className="form-group">
      <label>Prénom <span className="req">*</span></label>
      <div className="input-with-icon">
        <FiUser className="field-icon" />
        <input type="text" placeholder="John" />
      </div>
    </div>

    <div className="form-group">
      <label>Nom <span className="req">*</span></label>
      <div className="input-with-icon">
        <FiUser className="field-icon" />
        <input type="text" placeholder="Doe" />
      </div>
    </div>

    <div className="form-group full-width">
      <label>Email <span className="req">*</span></label>
      <div className="input-with-icon">
        <FiMail className="field-icon" />
        <input type="email" placeholder="john.doe@example.com" />
      </div>
    </div>
  </div>

  <div className="modal-actions">
    <button type="button" className="btn-ghost">
      Annuler
    </button>
    <button type="submit" className="btn-primary">
      Enregistrer <FiSave />
    </button>
  </div>
</form>
```

---

## 5. 🎭 Modales

### Modale Complète
```jsx
const [isOpen, setIsOpen] = useState(false);

{isOpen && (
  <div className="modal-overlay" onClick={() => setIsOpen(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Ajouter un Utilisateur</h3>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          ×
        </button>
      </div>

      <form className="premium-form">
        <div className="form-grid">
          {/* Vos champs ici */}
        </div>

        <div className="modal-actions">
          <button 
            type="button" 
            className="btn-ghost"
            onClick={() => setIsOpen(false)}
          >
            Annuler
          </button>
          <button type="submit" className="btn-primary">
            Ajouter <FiPlus />
          </button>
        </div>
      </form>
    </div>
  </div>
)}
```

---

## 6. 🔍 Barre de Recherche

### Recherche Premium
```jsx
<div className="search-wrapper">
  <FiSearch className="search-icon" />
  <input 
    type="text"
    className="search-bar-premium"
    placeholder="Rechercher..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
```

---

## 7. 📊 Indicateurs de Statut

### Status Dots
```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
  <span className="status-dot status-active"></span>
  <span>Actif</span>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
  <span className="status-dot status-pending"></span>
  <span>En attente</span>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
  <span className="status-dot status-inactive"></span>
  <span>Inactif</span>
</div>
```

---

## 8. 🎨 Texte avec Gradient

### Titre Gradient
```jsx
<h1 className="text-gradient-primary">
  Titre avec Gradient
</h1>

<h2 className="text-gradient-sunset">
  Titre Sunset
</h2>
```

---

## 9. 💀 États de Chargement (Skeletons)

### Skeleton Basique
```jsx
{loading ? (
  <div>
    <div className="skeleton skeleton-title"></div>
    <div className="skeleton skeleton-text"></div>
    <div className="skeleton skeleton-text"></div>
    <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
  </div>
) : (
  <div>
    <h2>{data.title}</h2>
    <p>{data.description}</p>
  </div>
)}
```

### Skeleton Card
```jsx
{loading ? (
  <div className="card-premium">
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div className="skeleton skeleton-avatar"></div>
      <div style={{ flex: 1 }}>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
      </div>
    </div>
  </div>
) : (
  <div className="card-premium">
    {/* Contenu réel */}
  </div>
)}
```

---

## 10. 🎬 Animations

### Animation au Montage
```jsx
<div className="animate-fade-in">
  Apparaît en fondu
</div>

<div className="animate-slide-up">
  Monte depuis le bas
</div>

<div className="animate-scale-in">
  Zoom progressif
</div>
```

### Animation avec Délai (Stagger)
```jsx
<div className="formations-grid">
  {formations.map((f, index) => (
    <div 
      key={f.id} 
      className={`card-premium animate-slide-up stagger-${Math.min(index + 1, 5)}`}
    >
      {/* Contenu */}
    </div>
  ))}
</div>
```

### Animation Continue
```jsx
<div className="animate-pulse">
  Pulsation continue
</div>

<div className="animate-float">
  Flottement doux
</div>

<div className="animate-glow">
  Effet lumineux
</div>
```

---

## 11. 📐 Utilitaires de Layout

### Flexbox
```jsx
{/* Centré */}
<div className="flex-center">
  <p>Contenu centré</p>
</div>

{/* Space Between */}
<div className="flex-between">
  <span>Gauche</span>
  <span>Droite</span>
</div>

{/* Avec Gap */}
<div className="flex-center gap-md">
  <button>Bouton 1</button>
  <button>Bouton 2</button>
</div>
```

### Espacements
```jsx
{/* Margins */}
<div className="mt-lg mb-md">
  Contenu avec marges
</div>

{/* Gaps */}
<div style={{ display: 'flex' }} className="gap-lg">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

## 12. 🎯 Dividers

### Divider Simple
```jsx
<div className="divider"></div>
```

### Divider Gradient
```jsx
<div className="divider-gradient"></div>
```

---

## 13. 💬 Tooltips

### Tooltip CSS Pur
```jsx
<button 
  className="tooltip" 
  data-tooltip="Cliquez pour enregistrer"
>
  <FiSave />
</button>
```

---

## 14. 📱 Responsive

### Masquer sur Mobile
```jsx
<div className="hide-mobile">
  Visible uniquement sur desktop
</div>
```

### Afficher uniquement sur Mobile
```jsx
<div className="show-mobile">
  Visible uniquement sur mobile
</div>
```

---

## 15. 🎨 Exemple Complet: Carte de Formation

```jsx
import { FiBook, FiMapPin, FiCalendar, FiCheckCircle, FiAward, FiArrowRight } from 'react-icons/fi';

const FormationCard = ({ formation }) => {
  return (
    <div className="formation-card-public animate-fade-in">
      <div className="f-card-badge">{formation.categorie}</div>

      <div className="CardHeader">
        <div className="f-icon-box">
          <FiBook />
        </div>
        <h3>{formation.titre}</h3>
      </div>

      <p className="f-desc">
        {formation.objectifs.substring(0, 90)}...
      </p>

      <div className="f-meta-info">
        <span>
          <FiMapPin /> {formation.ville}
        </span>
        {formation.date_formation && (
          <span>
            <FiCalendar /> {new Date(formation.date_formation).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="f-tags">
        <span className="tag">
          <FiCheckCircle /> {formation.nombre_heures}h
        </span>
        <span className="tag">
          <FiAward /> Certifiant
        </span>
      </div>

      <Link 
        to={`/register-formation/${formation.id}`} 
        className="btn-card-action"
      >
        S'inscrire <FiArrowRight />
      </Link>
    </div>
  );
};
```

---

## 16. 🎨 Exemple Complet: Carte Statistique

```jsx
import { FiUsers } from 'react-icons/fi';

const StatCard = ({ icon: Icon, value, label, type }) => {
  return (
    <div className="stat-card animate-fade-in">
      <div className={`stat-icon-wrapper ${type}`}>
        <Icon />
      </div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

// Utilisation
<StatCard 
  icon={FiUsers}
  value="1,234"
  label="Utilisateurs Totaux"
  type="users"
/>
```

---

## 17. 🎨 Exemple Complet: Item d'Activité

```jsx
import { FiCheckCircle } from 'react-icons/fi';

const ActivityItem = ({ activity }) => {
  return (
    <div className="activity-item">
      <div className={`activity-icon ${activity.type.toLowerCase()}`}>
        <FiCheckCircle />
      </div>
      <div className="activity-details">
        <p>
          <strong>{activity.prenom} {activity.detail}</strong>
        </p>
        <span>
          Nouveau {activity.type === 'Inscription' ? 'apprenant inscrit' : 'utilisateur créé'}
        </span>
      </div>
      <div className="activity-time">
        {new Date(activity.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};
```

---

## 🎯 Conseils d'Utilisation

### 1. **Cohérence**
Utilisez toujours les classes du design system plutôt que du CSS inline.

### 2. **Composition**
Combinez les classes utilitaires pour créer des designs complexes.

```jsx
<div className="card-premium animate-slide-up stagger-2 mt-lg">
  {/* Contenu */}
</div>
```

### 3. **Variables CSS**
Utilisez les variables CSS dans vos styles personnalisés.

```jsx
<div style={{ 
  padding: 'var(--space-lg)',
  borderRadius: 'var(--radius-xl)',
  boxShadow: 'var(--shadow-premium)'
}}>
  {/* Contenu */}
</div>
```

### 4. **Responsive**
Pensez mobile-first et utilisez les utilitaires responsive.

```jsx
<div className="hide-mobile">Desktop only</div>
<div className="show-mobile">Mobile only</div>
```

---

## 📚 Ressources

- **Variables CSS**: Voir `index.css` lignes 3-120
- **Animations**: Voir `index.css` lignes 540-630
- **Utilitaires**: Voir `index.css` lignes 630-990
- **Exemples**: Voir `Home.jsx`, `AdminDashboard.jsx`

---

**Créé le**: 05/01/2026  
**Version**: 1.0  
**Statut**: Guide Complet

*Utilisez ce guide comme référence pour maintenir la cohérence visuelle ! 🎨*
