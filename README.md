# Devoir 1 - Catalogue de Bibliothèque

# Description
- Application web interactive de gestion de catalogue de bibliothèque développée en HTML5 sémantique, CSS (sans framework) et JavaScript. Elle permet de consulter, rechercher en temps réel, filtrer par catégorie et statut de disponibilité, trier, ajouter de nouveaux livres avec validation stricte et supprimer des livres avec confirmation, le tout persisté via 'localStorage'.

# Mode d'emploi
1. Ouvrez le fichier "index.html" dans un navigateur web récent (Chrome, Firefox ou Edge).
2. Utilisez la barre de recherche et les filtres pour affiner l'affichage du catalogue.
3. Remplissez le formulaire en bas de page pour ajouter un livre (contrôles de validation intégrés).
4. Cliquez sur "Supprimer" sur une carte pour retirer un livre.
5. Utilisez le bouton "Réinitialiser les données" pour restaurer le catalogue initial.

# Choix de conception
- **Approche Mobile-First* : Utilisation de CSS Grid et Flexbox avec des points de rupture ('@media') pour s'adapter proprement des téléphones aux écrans d'ordinateurs.

- Les balises sémantiques donnent un sens explicite au contenu (accessibilité pour les lecteurs d'écran via des repères clairs), améliorent le référencement naturel (SEO) en indiquant l'importance des structures aux moteurs de recherche, facilitent grandement la maintenance et la lisibilité du code par toute l'équipe, permettent une meilleure adaptation multi-appareils native et structurent proprement le DOM sans surcharger d'attributs de classes superflus.

- **Accessibilité*: Utilisation de balises sémantiques, d'attributs ARIA ('aria-live'), de labels associés et de styles de focus visibles (':focus-visible').

- "forEach" exécute une fonction donnée sur chaque élément d'un tableau, mais ne retourne rien (undefined). Il est utilisé pour effectuer des effets secondaires (par exemple, manipuler le DOM).
- "map" parcourt le tableau, applique une transformation à chaque élément et retourne un nouveau tableau de même taille contenant les éléments transformés.
- "filter" parcourt le tableau et retourne un nouveau tableau contenant uniquement les éléments qui passent le test spécifié (condition booléenne).

- J'ai utilisé filter pour isoler les livres correspondants aux critères de recherche et de sélection, et forEach pour parcourir les résultats filtrés et générer dynamiquement les cartes dans le DOM.

- **Manipulation dynamique du DOM*: Création sécurisée des éléments de cartes via 'document.createElement` pour éviter les failles XSS et respecter les bonnes pratiques.


# Difficultés rencontrées
- La structuration des grilles CSS pour s'adapter harmonieusement sur tous les types d'écrans sans l'aide de frameworks CSS.

# Sources et Outils d'assistance
- Cours et notes du LOG3550
- Documentation MDN Web Docs (JavaScript, CSS Grid, LocalStorage)
- Gemini

