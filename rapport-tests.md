# Rapport de tests

Date : 12 novembre 2026  
Environnement : https://cartes.mut-dev.ign.fr/creer-une-carte/

## Résumé

- 7 specs Cypress détectées avec Cypress 15.10.0, Electron 138 et Node.js 24.7.0.
- Aucun résultat pass/fail n'a été produit : les deux exécutions ont été interrompues après être restées bloquées dans `main_spec.cy.js`.
- Les six autres specs n'ont pas été atteintes.

## Exécution Cypress

1. Premier lancement : aucune progression après le démarrage de `main_spec.cy.js`; processus arrêté après environ 11 minutes.
2. Second lancement : délais Cypress réduits (`pageLoadTimeout=20 s`, `defaultCommandTimeout=5 s`); même blocage, processus arrêté après environ 8 minutes.

Le test `main_spec.cy.js` attend l'ancien parcours de connexion (`Se connecter`, puis les champs `[name="username"]` et `[name="password"]`). Sur l'environnement testé, l'URL redirige vers l'écran SSO de Géoplateforme. Cette différence est une piste probable pour le blocage, mais l'exécution n'a pas fourni d'erreur Cypress permettant de la confirmer.

## Vérifications navigateur

- La page redirige vers la connexion SSO de l'environnement `qua`.
- Le formulaire SSO et les options FranceConnect et ProConnect sont visibles.
- La console rapporte `NO CONFIG FILE!`, puis une exception `TypeError` sur `localeCompare` pendant l'initialisation du catalogue.
- La page de connexion a pu être affichée; aucune authentification ni opération sur une carte n'a été effectuée dans cette vérification.

## Environnement et limites

- Dépendances installées avec `npm ci`; la commande a signalé 9 vulnérabilités (3 modérées, 6 élevées).
- Le rapport ne contient aucun identifiant ni mot de passe.
- Les tests nécessitent une adaptation du parcours d'authentification SSO avant de pouvoir établir un bilan complet.
