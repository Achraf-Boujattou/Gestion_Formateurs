# 📋 Guide d'Utilisation - Composants de Formulaire

## 🎯 Objectif

Garantir une **cohérence parfaite** dans tous les formulaires de l'application avec des icônes **toujours bien positionnées** et des placeholders **lisibles**.

---

## 📦 Composants Disponibles

### 1. **InputWithIcon** - Input avec icône

```jsx
import { InputWithIcon, FormGroup } from '../components/FormComponents/FormComponents';
import { FiMail } from 'react-icons/fi';

<FormGroup label="Email" required>
    <InputWithIcon
        icon={FiMail}
        type="email"
        placeholder="votre@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
    />
</FormGroup>
```

**Résultat** :
```
EMAIL *
┌─────────────────────────────┐
│ 📧 votre@email.com          │  ← Icône à gauche, placeholder lisible
└─────────────────────────────┘
```

---

### 2. **TextareaWithIcon** - Zone de texte avec icône

```jsx
import { TextareaWithIcon, FormGroup } from '../components/FormComponents/FormComponents';
import { FiFileText } from 'react-icons/fi';

<FormGroup label="Description" required>
    <TextareaWithIcon
        icon={FiFileText}
        placeholder="Décrivez votre formation..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        required
    />
</FormGroup>
```

---

### 3. **SelectWithIcon** - Select avec icône

```jsx
import { SelectWithIcon, FormGroup } from '../components/FormComponents/FormComponents';
import { FiTag } from 'react-icons/fi';

<FormGroup label="Catégorie" required>
    <SelectWithIcon
        icon={FiTag}
        value={categorie}
        onChange={(e) => setCategorie(e.target.value)}
        required
    >
        <option value="">Sélectionnez...</option>
        <option value="dev">Développement</option>
        <option value="design">Design</option>
    </SelectWithIcon>
</FormGroup>
```

---

### 4. **SearchBar** - Barre de recherche

```jsx
import { SearchBar } from '../components/FormComponents/FormComponents';

<SearchBar
    placeholder="Rechercher une formation..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
/>
```

---

### 5. **FormGroup** - Groupe avec label

```jsx
import { FormGroup } from '../components/FormComponents/FormComponents';

<FormGroup label="Nom complet" required fullWidth>
    {/* Votre input ici */}
</FormGroup>
```

---

## 🎨 Exemples Complets

### Formulaire de Connexion

```jsx
import React, { useState } from 'react';
import { InputWithIcon, FormGroup } from '../components/FormComponents/FormComponents';
import { FiMail, FiLock } from 'react-icons/fi';
import '../components/FormComponents/FormComponents.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <form className="premium-form">
            <FormGroup label="Email" required>
                <InputWithIcon
                    icon={FiMail}
                    type="email"
                    placeholder="Entrez votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </FormGroup>

            <FormGroup label="Mot de passe" required>
                <InputWithIcon
                    icon={FiLock}
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </FormGroup>

            <button type="submit" className="btn-primary">
                Se connecter
            </button>
        </form>
    );
};
```

---

### Formulaire en Grille

```jsx
import React, { useState } from 'react';
import { InputWithIcon, TextareaWithIcon, SelectWithIcon, FormGroup } from '../components/FormComponents/FormComponents';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiFileText } from 'react-icons/fi';
import '../components/FormComponents/FormComponents.css';

const UserForm = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        role: '',
        bio: ''
    });

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    return (
        <form className="premium-form">
            <div className="form-grid">
                <FormGroup label="Nom" required>
                    <InputWithIcon
                        icon={FiUser}
                        type="text"
                        placeholder="Doe"
                        value={formData.nom}
                        onChange={handleChange('nom')}
                        required
                    />
                </FormGroup>

                <FormGroup label="Prénom" required>
                    <InputWithIcon
                        icon={FiUser}
                        type="text"
                        placeholder="John"
                        value={formData.prenom}
                        onChange={handleChange('prenom')}
                        required
                    />
                </FormGroup>

                <FormGroup label="Email" required>
                    <InputWithIcon
                        icon={FiMail}
                        type="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={handleChange('email')}
                        required
                    />
                </FormGroup>

                <FormGroup label="Téléphone">
                    <InputWithIcon
                        icon={FiPhone}
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        value={formData.telephone}
                        onChange={handleChange('telephone')}
                    />
                </FormGroup>

                <FormGroup label="Rôle" required fullWidth>
                    <SelectWithIcon
                        icon={FiBriefcase}
                        value={formData.role}
                        onChange={handleChange('role')}
                        required
                    >
                        <option value="">Sélectionnez un rôle</option>
                        <option value="admin">Administrateur</option>
                        <option value="formateur">Formateur</option>
                        <option value="assistant">Assistant</option>
                    </SelectWithIcon>
                </FormGroup>

                <FormGroup label="Biographie" fullWidth>
                    <TextareaWithIcon
                        icon={FiFileText}
                        placeholder="Parlez-nous de vous..."
                        value={formData.bio}
                        onChange={handleChange('bio')}
                        rows={4}
                    />
                </FormGroup>
            </div>

            <div className="modal-actions">
                <button type="button" className="btn-ghost">
                    Annuler
                </button>
                <button type="submit" className="btn-primary">
                    Enregistrer
                </button>
            </div>
        </form>
    );
};
```

---

## 🔄 Migration des Formulaires Existants

### Avant (Ancien Code)

```jsx
// ❌ Ancien code - Icônes mal positionnées
<div className="form-group">
    <label>Email</label>
    <div className="input-wrapper">
        <FiMail className="input-icon" />
        <input
            type="email"
            className="form-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
    </div>
</div>
```

### Après (Nouveau Code)

```jsx
// ✅ Nouveau code - Cohérent et propre
import { InputWithIcon, FormGroup } from '../components/FormComponents/FormComponents';
import { FiMail } from 'react-icons/fi';

<FormGroup label="Email" required>
    <InputWithIcon
        icon={FiMail}
        type="email"
        placeholder="votre@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
    />
</FormGroup>
```

---

## 📐 Spécifications Techniques

### Dimensions
- **Input height**: 3.5rem (56px)
- **Textarea min-height**: 6rem
- **Icon size**: 1.1rem
- **Icon position**: left 1.25rem, centré verticalement
- **Input padding**: 1rem 1.25rem 1rem 3.5rem

### Couleurs
- **Icon color**: `var(--primary)` (bleu indigo)
- **Border**: 2px solid `var(--border-light)`
- **Border focus**: `var(--primary)`
- **Background**: `var(--bg-main)`
- **Background focus**: white

### Animations
- **Transition**: `var(--transition)`
- **Icon scale on focus**: 1.1
- **Focus ring**: 4px rgba(79, 70, 229, 0.1)

---

## ✅ Checklist de Migration

Pour chaque formulaire :

- [ ] Importer les composants depuis `FormComponents`
- [ ] Importer le CSS `FormComponents.css`
- [ ] Remplacer les `<input>` par `<InputWithIcon>`
- [ ] Remplacer les `<textarea>` par `<TextareaWithIcon>`
- [ ] Remplacer les `<select>` par `<SelectWithIcon>`
- [ ] Envelopper dans `<FormGroup>` avec label
- [ ] Utiliser `<SearchBar>` pour les recherches
- [ ] Tester l'affichage et le focus
- [ ] Vérifier le responsive mobile

---

## 🎯 Avantages

### Cohérence
- ✅ **Même apparence** partout
- ✅ **Même comportement** partout
- ✅ **Même code** partout

### Maintenabilité
- ✅ **Un seul endroit** pour les modifications
- ✅ **Réutilisable** à l'infini
- ✅ **Facile à tester**

### UX
- ✅ **Icônes toujours visibles**
- ✅ **Placeholders lisibles**
- ✅ **Focus states cohérents**
- ✅ **Accessibilité améliorée**

---

## 📚 Fichiers à Migrer

### Priorité HAUTE
1. `Login.jsx` ✅ (Déjà fait)
2. `Register.jsx`
3. `ForgotPassword.jsx`
4. `AdminUsers.jsx`
5. `AdminFormations.jsx`

### Priorité MOYENNE
6. `AdminGroupes.jsx`
7. `Entreprises.jsx`
8. `JoinAsTrainer.jsx`
9. `RegisterFormation.jsx`
10. `EvaluationForm.jsx`

---

## 🚀 Prochaines Étapes

1. **Importer** les composants dans chaque fichier
2. **Remplacer** les anciens inputs
3. **Tester** chaque formulaire
4. **Valider** l'apparence
5. **Documenter** les changements

---

**Date**: 05/01/2026  
**Version**: 1.0  
**Statut**: Système Prêt à l'Emploi

*Utilisez ces composants pour tous vos formulaires ! 🎯*
