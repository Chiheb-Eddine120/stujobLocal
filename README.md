# Stujob - Site Vitrine

Site vitrine pour Stujob, une plateforme de mise en relation entre entreprises et étudiants.

## Fonctionnalités

- Page d'accueil avec présentation du service
- Formulaire de demande de recrutement
- Suivi de demande avec numéro unique
- Page étudiants avec inscription
- Page À propos
- Page Contact

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