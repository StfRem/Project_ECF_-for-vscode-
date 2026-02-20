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
let commandes = [];
//let avis = getFromLocalStorage("avis");// On garde les avis en localStorage pour éviter de devoir faire une requête à chaque validation/refus, mais on pourrait aussi les charger depuis le serveur si tu préfères
let avisRecus = [];  //gemini//
let users = getFromLocalStorage("users");
let menus = getFromLocalStorage("menus");
let plats = getFromLocalStorage("plats");
let horaires = [];

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

// AFFICHAGE COMMANDES
async function chargerCommandesDepuisServeur() {
    try {
        const response = await fetch("../PHP/getCommandesAdmin.php");
        const result = await response.json();

        if (result.status === "success") {
            commandes = result.data;   // Mise à jour de la variable globale
            afficherCommandes();       // On lance l'affichage une fois les données reçues
        } else {
            console.error("Erreur chargement commandes :", result.message);
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

// ON AFFICHE LA COMMANDE AVEC LES FILTRES APPLIQUÉS
function afficherCommandes() {
    const recherche = filtreClient.value.toLowerCase();
    const statutFiltre = filtreStatut.value;

    const commandesFiltrees = commandes.filter(cmd => {
        const matchStatut = statutFiltre === "" || cmd.statut === statutFiltre;
        const matchNom = cmd.client_nom.toLowerCase().includes(recherche);
        return matchStatut && matchNom;
    });

    listeCommandes.innerHTML = commandesFiltrees.length === 0
        ? "<p>Aucune commande trouvée.</p>"
        : "";

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

// AFFICHAGE AVIS
function afficherAvis() {
    const listeAvis = document.getElementById("liste-avis");
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

// AFFICHAGE HORAIRES
function afficherHoraires() {

    // Ordre logique des jours pour le tri
    const ordreJours = [
        "lundi",
        "mardi",
        "mercredi",
        "jeudi",
        "vendredi",
        "samedi",
        "dimanche"
    ];

    // Tri des horaires selon l’ordre des jours écrit en Majuscule ou minuscule
    const horairesTries = [...horaires].sort((a, b) => {
        const ja = a.jour.toLowerCase();
        const jb = b.jour.toLowerCase();
        return ordreJours.indexOf(ja) - ordreJours.indexOf(jb);
    });


    afficherListe(
        listeHoraires,
        horairesTries,
        (h) => `
            <strong>${h.jour}</strong> : ${h.ouverture} - ${h.fermeture}<br>
            <button class="btn-modifier-horaire" data-id="${h.id}">Modifier</button>
            <button class="btn-supprimer-horaire" data-id="${h.id}">Supprimer</button>
        `,
        "Aucun horaire enregistré."
    );
}

// ÉCOUTEURS D'ÉVÉNEMENTS   les boutons
document.addEventListener("click", (e) => {
    const id = e.target.dataset.id;

    // 1 - EMPLOYÉS
    if (e.target.classList.contains("btn-suspend")) {
        fetch("../PHP/suspendEmploye.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        })
            .then(r => r.json())
            .then(() => chargerEmployesDepuisServeur());
    }

    if (e.target.classList.contains("btn-supprimer")) {
        if (confirm("Supprimer cet employé ?")) {
            fetch("../PHP/supprimerEmploye.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
                .then(r => r.json())
                .then(() => chargerEmployesDepuisServeur());
        }
    }

    // 2 -MENUS
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

    // 3 - PLATS
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

    // 4 - COMMANDES
    if (e.target.classList.contains("btn-annuler")) {
        const commande = commandes.find(cmd => cmd.id === id);
        if (!commande) return;

        // On garde tes prompts EXACTEMENT comme tu les veux
        const contact = prompt("Mode de contact utilisé pour prévenir le client (appel ou mail) :");
        const motif = prompt("Motif de l'annulation :");

        if (!contact || !motif) {
            alert("Annulation annulée : tous les champs sont obligatoires.");
            return;
        }

        // On envoie au backend pour mettre à jour la commande en BDD
        fetch("../PHP/annulerCommande.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, contact, motif })
        })
            .then(r => r.json())
            .then(result => {
                if (result.success) {
                    alert("Commande annulée avec succès !");
                    chargerCommandesDepuisServeur(); // recharge depuis MySQL
                } else {
                    alert("Erreur : " + result.message);
                }
            });
    }

    // 5 - AVIS
if (e.target.classList.contains("btn-valider-avis") || e.target.classList.contains("btn-refuser-avis")) {
    const idAvis = e.target.dataset.id;
    const action = e.target.classList.contains("btn-valider-avis") ? 'valider' : 'supprimer';

    if (action === 'supprimer' && !confirm("Supprimer cet avis ?")) return;

    fetch("../PHP/modifierStatutAvis.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idAvis, action: action })
    })
    .then(r => r.json())
    .then(result => {
        if (result.success) {
            chargerAvisDepuisServeur(); // Rafraîchit la liste
        }
    });
}

    // 6 - HORAIRES
    if (e.target.classList.contains("btn-supprimer-horaire")) {

        const id = e.target.dataset.id; // ← Récupération de l'ID

        if (confirm("Supprimer cet horaire ?")) {
            fetch("../PHP/supprimerHoraire.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
                .then(r => r.json())
                .then(() => chargerHorairesDepuisServeur());
        }
    }

    if (e.target.classList.contains("btn-modifier-horaire")) {

        const id = e.target.dataset.id; // ← Récupération de l'ID

        const h = horaires.find(h => h.id == id); // == pour éviter problème de type
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
            .then(() => chargerHorairesDepuisServeur());
    }
});




// CRÉATION EMPLOYÉ
async function chargerEmployesDepuisServeur() {
    const response = await fetch("../PHP/getEmployes.php");
    users = await response.json();
    afficherEmployes();
}

document.getElementById("btn-ajout-employe").addEventListener("click", async () => {
    const fullname = prompt("Nom et Prénom de l'employé :");
    const email = prompt("Email de l'employé :");
    const password = prompt("Mot de passe temporaire :");

    if (!fullname || !email || !password) {
        alert("Tous les champs sont obligatoires.");
        return;
    }

    const response = await fetch("../PHP/ajoutEmploye.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password })
    });

    const result = await response.json();
    if (result.success) {
        alert("Employé créé avec succès !");
        chargerEmployesDepuisServeur();
    } else {
        alert("Erreur : " + result.message);
    }
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

// CHANGEMENT DE STATUT COMMANDE
document.addEventListener("change", (e) => {
    if (e.target.classList.contains("select-statut")) {
        const id = e.target.dataset.id;
        const commande = commandes.find(cmd => cmd.id === id);
        if (!commande) return;

        const nouveauStatut = e.target.value;
        if (!nouveauStatut) return;

        // On garde ton comportement EXACT
        if (nouveauStatut === "en attente du retour de matériel") {
            alert(`Email envoyé :
Objet : Retour de matériel
Bonjour,
Vous avez 10 jours pour restituer le matériel. Sinon, 600€ de frais seront appliqués.
Cordialement, L'équipe Vite & Gourmand`);
        }

        // On envoie la mise à jour au serveur
        fetch("../PHP/modifierStatutCommande.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, statut: nouveauStatut })
        })
            .then(r => r.json())
            .then(result => {
                if (result.success) {
                    // Recharge depuis MySQL
                    chargerCommandesDepuisServeur();
                } else {
                    alert("Erreur : " + result.message);
                }
            });
    }
});

// FILTRES COMMANDES
filtreStatut.addEventListener("change", afficherCommandes);
filtreClient.addEventListener("input", afficherCommandes);

// CRÉATION HORAIRE
async function chargerHorairesDepuisServeur() {
    const response = await fetch("../PHP/get_horaires.php");
    const result = await response.json();

    if (result.status === "success") {
        horaires = result.data;   // <-- LA LIGNE IMPORTANTE
        afficherHoraires();
    } else {
        console.error("Erreur chargement horaires :", result.message);
    }
}

document.getElementById("btn-ajout-horaire").addEventListener("click", async () => {
    const jour = prompt("Jour (ex : Lundi) :");
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

// AFFICHAGE INITIAL
chargerEmployesDepuisServeur();
afficherMenus();
afficherPlats();
chargerHorairesDepuisServeur();
chargerCommandesDepuisServeur();
chargerAvisDepuisServeur();