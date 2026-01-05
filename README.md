# 🎓 Plateforme de Gestion de Formations

Une application web complète et sécurisée pour la gestion de formations professionnelles, développée avec React et Node.js.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)
![React](https://img.shields.io/badge/react-19.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Fonctionnalités

### 🏠 Espace Public
- 📋 Catalogue de formations avec filtres avancés (catégorie, ville, date)
- 🔍 Recherche en temps réel
- 📝 Inscription en ligne aux formations
- ⭐ Évaluation des formateurs
- 👨‍🏫 Candidature pour devenir formateur

### 👨‍💼 Espace Admin
- 📊 Dashboard avec statistiques en temps réel
- 👥 Gestion des utilisateurs (formateurs, assistants)
- 📚 Gestion du catalogue de formations
- 🏢 Gestion des entreprises clientes
- 📅 Planification des sessions
- 📋 Gestion des inscriptions et groupes
- ⭐ Consultation des évaluations
- 📬 Gestion des candidatures formateurs

### 👨‍🏫 Espace Formateur
- 📖 Vue d'ensemble des formations assignées
- 👨‍🎓 Gestion des étudiants
- 📊 Suivi des groupes

### 👔 Espace Assistant
- 🏢 Gestion des entreprises
- 📅 Gestion du planning
- 📋 Gestion des inscriptions et groupes
- ⭐ Consultation des évaluations

## 🚀 Technologies

### Backend
- **Node.js** + **Express.js** - Serveur API REST
- **MySQL** - Base de données relationnelle
- **JWT** - Authentification sécurisée
- **bcrypt** - Hachage des mots de passe
- **CORS** - Gestion des requêtes cross-origin

### Frontend
- **React 19** - Framework UI moderne
- **Vite** - Build tool ultra-rapide
- **React Router v7** - Navigation
- **Axios** - Client HTTP
- **React Icons** - Bibliothèque d'icônes

## 📦 Installation

### Prérequis
- Node.js >= 16.0.0
- MySQL >= 8.0
- npm ou yarn

### 1. Cloner le projet
```bash
git clone <repository-url>
cd prjt_Formation
```

### 2. Configuration Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=formation_db
PORT=8081
JWT_SECRET=votre_secret_jwt_tres_securise
```

Initialiser la base de données :
```bash
mysql -u root -p < schema.sql
```

Démarrer le serveur :
```bash
npm run dev
```

### 3. Configuration Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🔐 Sécurité

### Mesures implémentées
- ✅ **JWT Authentication** avec secret sécurisé
- ✅ **Rate Limiting** (protection contre brute force)
  - Login : 5 tentatives / 15 minutes
  - Register : 3 tentatives / 1 heure
- ✅ **Validation des données** (email, mot de passe, etc.)
- ✅ **Sanitization des inputs** (protection XSS)
- ✅ **Hachage bcrypt** (10 rounds)
- ✅ **Requêtes préparées** (protection SQL injection)
- ✅ **Gestion centralisée des erreurs**

## 👤 Comptes de test

### Administrateur
- **Email** : admin@admin.com
- **Mot de passe** : admin

⚠️ **Important** : Changez ces identifiants en production !

## 📊 Structure du projet

```
prjt_Formation/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration DB
│   │   ├── controllers/     # Logique métier
│   │   ├── middleware/      # Middlewares (auth, rate limit)
│   │   ├── routes/          # Routes API
│   │   └── utils/           # Utilitaires (validation)
│   ├── .env                 # Variables d'environnement
│   ├── schema.sql           # Schéma de base de données
│   └── server.js            # Point d'entrée
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/           # Pages de l'application
│   │   ├── services/        # Services API
│   │   ├── index.css        # Design system
│   │   └── App.jsx          # Composant racine
│   └── index.html
└── DOCUMENTATION.md         # Documentation complète
```

## 🎨 Design System

### Palette de couleurs
- **Primary** : `#6366f1` (Indigo)
- **Secondary** : `#0ea5e9` (Sky Blue)
- **Accent** : `#8b5cf6` (Violet)
- **Success** : `#10b981`
- **Warning** : `#f59e0b`
- **Danger** : `#ef4444`

### Typographie
- **Titres** : Outfit (Google Fonts)
- **Corps** : Inter (Google Fonts)

## 📡 API Endpoints

### Authentification
```
POST   /login                    # Connexion
POST   /register                 # Inscription formateur
POST   /forgot-password          # Réinitialisation
```

### Formations
```
GET    /formations               # Liste (public)
GET    /formations/:id           # Détails
POST   /formations               # Créer (admin)
PUT    /formations/:id           # Modifier (admin)
DELETE /formations/:id           # Supprimer (admin)
```

### Utilisateurs
```
GET    /utilisateurs             # Liste (admin)
POST   /utilisateurs             # Créer (admin)
PUT    /utilisateurs/:id         # Modifier (admin)
DELETE /utilisateurs/:id         # Supprimer (admin)
```

[Voir DOCUMENTATION.md pour la liste complète]

## 🔧 Scripts disponibles

### Backend
```bash
npm start       # Démarrage production
npm run dev     # Démarrage développement (nodemon)
```

### Frontend
```bash
npm run dev     # Serveur de développement
npm run build   # Build production
npm run preview # Prévisualiser le build
npm run lint    # Linter ESLint
```

## 🐛 Débogage

### Logs Backend
Les erreurs sont loggées avec contexte :
```javascript
console.error("Erreur login:", err);
```

### Logs Frontend
Les erreurs API sont interceptées automatiquement :
```javascript
catch(err => {
    console.error(err.userMessage);
});
```

## 📈 Améliorations récentes

### Version 1.0.0
- ✅ Ajout du JWT_SECRET sécurisé
- ✅ Implémentation du rate limiting
- ✅ Module de validation centralisé
- ✅ Sanitization des inputs
- ✅ Index de base de données optimisés
- ✅ Correction des bugs de syntaxe
- ✅ Amélioration de la gestion d'erreurs
- ✅ Documentation complète

## 🚧 Roadmap

### Version 1.1.0 (À venir)
- [ ] Système de notifications
- [ ] Export PDF des formations
- [ ] Calendrier interactif
- [ ] Mode sombre
- [ ] Responsive mobile amélioré

### Version 2.0.0 (Futur)
- [ ] Authentification 2FA
- [ ] Chat en temps réel
- [ ] Système de paiement
- [ ] Application mobile (React Native)
- [ ] Internationalisation (i18n)

## 📝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- **Votre Nom** - Développement initial

## 🙏 Remerciements

- React Team pour l'excellent framework
- Express.js pour le framework backend
- La communauté open source

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@formation-app.com
- 📖 Documentation : [DOCUMENTATION.md](./DOCUMENTATION.md)
- 🐛 Issues : [GitHub Issues](https://github.com/...)

---

⭐ Si ce projet vous a été utile, n'hésitez pas à lui donner une étoile !
