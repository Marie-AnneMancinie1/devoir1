// Gestion de l'état global et du LocalStorage
const STORAGE_KEY = 'bibliotheque_books_v1';

let books = loadBooks();

function loadBooks() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Erreur lors de la lecture du LocalStorage", e);
        }
    }
    return [...initialBooks];
}

function saveBooks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Sélecteurs DOM
const booksContainer = document.getElementById('books-container');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort-select');
const availableFilter = document.getElementById('available-filter');
const resultsCount = document.getElementById('results-count');
const noResultsMessage = document.getElementById('no-results-message');
const addBookForm = document.getElementById('add-book-form');
const resetStorageBtn = document.getElementById('reset-storage-btn');

// Normalisation pour recherche insensible aux accents et à la casse
function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Fonction d'affichage principale
function renderBooks() {
    // 1. Récupération des valeurs des filtres
    const searchTerm = normalizeString(searchInput.value.trim());
    const selectedCategory = categoryFilter.value;
    const onlyAvailable = availableFilter.checked;
    const sortValue = sortSelect.value;

    // 2. Filtrage
    let filtered = books.filter(book => {
        const matchTitleOrAuthor = normalizeString(book.titre).includes(searchTerm) || 
                                   normalizeString(book.auteur).includes(searchTerm);
        const matchCategory = selectedCategory === 'tous' || book.categorie === selectedCategory;
        const matchAvailability = !onlyAvailable || book.disponible === true;

        return matchTitleOrAuthor && matchCategory && matchAvailability;
    });

    // 3. Tri
    if (sortValue === 'titre-asc') {
        filtered.sort((a, b) => a.titre.localeCompare(b.titre, 'fr', { sensitivity: 'base' }));
    } else if (sortValue === 'titre-desc') {
        filtered.sort((a, b) => b.titre.localeCompare(a.titre, 'fr', { sensitivity: 'base' }));
    } else if (sortValue === 'annee-asc') {
        filtered.sort((a, b) => a.annee - b.annee);
    } else if (sortValue === 'annee-desc') {
        filtered.sort((a, b) => b.annee - a.annee);
    }

    // 4. Nettoyage du conteneur
    booksContainer.innerHTML = '';

    // 5. Affichage du compteur et gestion du message "aucun résultat"
    resultsCount.textContent = `${filtered.length} livre(s) trouvé(s)`;
    if (filtered.length === 0) {
        noResultsMessage.classList.remove('hidden');
    } else {
        noResultsMessage.classList.add('hidden');
    }

    // 6. Génération des cartes via le DOM (createElement)
    filtered.forEach(book => {
        const card = document.createElement('article');
        card.className = 'book-card';

        const infoDiv = document.createElement('div');
        
        const title = document.createElement('h3');
        title.textContent = book.titre;

        const author = document.createElement('p');
        author.className = 'author';
        author.textContent = `Par ${book.auteur}`;

        const details = document.createElement('div');
        details.className = 'details';

        const categoryBadge = document.createElement('span');
        categoryBadge.className = 'badge category';
        categoryBadge.textContent = book.categorie;

        const availabilityBadge = document.createElement('span');
        availabilityBadge.className = `badge ${book.disponible ? 'available' : 'borrowed'}`;
        availabilityBadge.textContent = book.disponible ? 'Disponible' : 'Emprunté';

        details.appendChild(categoryBadge);
        details.appendChild(availabilityBadge);

        const yearP = document.createElement('p');
        yearP.style.fontSize = '0.85rem';
        yearP.style.color = 'var(--text-light)';
        yearP.textContent = `Année : ${book.annee}`;

        infoDiv.appendChild(title);
        infoDiv.appendChild(author);
        infoDiv.appendChild(details);
        infoDiv.appendChild(yearP);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = 'Supprimer';
        deleteBtn.addEventListener('click', () => deleteBook(book.id));

        card.appendChild(infoDiv);
        card.appendChild(deleteBtn);

        booksContainer.appendChild(card);
    });
}

// Suppression avec confirmation
function deleteBook(id) {
    if (confirm("Voulez-vous vraiment supprimer ce livre ?")) {
        books = books.filter(b => b.id !== id);
        saveBooks();
        renderBooks();
    }
}

// Validation et Ajout d'un livre
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const yearInput = document.getElementById('year');
    const categorySelect = document.getElementById('category');
    const isAvailableCheckbox = document.getElementById('is-available');

    const titleError = document.getElementById('title-error');
    const authorError = document.getElementById('author-error');
    const yearError = document.getElementById('year-error');
    const categoryError = document.getElementById('category-error');

    // Réinitialisation des erreurs
    titleError.textContent = '';
    authorError.textContent = '';
    yearError.textContent = '';
    categoryError.textContent = '';

    let isValid = true;
    const currentYear = new Date().getFullYear();

    // Validation Titre
    if (titleInput.value.trim().length < 2) {
        titleError.textContent = "Le titre doit contenir au moins 2 caractères.";
        isValid = false;
    }

    // Validation Auteur
    if (authorInput.value.trim().length < 2) {
        authorError.textContent = "L'auteur doit contenir au moins 2 caractères.";
        isValid = false;
    }

    // Validation Année
    const yearVal = parseInt(yearInput.value, 10);
    if (isNaN(yearVal) || yearVal < 1450 || yearVal > currentYear) {
        yearError.textContent = "L'année doit être comprise entre 1450 et ${currentYear}.";
        isValid = false;
    }

    // Validation Catégorie
    if (!categorySelect.value) {
        categoryError.textContent = "Veuillez sélectionner une catégorie.";
        isValid = false;
    }

    if (!isValid) return;

    // Création du nouvel objet livre
    const newBook = {
        id: Date.now(), // ID unique basé sur le timestamp
        titre: titleInput.value.trim(),
        auteur: authorInput.value.trim(),
        annee: yearVal,
        categorie: categorySelect.value,
        disponible: isAvailableCheckbox.checked
    };

    books.push(newBook);
    saveBooks();
    renderBooks();
    addBookForm.reset();
});

// Réinitialisation des données de base
resetStorageBtn.addEventListener('click', () => {
    if (confirm("Voulez-vous réinitialiser le catalogue avec les données de départ ?")) {
        books = [...initialBooks];
        saveBooks();
        renderBooks();
    }
});

// Écouteurs d'événements pour les filtres et recherche en temps réel
searchInput.addEventListener('input', renderBooks);
categoryFilter.addEventListener('change', renderBooks);
sortSelect.addEventListener('change', renderBooks);
availableFilter.addEventListener('change', renderBooks);

// Premier affichage au chargement de la page
renderBooks();