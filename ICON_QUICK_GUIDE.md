# 🎯 Guide Rapide - Alignement Icônes + Labels

## ✅ Template à Copier-Coller

### 1. Icône + Texte (Inline)
```jsx
// JSX
<div className="item-with-icon">
  <FiIcon />
  <span>Texte</span>
</div>

// CSS
.item-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.item-with-icon svg {
  font-size: 1rem;
  flex-shrink: 0;
}
```

### 2. Icône Absolue dans Input
```jsx
// JSX
<div className="input-wrapper">
  <FiIcon className="input-icon" />
  <input type="text" placeholder="..." />
</div>

// CSS
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--primary);
}

.input-wrapper input {
  padding-left: 3rem;
  width: 100%;
}
```

### 3. Bouton avec Icône
```jsx
// JSX
<button className="btn-with-icon">
  Texte <FiIcon />
</button>

// CSS
.btn-with-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-with-icon svg {
  font-size: 1.1rem;
  flex-shrink: 0;
}
```

### 4. Liste avec Icônes
```jsx
// JSX
<ul className="icon-list">
  <li>
    <FiCheck />
    <span>Item 1</span>
  </li>
  <li>
    <FiCheck />
    <span>Item 2</span>
  </li>
</ul>

// CSS
.icon-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.icon-list svg {
  font-size: 1rem;
  flex-shrink: 0;
  color: var(--success);
}
```

---

## 🔑 Règles d'Or

1. **Toujours utiliser Flexbox**
   ```css
   display: flex; /* ou inline-flex */
   align-items: center;
   ```

2. **Toujours définir un gap**
   ```css
   gap: 0.5rem; /* Espacement entre icône et texte */
   ```

3. **Toujours empêcher le shrink**
   ```css
   svg {
     flex-shrink: 0;
   }
   ```

4. **Toujours définir une taille fixe**
   ```css
   svg {
     font-size: 1rem;
   }
   ```

5. **Pour les icônes absolues, centrer avec transform**
   ```css
   position: absolute;
   top: 50%;
   transform: translateY(-50%);
   ```

---

## ⚠️ Erreurs Courantes

### ❌ NE PAS FAIRE
```css
/* Pas de flexbox */
.bad-example {
  display: block;
}

/* Pas d'alignement */
.bad-example svg {
  vertical-align: middle; /* Obsolète et imprécis */
}

/* Taille variable */
.bad-example svg {
  /* Pas de font-size défini */
}
```

### ✅ À FAIRE
```css
/* Avec flexbox */
.good-example {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Taille fixe */
.good-example svg {
  font-size: 1rem;
  flex-shrink: 0;
}
```

---

## 📏 Tailles Recommandées

| Contexte | Taille Icône | Gap |
|----------|--------------|-----|
| **Texte normal** | 1rem | 0.5rem |
| **Petit texte** | 0.875rem | 0.375rem |
| **Boutons** | 1.1rem | 0.5rem |
| **Titres** | 1.25-1.5rem | 0.75rem |
| **Navigation** | 1.35rem | 1rem |
| **Tags/Badges** | 0.875rem | 0.375rem |

---

## 🎨 Exemples Réels du Projet

### Sidebar Nav
```css
.nav-link {
  display: flex;
  align-items: center;
  gap: 1.125rem;
}

.nav-link svg {
  font-size: 1.35rem;
  flex-shrink: 0;
}
```

### Search Box
```css
.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box svg {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
```

### Meta Info
```css
.f-meta-info span {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.f-meta-info svg {
  font-size: 1rem;
  flex-shrink: 0;
}
```

---

**Utilisez ce guide comme référence rapide ! 🚀**
