Mise en place de ma structure de dossier:
-Dossier Assets qui contient mon dossier css et mon dossier js ainsi que mon dossier images 
-J'ai lié bootstrap en cdn ainsi que mon style.css dans le header de mon index.html 
-J 'ai lié mon script.js et ajout du script js de bootstrap juste avant la fermeture du body pour une meilleur compatibilité pas besoin d'ajouté "defer" dans le head ma solution est plus simple
- J'ai télécharger la police Roboto sur google fonts pour l'intégrer dans mon style.css pour que cette police s'affiche chez tous le monde
- Creation des pages .html en fonction de mon cahier des charges

Git et Github
- Une fois ma structure terminé j'ai initialiser mon dossier avec git ,ajouté un commit et synchronisé sur mon Github sur le la branche main en public. Cela fait j'ai ajouté la branche "developpement" pour travaillé et testé mon code avant la version final qui sera envoyé elle sur ma branche main


database.sql fait a a a partir de vscode pour ensuite l'injecter dans phpadmin via wamp.
les id sont en auto increment j'ai utiliser innodb plus securisé

La base SQL stocke toutes les données métier essentielles : menus, plats, utilisateurs, employés, commandes, avis validés, horaires, images.
Elle contient les données officielles et structurées nécessaires au fonctionnement de l’application.


La base NoSQL stocke l’HISTORIQUE complet des ACTIONS réalisées dans l’application : création d’un employé, modification d’un menu, changement de statut d’une commande, envoi d’emails, relances, connexions, etc.
C’est un journal de bord détaillé, utilisé pour le suivi, la traçabilité et la conformité RGPD.

🧱 InnoDB vs MyISAM — la différence essentielle
✔️ InnoDB = moteur moderne, sécurisé, fiable
❌ MyISAM = ancien moteur, limité, plus utilisé en production

 1. InnoDB

Avantages :
- ✔️ Gère les clés étrangères (FOREIGN KEY)
→ indispensable pour relier menus, plats, commandes, users, etc.
- ✔️ Transactions (BEGIN, COMMIT, ROLLBACK)
→ super important pour éviter les commandes incomplètes.
- ✔️ Sécurité des données
→ si ton serveur plante, InnoDB récupère les données.
- ✔️ Verrouillage ligne par ligne
→ plusieurs employés peuvent modifier des commandes en même temps.
- ✔️ Performances stables pour les gros projets.
👉 InnoDB = moteur professionnel

2. MyISAM — ancien moteur, à éviter
MyISAM était utilisé avant 2010. Aujourd’hui, il est déconseillé.
Inconvénients :
- ❌ Pas de clés étrangères
→ impossible de garantir l’intégrité entre tables.
- ❌ Pas de transactions
→ si une commande plante en plein milieu, tu perds des données.
- ❌ Verrouillage de table complète
→ si un employé modifie une commande, les autres doivent attendre.
- ❌ Moins sécurisé
→ crash = perte de données possible.
- ❌ Pas adapté aux applications modernes.
👉 MyISAM = obsolète pour un vrai projet


ajout horaires: j'ai mis une fonction pour trié les jours de la semaine dans l'ordre du lundi au dimanche ce qui me permet d'effacer mercredi. de recreé mercredi avecles horaires et qu'il soit bien positionné dans la liste
