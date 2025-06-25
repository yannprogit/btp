# 🦖 Builder Team Pokemon

## Presentation

**Builder Team Pokemon** (BTP) est, comme son nom l’indique, un gestionnaire d'équipe pokémon ergonomique et intuitif qui permet de créer efficacement ses équipes pokémon.

## Architecture

### architecture du projet

![alt text](images/architecture.png)

### Architecture des fichiers

```
builder_team_pokemon/
├── frontend/ # Application React
│ ├── public/
│ └── src/
│ ├── assets/
│ │ └── components/ #composant frontend
│ ├── pages/
│ └── App.tsx
│
├── api-gateway/ # API Gateway
│
├── user-service/ # Microservice utilisateur géré par docker
│
├── team-service/ # Microservice team Pokémon géré par docker
│
├── README.md
└── .gitignore
```

## Choix technique

Dans ce projet, nous avons fait le choix d’une architecture microservices qui permet non seulement de mieux organiser le code, mais aussi de faciliter les évolutions.
Les services communiquent à travers un API Gateway et chacun s’appuie sur une base de données PostgreSQL, choisi par une préférence de l'équipe.

Tous les differents élements sont conteneurisés avec Docker, ce qui assure un environnement reproductible sur toutes les machines, que ce soit en développement ou en production.

### Au niveau des choix des technologies :

La partie Frontend est réalisé en React avec TypeScript. L’utilisation de React nous permet de nous améliorer sur cette technologie très présente dans le monde du développement web, tandis que TypeScript renforce la rigueur du code, améliorant ainsi la lisibilité et la robustesse.

Pour la partie Backend, nous la réalisons avec express.js, qui est simple à mettre en place et fonctionne très bien, ainsi que
TypeScript pour les même raison que le Frontend.

## Lancement du projet

### Etape 1:

Démarrer Docker

### Etape 2:

Lancer la commande à la racinne du projet

```
.\start.bat\
```

### Etape 3:

Aller dans la partie front du projet a l'aide de la commande

```
cd front
```

### Etape 4:

Executer l'installateur npm a l'aide de la commande

```
npm i
```

### Etape 5:

Lancer le rendu front avec

```
npm run dev
```

### Etape 6:

Sur docker, Aller dans les containers -> Selectionner "api-gateway" -> Aller dans la section "port" et cliquer sur le lien

### Et voila !

vous avez lancé BTP ! félicitations ! :smiley:

## Notes

### sécurité

Par soucis pratique d'utilisation lors de la récupération du projet, nous avons décidé d'intégré le .env au git. Bien sur dans un vrai projet destiné a etre utilisé par le grand public ça n'arriverai pas avec

GURY Timothé / SADY Yann
