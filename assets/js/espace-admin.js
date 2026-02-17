// UTILITAIRES
const getFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
const saveToLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Vérification du rôle administrateur
const user = getFromLocalStorage("user");
if (!user || user.role !== "admin") {
    alert("Accès réservé à l'administrateur.");
    location.href = "./login.html";
}

// DONNÉES
let commandes = getFromLocalStorage("commandes");
let avis = getFromLocalStorage("avis");
let users = getFromLocalStorage("users");
let menus = getFromLocalStorage("menus");
let plats = getFromLocalStorage("plats");
let horaires = getFromLocalStorage("horaires");

// SÉLECTEURS
const listeEmployes = document.getElementById("liste-employes");
const listeMenus = document.getElementById("liste-menus");
const listePlats = document.getElementById("liste-plats");
const listeHoraires = document.getElementById("liste-horaires");
const listeCommandes = document.getElementById("liste-commandes");
const listeAvis = document.getElementById("liste-avis");
const filtreStatut = document.getElementById("filtre-statut");
const filtreClient = document.getElementById("filtre-client");

// FONCTIONS GÉNÉRIQUES
function afficherListe(listeElement, data, renderItem, emptyMessage) {
    listeElement.innerHTML = data.length === 0 ? `<p>${emptyMessage}</p>` : "";
    data.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = renderItem(item);
        listeElement.appendChild(li);
    });
}

function supprimerElement(data, setData, id, message) {
    if (confirm(message)) {
        const newData = data.filter(item => item.id !== id);
        setData(newData);
        return true;
    }
    return false;
}

// AFFICHAGE EMPLOYÉS
function afficherEmployes() {
    const employes = users.filter(u => u.role === "employe");
    afficherListe(
        listeEmployes,
        employes,
        (emp) => `
            <strong>${emp.fullname}</strong><br>
            Email : ${emp.email}<br>
            Statut : <strong>${emp.suspendu ? "EN SUSPENS" : "Actif"}</strong><br>
            <button class="btn-suspend" data-id="${emp.id}">
                ${emp.suspendu ? "Réactiver" : "Suspendre"}
            </button>
            <button class="btn-supprimer" data-id="${emp.id}">Supprimer</button>
        `,
        "Aucun employé enregistré."
    );
}

// AFFICHAGE MENUS
function afficherMenus() {
    afficherListe(
        listeMenus,
        menus,
        (menu) => `
            <strong>${menu.nom}</strong><br>
            ${menu.description}<br>
            Prix : ${menu.prix} €<br>
            <button class="btn-modifier-menu" data-id="${menu.id}">Modifier</button>
            <button class="btn-supprimer-menu" data-id="${menu.id}">Supprimer</button>
        `,
        "Aucun menu enregistré."
    );
}

// AFFICHAGE PLATS
function afficherPlats() {
    afficherListe(
        listePlats,
        plats,
        (plat) => `
            <div class="admin-item-info">
                <strong>${plat.nom}</strong>
                <span>${plat.description}</span>
            </div>
            <div class="admin-actions">
                <button class="btn-action btn-modifier-plat" data-id="${plat.id}">Modifier</button>
                <button class="btn-danger btn-supprimer-plat" data-id="${plat.id}">Supprimer</button>
            </div>
        `,
        "Aucun plat enregistré."
    );
}

// AFFICHAGE HORAIRES
function afficherHoraires() {
    afficherListe(
        listeHoraires,
        horaires,
        (h) => `
            <strong>${h.jour}</strong> : ${h.ouverture} - ${h.fermeture}<br>
            <button class="btn-modifier-horaire" data-id="${h.id}">Modifier</button>
            <button class="btn-supprimer-horaire" data-id="${h.id}">Supprimer</button>
        `,
        "Aucun horaire enregistré."
    );
}

// AFFICHAGE COMMANDES
function afficherCommandes() {
    const recherche = filtreClient.value.toLowerCase();
    const statutFiltre = filtreStatut.value;
    const commandesFiltrees = commandes.filter(cmd => {
        const client = users.find(u => u.id === cmd.userId);
        const matchStatut = statutFiltre === "" || cmd.statut === statutFiltre;
        const matchNom = client ? client.fullname.toLowerCase().includes(recherche) : false;
        return matchStatut && matchNom;
    });

    listeCommandes.innerHTML = commandesFiltrees.length === 0 ? "<p>Aucune commande trouvée.</p>" : "";
    commandesFiltrees.forEach(cmd => {
        const client = users.find(u => u.id === cmd.userId);
        const li = document.createElement("li");
        li.classList.add("admin-item");
        li.innerHTML = `
            <div class="admin-item-info">
                <strong>Commande #${cmd.id}</strong>
                <span>Client : ${client ? client.fullname : "Inconnu"}</span>
                <span>Menu : ${cmd.menuTitre}</span>
                <span>Nombre de personnes : ${cmd.nbPersonnes}</span>
                <span>Prix total : ${cmd.prixTotal} €</span>
                <span>Prestation : ${cmd.datePrestation.split('-').reverse().join('-')} à ${cmd.heurePrestation}</span>
                <span>Adresse : ${cmd.adresse}, ${cmd.cp}, ${cmd.ville}</span>
                <span>Téléphone : ${cmd.telephone}</span>
                <span>Statut actuel : <strong>${cmd.statut}</strong></span>
                ${cmd.materiel ? '<span style="color:red;">⚠️ Matériel en prêt</span>' : ''}
            </div>
            <div class="admin-actions">
                <select class="select-statut" data-id="${cmd.id}">
                    <option value="">Changer statut</option>
                    <option value="accepté">Accepté</option>
                    <option value="en préparation">En préparation</option>
                    <option value="en cours de livraison">En cours de livraison</option>
                    <option value="livré">Livré</option>
                    <option value="terminée">Terminée</option>
                    ${cmd.materiel ? '<option value="en attente du retour de matériel">Retour matériel</option>' : ''}
                </select>
                <button class="btn-danger btn-annuler" data-id="${cmd.id}">Annuler</button>
            </div>
        `;
        listeCommandes.appendChild(li);
    });
}

// AFFICHAGE AVIS
function afficherAvis() {
    const avisEnAttente = avis.filter(a => a.statut === "en attente");
    afficherListe(
        listeAvis,
        avisEnAttente,
        (a) => `
            <strong>${a.nomClient}</strong><br>
            Note : ${a.note}/5<br>
            "${a.commentaire}"<br>
            <button class="btn-valider-avis" data-id="${a.id}">Valider</button>
            <button class="btn-refuser-avis" data-id="${a.id}">Refuser</button>
        `,
        "Aucun avis en attente."
    );
}

// ÉCOUTEURS D'ÉVÉNEMENTS
document.addEventListener("click", (e) => {
    const id = e.target.dataset.id;

    // EMPLOYÉS
    if (e.target.classList.contains("btn-suspend")) {
        users = users.map(u => u.id === id ? {...u, suspendu: !u.suspendu} : u);
        saveToLocalStorage("users", users);
        afficherEmployes();
    }
    if (e.target.classList.contains("btn-supprimer")) {
        if (supprimerElement(users, (newData) => { users = newData; }, id, "Supprimer cet employé ?")) {
            saveToLocalStorage("users", users);
            afficherEmployes();
        }
    }

    // MENUS
    if (e.target.classList.contains("btn-supprimer-menu")) {
        if (supprimerElement(menus, (newData) => { menus = newData; }, id, "Supprimer ce menu ?")) {
            saveToLocalStorage("menus", menus);
            afficherMenus();
        }
    }
    if (e.target.classList.contains("btn-modifier-menu")) {
        const menu = menus.find(m => m.id === id);
        if (!menu) return;
        const nom = prompt("Nom du menu :", menu.nom);
        const description = prompt("Description :", menu.description);
        const prix = prompt("Prix :", menu.prix);
        if (!nom || !description || !prix) {
            alert("Tous les champs sont obligatoires.");
            return;
        }
        menu.nom = nom;
        menu.description = description;
        menu.prix = parseFloat(prix);
        saveToLocalStorage("menus", menus);
        afficherMenus();
    }

    // PLATS
    if (e.target.classList.contains("btn-supprimer-plat")) {
        if (supprimerElement(plats, (newData) => { plats = newData; }, id, "Supprimer ce plat ?")) {
            saveToLocalStorage("plats", plats);
            afficherPlats();
        }
    }
    if (e.target.classList.contains("btn-modifier-plat")) {
        const plat = plats.find(p => p.id === id);
        if (!plat) return;
        const nom = prompt("Nom du plat :", plat.nom);
        const description = prompt("Description :", plat.description);
        if (!nom || !description) {
            alert("Tous les champs sont obligatoires.");
            return;
        }
        plat.nom = nom;
        plat.description = description;
        saveToLocalStorage("plats", plats);
        afficherPlats();
    }

    // HORAIRES
    if (e.target.classList.contains("btn-supprimer-horaire")) {
        if (supprimerElement(horaires, (newData) => { horaires = newData; }, id, "Supprimer cet horaire ?")) {
            saveToLocalStorage("horaires", horaires);
            afficherHoraires();
        }
    }
    if (e.target.classList.contains("btn-modifier-horaire")) {
        const h = horaires.find(h => h.id === id);
        if (!h) return;
        const jour = prompt("Jour :", h.jour);
        const ouverture = prompt("Heure d'ouverture :", h.ouverture);
        const fermeture = prompt("Heure de fermeture :", h.fermeture);
        if (!jour || !ouverture || !fermeture) {
            alert("Tous les champs sont obligatoires.");
            return;
        }
        h.jour = jour;
        h.ouverture = ouverture;
        h.fermeture = fermeture;
        saveToLocalStorage("horaires", horaires);
        afficherHoraires();
    }

    // COMMANDES
    if (e.target.classList.contains("btn-annuler")) {
        const commande = commandes.find(cmd => cmd.id === id);
        if (!commande) return;
        const contact = prompt("Mode de contact utilisé pour prévenir le client (appel, mail...) :");
        const motif = prompt("Motif de l'annulation :");
        if (!contact || !motif) {
            alert("Annulation annulée : tous les champs sont obligatoires.");
            return;
        }
        commande.historique = commande.historique || [];
        commande.historique.push({
            date: new Date().toISOString(),
            action: `Commande annulée (${contact}) : ${motif}`
        });
        commande.statut = "annulée";
        saveToLocalStorage("commandes", commandes);
        afficherCommandes();
        alert("Commande annulée avec succès !");
    }

    // AVIS
    if (e.target.classList.contains("btn-valider-avis")) {
        avis = avis.map(a => a.id === id ? { ...a, statut: "validé" } : a);
        saveToLocalStorage("avis", avis);
        afficherAvis();
    }
    if (e.target.classList.contains("btn-refuser-avis")) {
        avis = avis.filter(a => a.id !== id);
        saveToLocalStorage("avis", avis);
        afficherAvis();
    }
});

// CHANGEMENT DE STATUT COMMANDE
document.addEventListener("change", (e) => {
    if (e.target.classList.contains("select-statut")) {
        const id = e.target.dataset.id;
        const commande = commandes.find(cmd => cmd.id === id);
        if (!commande) return;
        const nouveauStatut = e.target.value;
        if (!nouveauStatut) return;
        commande.statut = nouveauStatut;
        if (nouveauStatut === "en attente du retour de matériel") {
            alert(`Email envoyé :
Objet : Retour de matériel
Bonjour,
Vous avez 10 jours pour restituer le matériel. Sinon, 600€ de frais seront appliqués.
Cordialement, L'équipe Vite & Gourmand`);
        }
        saveToLocalStorage("commandes", commandes);
        afficherCommandes();
    }
});

// FILTRES COMMANDES
filtreStatut.addEventListener("change", afficherCommandes);
filtreClient.addEventListener("input", afficherCommandes);

// CRÉATION EMPLOYÉ
document.getElementById("btn-ajout-employe").addEventListener("click", () => {
    const fullname = prompt("Nom et Prénom de l'employé :");
    const email = prompt("Email de l'employé :");
    const password = prompt("Mot de passe temporaire :");
    if (!fullname || !email || !password) {
        alert("Tous les champs sont obligatoires.");
        return;
    }
    const nouvelEmploye = {
        id: "EMP-" + Date.now(),
        fullname,
        email,
        password,
        role: "employe",
        suspendu: false
    };
    users.push(nouvelEmploye);
    saveToLocalStorage("users", users);
    alert(`Employé créé avec succès !\n\nUn email a été envoyé à ${email}.\nBonjour ${fullname}, votre compte employé a été créé. Vous devez contacter Julie ou José pour obtenir votre mot de passe définitif. L'équipe Vite & Gourmand vous souhaite la bienvenue au sein de son équipe. Bonne journée.`);
    afficherEmployes();
});

// CRÉATION MENU
document.getElementById("btn-ajout-menu").addEventListener("click", () => {
    const nom = prompt("Nom du menu :");
    const description = prompt("Description :");
    const prixStr = prompt("Prix :");
    const prix = parseFloat(prixStr);
    if (!nom || !description || !prixStr || isNaN(prix) || prix <= 0) {
        alert("Tous les champs sont obligatoires et le prix doit être valide.");
        return;
    }
    menus.push({
        id: "MENU-" + Date.now(),
        nom: nom.trim(),
        description: description.trim(),
        prix: prix
    });
    saveToLocalStorage("menus", menus);
    afficherMenus();
    alert("Menu créé avec succès !");
});

// CRÉATION PLAT
document.getElementById("btn-ajout-plat").addEventListener("click", () => {
    const ajouterPlat = (type) => {
        const nom = prompt(`Nom du ${type} (laisser vide si aucun) :`);
        if (nom) {
            const description = prompt(`Description du ${type} :`);
            plats.push({
                id: "PLAT-" + Date.now(),
                nom: nom.trim(),
                description: description.trim()
            });
        }
    };
    ajouterPlat("entrée");
    ajouterPlat("plat principal");
    ajouterPlat("dessert");
    saveToLocalStorage("plats", plats);
    afficherPlats();
    alert("Plat(s) ajouté(s) avec succès !");
});

// CRÉATION HORAIRE
document.getElementById("btn-ajout-horaire").addEventListener("click", () => {
    const jour = prompt("Jour (ex : Lundi) :");
    const ouverture = prompt("Heure d'ouverture (ex : 09:00) :");
    const fermeture = prompt("Heure de fermeture (ex : 18:00) :");
    if (!jour || !ouverture || !fermeture) {
        alert("Tous les champs sont obligatoires.");
        return;
    }
    horaires.push({
        id: "HORAIRE-" + Date.now(),
        jour,
        ouverture,
        fermeture
    });
    saveToLocalStorage("horaires", horaires);
    afficherHoraires();
});

// AFFICHAGE INITIAL
afficherEmployes();
afficherMenus();
afficherPlats();
afficherHoraires();
afficherCommandes();
afficherAvis();
