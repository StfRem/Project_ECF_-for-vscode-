// Vérification de l'accès employé
const user = JSON.parse(localStorage.getItem("user"));
if (user?.role !== "employe") {
    alert("Accès réservé aux employés.");
    location.href = "./login.html";
}

// ======================================================
// DONNÉES
// ======================================================
let commandes = [];
let avisRecus = [];
let menus = JSON.parse(localStorage.getItem("menus")) || [];
let plats = JSON.parse(localStorage.getItem("plats")) || [];
let horaires = [];

// ======================================================
// UTILITAIRES
// ======================================================
const saveToLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

function supprimerElement(data, setData, id, message) {
    if (confirm(message)) {
        const newData = data.filter(item => item.id !== id);
        setData(newData);
        return true;
    }
    return false;
}

// ======================================================
// SÉLECTEURS
// ======================================================
const filtreStatut   = document.getElementById("filtre-statut");
const filtreClient   = document.getElementById("filtre-client");
const listeCommandes = document.getElementById("liste-commandes");
const listeAvis      = document.getElementById("liste-avis");
const listeMenus     = document.getElementById("liste-menus");
const listePlats     = document.getElementById("liste-plats");
const listeHoraires  = document.getElementById("liste-horaires");

// ======================================================
// FILTRES COMMANDES
// ======================================================
filtreStatut.addEventListener("change", afficherCommandes);
filtreClient.addEventListener("input", afficherCommandes);

// ======================================================
// MENUS (localStorage)
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

document.getElementById("btn-ajout-menu").addEventListener("click", () => {
    const nom         = prompt("Nom du menu :");
    const description = prompt("Description :");
    const prixStr     = prompt("Prix :");
    const prix        = Number.parseFloat(prixStr);

    if (!nom || !description || !prixStr || Number.isNaN(prix) || prix <= 0) {
        alert("Tous les champs sont obligatoires et le prix doit être valide.");
        return;
    }

    menus.push({
        id: "MENU-" + Date.now(),
        nom: nom.trim(),
        description: description.trim(),
        prix
    });

    saveToLocalStorage("menus", menus);
    afficherMenus();
    alert("Menu créé avec succès !");
});

// ======================================================
// PLATS (localStorage)
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
                <button class="btn-action btn-modifier-plat" data-id="${plat.id}">Modifier</button>
                <button class="btn-danger btn-supprimer-plat" data-id="${plat.id}">Supprimer</button>
            </div>
        `;
        listePlats.appendChild(li);
    });
}

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

// ======================================================
// COMMANDES (BDD via PHP)
// ======================================================
async function chargerCommandesDepuisServeur() {
    try {
        const response = await fetch("../PHP/getCommandesAdmin.php");
        const result   = await response.json();

        if (result.status === "success") {
            commandes = result.data;
            afficherCommandes();
        } else {
            console.error("Erreur chargement commandes :", result.message);
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

function afficherCommandes() {
    listeCommandes.innerHTML = "";

    const recherche    = filtreClient.value.toLowerCase();
    const statutFiltre = filtreStatut.value;

    const commandesFiltrees = commandes.filter(cmd => {
        const matchStatut = statutFiltre === "" || cmd.statut === statutFiltre;
        const matchNom    = cmd.client_nom.toLowerCase().includes(recherche);
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
                <strong>Commande #${cmd.id}</strong>
                <span>Client : ${cmd.client_nom}</span>
                <span>Menu : ${cmd.menuTitre}</span>
                <span>Nombre de personnes : ${cmd.nbPersonnes}</span>
                <span>Prix total : ${cmd.prixTotal} €</span>
                <span>Prestation : ${cmd.datePrestation.split('-').reverse().join('-')} à ${cmd.heurePrestation}</span>
                <span>Adresse : ${cmd.adresse}, ${cmd.cp}, ${cmd.ville}</span>
                <span>Téléphone : ${cmd.gsm}</span>
                <span class="statut-ligne">Statut actuel : <strong>${cmd.statut}</strong></span>
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

// ======================================================
// CHANGEMENT DE STATUT COMMANDE
// ======================================================
document.addEventListener("change", (e) => {
    if (!e.target.classList.contains("select-statut")) return;

    const id           = e.target.dataset.id;
    const nouveauStatut = e.target.value;
    if (!nouveauStatut) return;

    if (nouveauStatut === "en attente du retour de matériel") {
        alert(`Email envoyé :
Objet : Retour de matériel
Bonjour,
Vous avez 10 jours pour restituer le matériel. Sinon, 600€ de frais seront appliqués.
Cordialement, L'équipe Vite & Gourmand`);
    }

    fetch("../PHP/modifierStatutCommande.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, statut: nouveauStatut })
    })
        .then(r => r.json())
        .then(result => {
            if (result.success) {
                chargerCommandesDepuisServeur();
            } else {
                alert("Erreur : " + result.message);
            }
        });
});

// ======================================================
// ÉCOUTEURS d 'événements CLIC
// ======================================================
document.addEventListener("click", (e) => {
    const id = e.target.dataset.id;

    // MENUS
    if (e.target.classList.contains("btn-supprimer-menu")) handleSupprimerMenu(id);
    if (e.target.classList.contains("btn-modifier-menu")) handleModifierMenu(id);

    // PLATS
    if (e.target.classList.contains("btn-supprimer-plat")) handleSupprimerPlat(id);
    if (e.target.classList.contains("btn-modifier-plat")) handleModifierPlat(id);

    // COMMANDES
    if (e.target.classList.contains("btn-annuler")) handleAnnulerCommande(id);

    // AVIS
    if (e.target.classList.contains("btn-valider-avis") || e.target.classList.contains("btn-refuser-avis")) handleAvis(e);

    // HORAIRES
    if (e.target.classList.contains("btn-supprimer-horaire")) handleSupprimerHoraire(id);
    if (e.target.classList.contains("btn-modifier-horaire")) handleModifierHoraire(id);
});

// ======================================================
// HANDLERS - MENUS
// ======================================================
function handleSupprimerMenu(id) {
    if (supprimerElement(menus, (newData) => { menus = newData; }, id, "Supprimer ce menu ?")) {
        saveToLocalStorage("menus", menus);
        afficherMenus();
    }
}

function handleModifierMenu(id) {
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
    menu.prix = Number.parseFloat(prix);
    saveToLocalStorage("menus", menus);
    afficherMenus();
}

// ======================================================
// HANDLERS - PLATS
// ======================================================
function handleSupprimerPlat(id) {
    if (supprimerElement(plats, (newData) => { plats = newData; }, id, "Supprimer ce plat ?")) {
        saveToLocalStorage("plats", plats);
        afficherPlats();
    }
}

function handleModifierPlat(id) {
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

// ======================================================
// HANDLERS - COMMANDES
// ======================================================
function handleAnnulerCommande(id) {
    const commande = commandes.find(cmd => cmd.id === id);
    if (!commande) return;

    const contact = prompt("Mode de contact utilisé pour prévenir le client (appel ou mail) :");
    const motif = prompt("Motif de l'annulation :");

    if (!contact || !motif) {
        alert("Annulation incomplète : tous les champs sont obligatoires.");
        return;
    }

    fetch("../PHP/annulerCommande.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, contact, motif })
    })
        .then(r => r.json())
        .then(result => {
            if (result.success) {
                alert("Commande annulée avec succès !");
                chargerCommandesDepuisServeur();
            } else {
                alert("Erreur : " + result.message);
            }
        })
        .catch(err => {
            console.error("Erreur:", err);
            alert("Une erreur est survenue lors de l'annulation.");
        });
}

// ======================================================
// HANDLERS - AVIS
// ======================================================
function handleAvis(e) {
    const idAvis = e.target.dataset.id;
    const action = e.target.classList.contains("btn-valider-avis") ? "valider" : "supprimer";

    if (action === "supprimer" && !confirm("Supprimer cet avis ?")) return;

    fetch("../PHP/modifierStatutAvis.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idAvis, action })
    })
        .then(r => r.json())
        .then(result => {
            if (result.success) {
                chargerAvisDepuisServeur();
            }
        })
        .catch(err => {
            console.error("Erreur:", err);
            alert("Une erreur est survenue.");
        });
}

// ======================================================
// HANDLERS - HORAIRES
// ======================================================
function handleSupprimerHoraire(id) {
    if (confirm("Supprimer cet horaire ?")) {
        fetch("../PHP/supprimerHoraire.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        })
            .then(r => r.json())
            .then(() => chargerHorairesDepuisServeur())
            .catch(err => {
                console.error("Erreur:", err);
                alert("Une erreur est survenue.");
            });
    }
}

function handleModifierHoraire(id) {
    const h = horaires.find(h => h.id === id);
    if (!h) return;

    const jour = prompt("Jour :", h.jour);
    const ouverture = prompt("Heure d'ouverture :", h.ouverture);
    const fermeture = prompt("Heure de fermeture :", h.fermeture);

    if (!jour || !ouverture || !fermeture) {
        alert("Tous les champs sont obligatoires.");
        return;
    }

    fetch("../PHP/modifierHoraire.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, jour, ouverture, fermeture })
    })
        .then(r => r.json())
        .then(() => chargerHorairesDepuisServeur())
        .catch(err => {
            console.error("Erreur:", err);
            alert("Une erreur est survenue lors de la modification.");
        });
}

// ======================================================
// AVIS (BDD via PHP)
// ======================================================
async function chargerAvisDepuisServeur() {
    try {
        const response = await fetch("../PHP/getAvis.php");
        const result   = await response.json();

        if (result.status === "success") {
            avisRecus = result.data;
            afficherAvis();
        } else {
            console.error("Erreur serveur :", result.message);
        }
    } catch (error) {
        console.error("Erreur réseau lors du chargement des avis :", error);
    }
}

function afficherAvis() {
    listeAvis.innerHTML = avisRecus.length === 0 ? "<p>Aucun avis en attente.</p>" : "";

    avisRecus.forEach(a => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${a.nom_client}</strong> (Commande #${a.commande_id})<br>
            Note : ${a.note}/5<br>
            "${a.commentaire}"<br>
            <button class="btn-valider-avis" data-id="${a.id}">Valider</button>
            <button class="btn-refuser-avis btn-danger" data-id="${a.id}">Supprimer</button>
        `;
        listeAvis.appendChild(li);
    });
}

// ======================================================
// HORAIRES (BDD via PHP)
// ======================================================
async function chargerHorairesDepuisServeur() {
    const response = await fetch("../PHP/get_horaires.php");
    const result   = await response.json();

    if (result.status === "success") {
        horaires = result.data;
        afficherHoraires();
    } else {
        console.error("Erreur chargement horaires :", result.message);
    }
}

function afficherHoraires() {
    const ordreJours = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

    const horairesTries = [...horaires].sort((a, b) => {
        return ordreJours.indexOf(a.jour.toLowerCase()) - ordreJours.indexOf(b.jour.toLowerCase());
    });

    listeHoraires.innerHTML = horairesTries.length === 0 ? "<p>Aucun horaire enregistré.</p>" : "";

    horairesTries.forEach(h => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${h.jour}</strong> : ${h.ouverture} - ${h.fermeture}<br>
            <button class="btn-modifier-horaire" data-id="${h.id}">Modifier</button>
            <button class="btn-supprimer-horaire" data-id="${h.id}">Supprimer</button>
        `;
        listeHoraires.appendChild(li);
    });
}

document.getElementById("btn-ajout-horaire").addEventListener("click", async () => {
    const jour      = prompt("Jour (ex : Lundi) :");
    const ouverture = prompt("Heure d'ouverture (ex : 09:00) :");
    const fermeture = prompt("Heure de fermeture (ex : 18:00) :");

    if (!jour || !ouverture || !fermeture) {
        alert("Tous les champs sont obligatoires.");
        return;
    }

    const response = await fetch("../PHP/ajoutHoraire.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jour, ouverture, fermeture })
    });

    const result = await response.json();
    if (result.success) {
        alert("Horaire ajouté !");
        chargerHorairesDepuisServeur();
    } else {
        alert("Erreur : " + result.message);
    }
});

// ======================================================
// AFFICHAGE INITIAL
// ======================================================
afficherMenus();
afficherPlats();
chargerCommandesDepuisServeur();
chargerAvisDepuisServeur();
chargerHorairesDepuisServeur();