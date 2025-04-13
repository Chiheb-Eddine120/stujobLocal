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
npm start
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Construction pour la production

Pour créer une version de production :

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `build/`.

## Structure du projet

```
stujob-vitrine/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── Navbar.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── DemandeForm.js
│   │   ├── SuiviDemande.js
│   │   ├── Etudiants.js
│   │   ├── About.js
│   │   └── Contact.js
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Technologies utilisées

- React
- Material-UI
- React Router
- Emotion (pour le styling)

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.