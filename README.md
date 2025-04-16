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
│   │   └── Navbar.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── DemandeForm.tsx
│   │   ├── SuiviDemande.tsx
│   │   ├── Etudiants.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
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
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.