# Stujob - Plateforme de Recrutement d'Étudiants

## Présentation

Stujob est une plateforme web qui met en relation les entreprises cherchant à recruter des étudiants avec des étudiants à la recherche de missions flexibles. La plateforme simplifie le processus de recrutement en offrant un service d'intermédiation personnalisé.

## Fonctionnalités

### Pour les Entreprises
- **Formulaire de demande de recrutement** : Les entreprises peuvent soumettre leurs besoins en personnel étudiant
- **Suivi de demande** : Possibilité de suivre l'état d'avancement de leur demande via un numéro de suivi
- **Mise en relation personnalisée** : Accompagnement pour trouver l'étudiant correspondant à leurs besoins

### Pour les Étudiants
- **Inscription au réseau** : Les étudiants peuvent s'inscrire pour être mis en relation avec des entreprises
- **Missions flexibles** : Opportunités adaptées à leur emploi du temps étudiant
- **Processus simplifié** : Pas besoin de rechercher activement des missions, Stujob s'en charge

### Pour les Administrateurs
- **Mode Maintenance** : Possibilité d'activer/désactiver le mode maintenance du site
- **Interface d'Administration** : Accès sécurisé avec authentification à deux niveaux
- **Gestion des Paramètres** : Contrôle des paramètres système avec historique des modifications

## Architecture Technique

### Frontend
- **Framework** : React avec TypeScript
- **Build Tool** : Vite (pour des performances optimales)
- **UI Framework** : Material-UI (MUI)
- **Routing** : React Router
- **État** : React Hooks (useState, useEffect)

### Structure du Projet
- **Pages** : 
  - Home : Page d'accueil avec présentation des services
  - DemandeForm : Formulaire de demande de recrutement
  - SuiviDemande : Suivi de l'état d'une demande
  - Etudiants : Page d'inscription pour les étudiants
  - About : Présentation de l'entreprise
  - Contact : Formulaire de contact
  - MaintenanceMode : Page affichée lors de la maintenance du site
  - DashboardSettings : Interface d'administration des paramètres

- **Composants** :
  - Navbar : Barre de navigation
  - Footer : Pied de page
  - Stats : Statistiques et chiffres clés
  - Testimonials : Témoignages clients
  - FAQ : Questions fréquemment posées

## Flux de Fonctionnement

1. **Demande de Recrutement** :
   - L'entreprise remplit le formulaire de demande
   - Un numéro de suivi unique est généré
   - La demande est enregistrée dans le système

2. **Traitement de la Demande** :
   - L'équipe Stujob analyse la demande
   - Recherche d'étudiants correspondants dans la base
   - Mise en relation avec les candidats potentiels

3. **Suivi et Finalisation** :
   - L'entreprise peut suivre l'état de sa demande
   - Une fois un étudiant trouvé, contact est établi
   - Suivi post-recrutement si nécessaire

## Technologies Utilisées

- **Langages** : TypeScript, JavaScript
- **Frontend** : React, Vite
- **UI** : Material-UI, CSS personnalisé
- **Routing** : React Router
- **Gestion d'État** : React Hooks
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **Validation de Formulaire** : Validation native HTML5
- **Responsive Design** : Grid et Flexbox de Material-UI

## Points Forts

- **Interface intuitive** : Design moderne et facile à utiliser
- **Processus simplifié** : Réduction du temps de recrutement
- **Flexibilité** : Adapté aux emplois du temps étudiants
- **Personnalisation** : Accompagnement sur mesure
- **Performance** : Application rapide grâce à Vite
- **Maintenabilité** : Code TypeScript bien structuré

## Évolutions Futures

- Intégration d'un système de messagerie interne
- Ajout d'un espace membre pour les étudiants
- Système de notation et d'avis
- Application mobile
- Intégration avec des plateformes de paiement

## Prérequis

- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/stujob-vitrine.git
cd stujob-vitrine
```

2. Installez les dépendances :
```bash
npm install
```

## Démarrage en développement

Pour lancer l'application en mode développement :

```bash
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Construction pour la production

Pour créer une version de production :

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `build/`.

Pour prévisualiser la version de production :

```bash
npm run preview
```

## Structure du projet

```
stujob-vitrine/
├── public/
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Stats.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── DemandeForm.tsx
│   │   ├── SuiviDemande.tsx
│   │   ├── Etudiants.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── MaintenanceMode.tsx
│   │   └── DashboardSettings.tsx
│   ├── services/
│   │   ├── supabase.ts
│   │   └── settings.ts
│   ├── App.tsx
│   └── index.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
└── README.md
```

## Technologies utilisées

- React
- TypeScript
- Vite
- Material-UI
- React Router
- Emotion (pour le styling)

## Variables d'environnement

Les variables d'environnement doivent être préfixées par `VITE_` pour être accessibles dans l'application.

Exemple :
```env
VITE_API_URL=http://api.example.com
VITE_ADMIN_SECRET=votre_clé_secrète_admin  # Clé secrète pour l'accès administrateur
```

### Variables requises pour l'administration
- `VITE_ADMIN_SECRET` : Clé secrète pour l'accès à l'interface d'administration
- `VITE_SUPABASE_URL` : URL de votre instance Supabase
- `VITE_SUPABASE_ANON_KEY` : Clé anonyme Supabase

### Mode Maintenance

Le site inclut un mode maintenance qui peut être activé par les administrateurs. Lorsqu'il est activé :
- Les utilisateurs non-administrateurs sont redirigés vers une page de maintenance
- Les administrateurs peuvent toujours accéder au site après authentification
- Un système de double authentification protège l'accès administrateur :
  1. Validation d'une clé secrète
  2. Connexion avec un compte administrateur vérifié

Pour accéder au site en mode maintenance en tant qu'administrateur :
1. Cliquer sur "Accès administrateur" sur la page de maintenance
2. Entrer la clé secrète d'administration (`VITE_ADMIN_SECRET`)
3. Se connecter avec un compte administrateur valide

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.