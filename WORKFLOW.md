# Workflow du Projet

## Sommaire

1.  [Outils de gestion de projet](#1-outils-de-gestion-de-projet)
2.  [Résumé du cycle de vie d'un ticket](#2-résumé-du-cycle-de-vie-dun-ticket)
3.  [Automatisation](#3-automatisation)

## 1. Outils de gestion de projet

Nous utilisons Notion pour la gestion de projet.
Lien vers le board : [Builder team pokemon](https://www.notion.so/Builder-team-pokemon-310c4e73bcee8087a629c7ad7313b980)

## 2. Résumé du cycle de vie d'un ticket

Le statut du ticket évolue dans le tableau de bord (Project) en fonction de l'avancement :

1.  **Not Started** :
    *   Le ticket est créé et priorisé dans le backlog.
2.  **In Progress** :
    *   Le ticket est assigné à un développeur.
    *   Il crée sa branche depuis `develop` (`git checkout -b feat/12-login develop`).
    *   Le développement est en cours.
3.  **Waiting** :
    *   Le ticket est en attente d'une action, bloqué ou nécessite une validation.
    *   *Exemples :*
        *   Une MR est ouverte et attend la validation d'un autre dev (Code Review).
        *   Un bug bloquant empêche de continuer.
        *   En attente d'approbation fonctionnelle ou technique.
        *   Des limitations techniques nécessitent une décision avant de poursuivre.
4.  **Done** :
    *   La MR est validée et mergée dans `develop`.
    *   La branche est supprimée et le ticket est clos.

## 3. Automatisation

Nous utilisons **Zapier** pour automatiser certaines tâches entre Notion et GitHub.

### Fonctionnement actuel
Lorsqu'un ticket est créé dans Notion, Zapier tente de créer automatiquement la branche correspondante sur GitHub.

### Limitations connues
*   **Décalage de ticket** : Actuellement, l'automatisation a un bug qui fait qu'elle traite parfois le ticket précédent au lieu du nouveau ticket qui vient d'être créé.
*   **Type de branche unique** : L'automatisation crée systématiquement des branches de type `feat/`.
    *   *Amélioration idéale* : Il faudrait ajouter un tag "Fix" ou "Feature" dans Notion pour permettre à Zapier de choisir le bon préfixe (`fix/` ou `feat/`).
    *   *Raison* : La complexité d'implémentation d'une telle logique conditionnelle est disproportionnée par rapport aux besoins du projet. De plus, une solution robuste nécessiterait l'accès aux fonctionnalités avancées (payantes) de l'outil.
