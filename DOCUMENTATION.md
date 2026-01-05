# 📚 Projet de Gestion de Formations - Documentation

## 🎯 Vue d'ensemble

Plateforme complète de gestion de formations professionnelles avec trois niveaux d'accès :
- **Admin** : Gestion complète du système
- **Formateur** : Gestion des cours et étudiants
- **Assistant** : Gestion administrative

## 🏗️ Architecture

### Backend
- **Framework** : Node.js + Express.js
- **Base de données** : MySQL
- **Authentification** : JWT (JSON Web Tokens)
- **Sécurité** : bcrypt pour le hachage des mots de passe, rate limiting, validation des données

### Frontend
- **Framework** : React 19 + Vite
- **Routing** : React Router DOM v7
- **HTTP Client** : Axios
- **Icons** : React Icons
- **State Management** : React Hooks (useState, useEffect)

## 🔐 Sécurité

### Mesures implémentées
1. **Authentification JWT** avec secret sécurisé
2. **Rate Limiting** sur les routes d'authentification
   - Login : 5 tentatives / 15 minutes
   - Register : 3 tentatives / 1 heure
3. **Validation des données** côté backend
   - Format email
   - Longueur mot de passe (min 6 caractères)
   - Sanitization des inputs
4. **Hachage des mots de passe** avec bcrypt (10 rounds)
5. **Protection CORS** configurée
6. **Gestion centralisée des erreurs**

## 📊 Base de données

### Tables principales
- `utilisateurs` : Comptes utilisateurs (admin, formateur, assistant)
- `formateur` : Profils formateurs avec compétences
- `formations` : Catalogue de formations
- `entreprises` : Clients entreprises
- `planifications` : Planning des formations
- `inscriptions` : Inscriptions individuelles
- `groupes` : Groupes de formation
- `evaluations` : Évaluations des formateurs
- `candidatures_formateurs` : Candidatures de nouveaux formateurs

### Index optimisés
Des index ont été créés sur les colonnes fréquemment utilisées pour optimiser les performances :
- Colonnes de recherche (email, role, status)
- Clés étrangères
- Colonnes de filtrage (categorie, ville, date)

## 🚀 Installation et démarrage

### Prérequis
- Node.js (v16+)
- MySQL (v8+)
- npm ou yarn

### Backend

```bash
cd backend
npm install
```

#### Configuration (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=formation_db
PORT=8081
JWT_SECRET=votre_secret_jwt_securise
```

#### Initialisation de la base de données
```bash
# Créer la base de données
mysql -u root -p < schema.sql

# Ou via l'interface MySQL
mysql -u root -p
CREATE DATABASE formation_db;
USE formation_db;
SOURCE schema.sql;
```

#### Démarrage
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📡 API Endpoints

### Authentification
- `POST /login` - Connexion
- `POST /register` - Inscription formateur
- `POST /forgot-password` - Réinitialisation mot de passe

### Utilisateurs (Admin)
- `GET /utilisateurs` - Liste des utilisateurs
- `POST /utilisateurs` - Créer un utilisateur
- `PUT /utilisateurs/:id` - Modifier un utilisateur
- `DELETE /utilisateurs/:id` - Supprimer un utilisateur

### Formations
- `GET /formations` - Liste des formations (public)
- `GET /formations/:id` - Détails d'une formation
- `POST /formations` - Créer une formation (admin)
- `PUT /formations/:id` - Modifier une formation (admin)
- `DELETE /formations/:id` - Supprimer une formation (admin)

### Entreprises
- `GET /entreprises` - Liste des entreprises
- `POST /entreprises` - Créer une entreprise
- `PUT /entreprises/:id` - Modifier une entreprise
- `DELETE /entreprises/:id` - Supprimer une entreprise

### Planning
- `GET /plannings` - Liste des plannings
- `GET /plannings/dependencies` - Données pour créer un planning
- `POST /plannings` - Créer un planning
- `DELETE /plannings/:id` - Supprimer un planning

### Inscriptions
- `POST /inscriptions/public` - Inscription publique
- `GET /inscriptions` - Liste des inscriptions (admin)
- `PUT /inscriptions/:id/status` - Modifier le statut

### Groupes
- `GET /groupes` - Liste des groupes
- `POST /groupes` - Créer un groupe
- `POST /groupes/add-member` - Ajouter un membre
- `GET /groupes/:id/members` - Membres d'un groupe
- `DELETE /groupes/:id` - Supprimer un groupe
- `GET /groupes/trainer/groups` - Groupes du formateur (formateur)
- `GET /groupes/trainer/students` - Étudiants du formateur (formateur)

### Évaluations
- `GET /evaluations` - Liste des évaluations
- `POST /evaluations` - Soumettre une évaluation
- `GET /evaluations/context/:formationId` - Contexte pour évaluation

### Candidatures
- `GET /candidatures` - Liste des candidatures
- `POST /candidatures` - Soumettre une candidature
- `PUT /candidatures/:id/status` - Modifier le statut

### Dashboard
- `GET /admin/stats` - Statistiques du dashboard admin

## 🎨 Design System

### Couleurs
- **Primary** : #6366f1 (Indigo)
- **Secondary** : #0ea5e9 (Sky Blue)
- **Accent** : #8b5cf6 (Violet)
- **Success** : #10b981
- **Warning** : #f59e0b
- **Danger** : #ef4444

### Typographie
- **Titres** : Outfit (Google Fonts)
- **Corps** : Inter (Google Fonts)

### Composants réutilisables
- `.card-premium` : Cartes avec effet premium
- `.btn-primary` : Boutons principaux avec gradient
- `.badge-new` : Badges pour nouveautés
- Animations : `fadeInUp`, `scale-in`, `slide-up`

## 👤 Comptes par défaut

### Admin
- **Email** : admin@admin.com
- **Mot de passe** : admin

⚠️ **Important** : Changez ces identifiants en production !

## 🔧 Améliorations apportées

### Sécurité
✅ Ajout du JWT_SECRET dans .env
✅ Validation d'email
✅ Validation de mot de passe (min 6 caractères)
✅ Rate limiting sur authentification
✅ Sanitization des inputs
✅ Logging des erreurs

### Performance
✅ Index sur colonnes fréquemment utilisées
✅ Optimisation des requêtes SQL
✅ Gestion centralisée des erreurs

### Qualité du code
✅ Module de validation centralisé
✅ Correction des erreurs de syntaxe
✅ Amélioration de la gestion d'erreurs
✅ Ajout de commentaires
✅ Logging structuré

## 📝 Bonnes pratiques

### Backend
- Toujours valider les données côté serveur
- Utiliser des requêtes préparées (protection SQL injection)
- Logger les erreurs avec contexte
- Gérer les erreurs de manière cohérente
- Utiliser des codes HTTP appropriés

### Frontend
- Centraliser les appels API
- Gérer les états de chargement
- Afficher des messages d'erreur clairs
- Valider les formulaires côté client
- Utiliser des composants réutilisables

## 🐛 Débogage

### Logs backend
Les erreurs sont loggées dans la console avec contexte :
```javascript
console.error("Erreur login:", err);
```

### Logs frontend
Les erreurs API sont interceptées et formatées :
```javascript
error.userMessage // Message utilisateur
```

## 📈 Évolutions futures recommandées

1. **Sécurité**
   - Implémenter 2FA (authentification à deux facteurs)
   - Ajouter HTTPS en production
   - Utiliser Redis pour le rate limiting
   - Implémenter la rotation des tokens JWT

2. **Fonctionnalités**
   - Système de notifications
   - Export PDF des formations
   - Calendrier interactif
   - Chat en temps réel
   - Système de paiement

3. **Performance**
   - Mise en cache avec Redis
   - Pagination côté serveur
   - Lazy loading des images
   - Compression des réponses

4. **UX/UI**
   - Mode sombre
   - Responsive mobile amélioré
   - Accessibilité (ARIA labels)
   - Internationalisation (i18n)

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs backend et frontend
2. Consulter cette documentation
3. Vérifier la configuration .env
4. Tester les endpoints avec Postman

## 📄 Licence

Projet éducatif - 2026
