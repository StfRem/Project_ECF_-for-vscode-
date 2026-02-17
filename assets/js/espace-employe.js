// ======================================================
// SÉCURITÉ EMPLOYÉ
// ======================================================
const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "employe") {
    alert("Accès réservé aux employés.");
    location.href = "./login.html";
}

// ======================================================
// DONNÉES
// ======================================================
let commandes = JSON.parse(localStorage.getItem("commandes")) || [];
let avis = JSON.parse(localStorage.getItem("avis")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let menus = JSON.parse(localStorage.getItem("menus")) || [];
let plats = JSON.parse(localStorage.getItem("plats")) || [];
let horaires = JSON.parse(localStorage.getItem("horaires")) || [];

// ======================================================
// SÉLECTEURS
// ======================================================
const filtreStatut = document.getElementById("filtre-statut");
const filtreClient = document.getElementById("filtre-client");
const listeCommandes = document.getElementById("liste-commandes");
const listeAvis = document.getElementById("liste-avis");

const listeMenus = document.getElementById("liste-menus");
const btnAjoutMenu = document.getElementById("btn-ajout-menu");

const listePlats = document.getElementById("liste-plats");
const btnAjoutPlat = document.getElementById("btn-ajout-plat");

const listeHoraires = document.getElementById("liste-horaires");
const btnAjoutHoraire = document.getElementById("btn-ajout-horaire");

// ======================================================
// FILTRES COMMANDES
// ======================================================
filtreStatut.addEventListener("change", afficherCommandes);
filtreClient.addEventListener("input", afficherCommandes);

// ======================================================
// MENUS
// ======================================================
function afficherMenus() {
    listeMenus.innerHTML = "";

    if (menus.length === 0) {
        listeMenus.innerHTML = "<p>Aucun menu enregistré.</p>";
        return;
    }

    menus.forEach(menu => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${menu.nom}</strong><br>
            ${menu.description}<br>
            Prix : ${menu.prix} €<br>
            <button class="btn-modifier-menu" data-id="${menu.id}">Modifier</button>
            <button class="btn-supprimer-menu" data-id="${menu.id}">Supprimer</button>
        `;
        listeMenus.appendChild(li);
    });
}

btnAjoutMenu.addEventListener("click", () => {
    const nom = prompt("Nom du menu :");
    const description = prompt("Description :");
    const prix = prompt("Prix :");

    if (!nom || !description || !prix) return alert("Tous les champs sont obligatoires.");

    menus.push({
        id: "MENU-" + Date.now(),
        nom,
        description,
        prix: parseFloat(prix)
    });

    localStorage.setItem("menus", JSON.stringify(menus));
    afficherMenus();
});

// ======================================================
// PLATS
// ======================================================
function afficherPlats() {
    listePlats.innerHTML = "";

    if (plats.length === 0) {
        listePlats.innerHTML = "<p>Aucun plat enregistré.</p>";
        return;
    }

    plats.forEach(plat => {
        const li = document.createElement("li");
        li.classList.add("admin-item");

        li.innerHTML = `
            <div class="admin-item-info">
                <strong>${plat.nom}</strong>
                <span>${plat.description}</span>
            </div>
            <div class="admin-actions">
                <button class="btn-modifier-plat" data-id="${plat.id}">Modifier</button>
                <button class="btn-supprimer-plat btn-danger" data-id="${plat.id}">Supprimer</button>
            </div>
        `;
        listePlats.appendChild(li);
    });
}

btnAjoutPlat.addEventListener("click", () => {
    const entree = prompt("Nom de l'entrée (laisser vide si aucun)");
    if (entree) plats.push({ id: "PLAT-" + Date.now(), nom: entree, description: prompt("Description :") });

    const plat = prompt("Nom du plat principal (laisser vide si aucun)");
    if (plat) plats.push({ id: "PLAT-" + (Date.now() + 1), nom: plat, description: prompt("Description :") });

    const dessert = prompt("Nom du dessert (laisser vide si aucun)");
    if (dessert) plats.push({ id: "PLAT-" + (Date.now() + 2), nom: dessert, description: prompt("Description :") });

    localStorage.setItem("plats", JSON.stringify(plats));
    afficherPlats();
});

// ======================================================
// HORAIRES
// ======================================================
function afficherHoraires() {
    listeHoraires.innerHTML = "";

    if (horaires.length === 0) {
        listeHoraires.innerHTML = "<p>Aucun horaire enregistré.</p>";
        return;
    }

    horaires.forEach(h => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${h.jour}</strong> : ${h.ouverture} - ${h.fermeture}<br>
            <button class="btn-modifier-horaire" data-id="${h.id}">Modifier</button>
            <button class="btn-supprimer-horaire" data-id="${h.id}">Supprimer</button>
        `;
        listeHoraires.appendChild(li);
    });
}

btnAjoutHoraire.addEventListener("click", () => {
    const jour = prompt("Jour :");
    const ouverture = prompt("Ouverture :");
    const fermeture = prompt("Fermeture :");

    if (!jour || !ouverture || !fermeture) return alert("Tous les champs sont obligatoires.");

    horaires.push({
        id: "HORAIRE-" + Date.now(),
        jour,
        ouverture,
        fermeture
    });

    localStorage.setItem("horaires", JSON.stringify(horaires));
    afficherHoraires();
});

// ======================================================
// COMMANDES
// ======================================================
function afficherCommandes() {
    listeCommandes.innerHTML = "";

    const recherche = filtreClient.value.toLowerCase();
    const statutFiltre = filtreStatut.value;

    const commandesFiltrees = commandes.filter(cmd => {
        const client = users.find(u => u.id === cmd.userId);

        const matchStatut = statutFiltre === "" || cmd.statut === statutFiltre;
        const matchNom =
            recherche === "" ||
            (client && client.fullname.toLowerCase().includes(recherche));

        return matchStatut && matchNom;
    });

    if (commandesFiltrees.length === 0) {
        listeCommandes.innerHTML = "<p>Aucune commande trouvée.</p>";
        return;
    }

    commandesFiltrees.forEach(cmd => {
        const li = document.createElement("li");
        li.classList.add("admin-item");

        li.innerHTML = `
            <div class="admin-item-info">
                <strong>${cmd.menuTitre}</strong>
                <span>Prestation : ${cmd.datePrestation} à ${cmd.heurePrestation}</span>
                <span>Statut : <strong>${cmd.statut}</strong></span>
            </div>
            <div class="admin-actions">
                <select class="select-statut" data-id="${cmd.id}">
                    <option value="">Changer statut</option>
                    <option value="accepté">Accepté</option>
                    <option value="en préparation">En préparation</option>
                    <option value="en cours de livraison">En cours de livraison</option>
                    <option value="livré">Livré</option>
                    <option value="en attente du retour de matériel">En attente du retour de matériel</option>
                    <option value="terminée">Terminée</option>
                </select>
                <button class="btn-annuler btn-danger" data-id="${cmd.id}">Annuler</button>
            </div>
        `;
        listeCommandes.appendChild(li);
    });
}

// ======================================================
// STATUT & ANNULATION
// ======================================================
document.addEventListener("change", e => {
    if (!e.target.classList.contains("select-statut")) return;

    const id = e.target.dataset.id;
    const statut = e.target.value;
    if (!statut) return;

    const cmd = commandes.find(c => c.id === id);
    if (!cmd) return;

    cmd.historique = cmd.historique || [];
    cmd.historique.push({ date: new Date().toISOString(), action: `Statut changé : ${statut}` });
    cmd.statut = statut;

    localStorage.setItem("commandes", JSON.stringify(commandes));
    afficherCommandes();
});

document.addEventListener("click", e => {
    if (!e.target.classList.contains("btn-annuler")) return;

    const id = e.target.dataset.id;
    const cmd = commandes.find(c => c.id === id);
    if (!cmd) return;

    const contact = prompt("Mode de contact :");
    const motif = prompt("Motif :");
    if (!contact || !motif) return alert("Annulation incomplète.");

    cmd.historique = cmd.historique || [];
    cmd.historique.push({ date: new Date().toISOString(), action: `Commande annulée (${contact}) : ${motif}` });
    cmd.statut = "annulée";

    localStorage.setItem("commandes", JSON.stringify(commandes));
    afficherCommandes();
});

// ======================================================
// AVIS
// ======================================================
function afficherAvis() {
    listeAvis.innerHTML = "";
    const attente = avis.filter(a => a.statut === "en attente");

    if (attente.length === 0) {
        listeAvis.innerHTML = "<p>Aucun avis en attente.</p>";
        return;
    }

    attente.forEach(a => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${a.nomClient}</strong> (${a.note}/5)<br>
            "${a.commentaire}"<br>
            <button class="btn-valider-avis" data-id="${a.id}">Valider</button>
            <button class="btn-refuser-avis" data-id="${a.id}">Refuser</button>
        `;
        listeAvis.appendChild(li);
    });
}

document.addEventListener("click", e => {
    if (e.target.classList.contains("btn-valider-avis")) {
        avis = avis.map(a => a.id === e.target.dataset.id ? { ...a, statut: "validé" } : a);
    }
    if (e.target.classList.contains("btn-refuser-avis")) {
        avis = avis.filter(a => a.id !== e.target.dataset.id);
    }
    localStorage.setItem("avis", JSON.stringify(avis));
    afficherAvis();
});

// ======================================================
// AFFICHAGE INITIAL
// ======================================================
afficherMenus();
afficherPlats();
afficherHoraires();
afficherCommandes();
afficherAvis();
