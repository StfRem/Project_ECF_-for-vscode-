// Vérification du rôle utilisateur
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    alert("Vous devez être connecté pour accéder à votre espace utilisateur.");
    location.href = "./login.html";
}

// Stocker les menus dans localStorage si ce n'est pas déjà fait
if (!localStorage.getItem("menus")) {
    const menus = [
        {
            id: 1,
            titre: "Noël Traditionnel",
            prix: 70, // Ajouté pour le calcul
            personnesMin: 4,
            materiel: true
        },
        {
            id: 2,
            titre: "Menu Vegan Fraîcheur",
            prix: 55, // Ajouté pour le calcul
            personnesMin: 2,
            materiel: false
        },
        {
            id: 3,
            titre: "Menu Événements",
            prix: 90, // Ajouté pour le calcul
            personnesMin: 6,
            materiel: true
        }
    ];
    localStorage.setItem("menus", JSON.stringify(menus));
}

// Données et Sélections
let commandes = JSON.parse(localStorage.getItem("commandes")) || [];
let commandesUtilisateur = commandes.filter(cmd => cmd.userId === user.id);
const liste = document.getElementById("liste-commandes");

// Fonction pour récupérer un menu par son ID
function getMenuById(menuId) {
    const menus = JSON.parse(localStorage.getItem("menus")) || [];
    return menus.find(m => m.id == menuId);
}

// Affichage de la liste des commandes avec tous les détails
function afficherListe() {
    liste.innerHTML = "";

    // Re-filtrer pour être sûr d'avoir les données à jour
    commandes = JSON.parse(localStorage.getItem("commandes")) || [];
    commandesUtilisateur = commandes.filter(cmd => cmd.userId === user.id);

    if (commandesUtilisateur.length === 0) {
        liste.innerHTML = "<p>Aucune commande pour le moment.</p>";
        return;
    }

    commandesUtilisateur.forEach(cmd => {
        const li = document.createElement("li");
        li.classList.add("commande-item");
        li.dataset.id = cmd.id;

        let boutonModifier = "";
        let boutonAnnuler = "";
        let boutonAvis = "";

        // Boutons Modifier et Annuler pour les commandes en attente
        if (cmd.statut === "en attente") {
            boutonModifier = `<button class="btn-modifier btn-action" data-id="${cmd.id}">Modifier</button>`;
            boutonAnnuler = `<button class="btn-annuler btn-danger" data-id="${cmd.id}">Annuler</button>`;
        }

        // Bouton avis pour les commandes terminées
        if (cmd.statut === "livré" || cmd.statut === "terminée") {
            if (!cmd.avis || cmd.avis.note === null) {
                boutonAvis = `<button class="btn-avis btn-action" data-id="${cmd.id}">Donner un avis</button>`;
            }
        }

        li.innerHTML = `
            <div class="commande-details">
                <h3>${cmd.menuTitre}</h3>
                <p><strong>Commande :</strong> ${cmd.id}</p>
                <p><strong>Nombre de personnes :</strong> ${cmd.nbPersonnes}</p>
                <p><strong>Prix total :</strong> ${cmd.prixTotal.toFixed(2)} €</p>
                <p><strong>Date de prestation :</strong> ${cmd.datePrestation}</p>
                <p><strong>Heure :</strong> ${cmd.heurePrestation}</p>
                <p><strong>Adresse :</strong> ${cmd.adresse}, ${cmd.cp} ${cmd.ville}</p>
                <p><strong>Distance :</strong> ${cmd.distance} km</p>
                <p><strong>Statut :</strong> <span class="statut-${cmd.statut.replace(/ /g, '-')}">${cmd.statut}</span></p>
                
                <div class="boutons-commande">
                    ${boutonModifier}
                    ${boutonAnnuler}
                    ${boutonAvis}
                </div>
                
                <div class="zone-modification" id="zone-modification-${cmd.id}"></div>
            </div>
        `;

        liste.appendChild(li);
    });
}

// Gestion centralisée des clics
document.addEventListener("click", (e) => {
    const target = e.target;

    // --- Clic sur le bouton Annuler ---
    if (target.classList.contains("btn-annuler")) {
        const id = target.dataset.id;
        const cmdIndex = commandes.findIndex(c => String(c.id) === String(id));
        if (cmdIndex === -1) return;

        if (confirm("Voulez-vous vraiment annuler cette commande ?")) {
            commandes[cmdIndex].statut = "annulée";
            commandes[cmdIndex].historique.push({
                date: new Date().toISOString(),
                action: "Commande annulée par l'utilisateur"
            });
            localStorage.setItem("commandes", JSON.stringify(commandes));
            afficherListe();
        }
        return;
    }

    // --- Clic sur le bouton Modifier ---
    if (target.classList.contains("btn-modifier")) {
        const id = target.dataset.id;
        const cmd = commandesUtilisateur.find(c => String(c.id) === String(id));
        if (!cmd) return;

        const zone = document.getElementById(`zone-modification-${cmd.id}`);
        if (!zone) return;

        zone.innerHTML = `
            <div class="formulaire-modification">
                <h4>Modifier la commande</h4>
                <label>Nombre de personnes :</label>
                <input type="number" id="mod-nb-${cmd.id}" value="${cmd.nbPersonnes}" min="1">
                <label>Date :</label>
                <input type="date" id="mod-date-${cmd.id}" value="${cmd.datePrestation}">
                <label>Heure :</label>
                <input type="time" id="mod-heure-${cmd.id}" value="${cmd.heurePrestation}">
                <label>Adresse :</label>
                <input type="text" id="mod-adresse-${cmd.id}" value="${cmd.adresse}">
                <label>Code postal :</label>
                <input type="text" id="mod-cp-${cmd.id}" value="${cmd.cp}">
                <label>Ville :</label>
                <input type="text" id="mod-ville-${cmd.id}" value="${cmd.ville}">
                <label>Distance (km) :</label>
                <input type="number" id="mod-distance-${cmd.id}" value="${cmd.distance}" min="0">
                <br>
                <button class="btn-valider-modif btn-action" data-id="${cmd.id}">Valider</button>
                <button class="btn-annuler-modif btn-secondary" data-id="${cmd.id}">Annuler les modifications</button>
            </div>
        `;
        return;
    }

    // --- Annuler les modifications (fermer le petit formulaire) ---
    if (target.classList.contains("btn-annuler-modif")) {
        const id = target.dataset.id;
        const zone = document.getElementById(`zone-modification-${id}`);
        if (zone) zone.innerHTML = "";
        return;
    }

    // --- Validation de la modification ---
    if (target.classList.contains("btn-valider-modif")) {
        const id = target.dataset.id;
        const cmdIndex = commandes.findIndex(c => String(c.id) === String(id));

        if (cmdIndex === -1) {
            alert("Erreur : commande introuvable.");
            return;
        }

        const cmd = commandes[cmdIndex];
        const nouveauNb = Number(document.getElementById(`mod-nb-${id}`).value);
        const nouvelleDate = document.getElementById(`mod-date-${id}`).value;
        const nouvelleHeure = document.getElementById(`mod-heure-${id}`).value;
        const nouvelleAdresse = document.getElementById(`mod-adresse-${id}`).value;
        const nouveauCP = document.getElementById(`mod-cp-${id}`).value;
        const nouvelleVille = document.getElementById(`mod-ville-${id}`).value;
        const nouvelleDistance = Number(document.getElementById(`mod-distance-${id}`).value);

        let menu = getMenuById(cmd.menuId);

        // fallback si menuId foireux
        if (!menu) {
            const menus = JSON.parse(localStorage.getItem("menus")) || [];
            menu = menus.find(m => m.titre === cmd.menuTitre);
        }

        if (!menu) {
            alert("Menu introuvable pour recalculer le prix.");
            return;
        }

        // Recalcul du prix (Logique identique à commande.js)
        let total = nouveauNb * (menu.prix / menu.personnesMin);
        if (nouveauNb >= menu.personnesMin + 5) {
            total *= 0.9; // Réduction 10%
        }

        let fraisLivraison = 5;
        if (nouvelleVille.toLowerCase() !== "bordeaux") {
            fraisLivraison += nouvelleDistance * 0.59;
        }
        total += fraisLivraison;

        // Mise à jour de l'objet
        commandes[cmdIndex] = {
            ...cmd,
            nbPersonnes: nouveauNb,
            prixTotal: total,
            datePrestation: nouvelleDate,
            heurePrestation: nouvelleHeure,
            adresse: nouvelleAdresse,
            cp: nouveauCP,
            ville: nouvelleVille,
            distance: nouvelleDistance
        };

        commandes[cmdIndex].historique.push({
            date: new Date().toISOString(),
            action: "Commande modifiée par l'utilisateur"
        });

        localStorage.setItem("commandes", JSON.stringify(commandes));
        alert("Commande mise à jour avec succès !");
        afficherListe();
        return;
    }

    // --- Bouton Avis ---
    if (target.classList.contains("btn-avis")) {
        const id = target.dataset.id;
        const cmdIndex = commandes.findIndex(c => String(c.id) === String(id));
        if (cmdIndex === -1) return;

        let note;
        while (true) {
            note = prompt("Note (1 à 5) :");
            if (note === null) return; // Annulation du prompt
            note = Number(note);
            if (note >= 1 && note <= 5) break;
            alert("La note doit être entre 1 et 5.");
        }

        const commentaire = prompt("Votre commentaire :");
        if (!commentaire) {
            alert("Le commentaire est obligatoire.");
            return;
        }

        // Mise à jour de la commande
        commandes[cmdIndex].avis = {
            note: Number(note),
            commentaire: commentaire,
            date: new Date().toISOString()
        };

        // Ajout à la liste globale des avis (pour l'admin/employé)
        let avisGlobaux = JSON.parse(localStorage.getItem("avis")) || [];
        avisGlobaux.push({
            id: "AVIS-" + Date.now(),
            commandeId: id,
            userId: user.id,
            nomClient: user.fullname,
            note: Number(note),
            commentaire: commentaire,
            date: new Date().toISOString(),
            statut: "en attente"
        });

        commandes[cmdIndex].historique.push({
            date: new Date().toISOString(),
            action: "Avis laissé par l'utilisateur"
        });

        localStorage.setItem("avis", JSON.stringify(avisGlobaux));
        localStorage.setItem("commandes", JSON.stringify(commandes));

        alert("Merci pour votre avis !");
        afficherListe();
    }
});

// Gestion du Profil (Séparé de la liste des commandes)
const profileForm = document.getElementById("profile-form");
if (profileForm) {
    // Pré-remplir le formulaire au chargement
    document.getElementById("edit-fullname").value = user.fullname || "";
    document.getElementById("edit-gsm").value = user.gsm || "";
    document.getElementById("edit-address").value = user.address || "";

    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Mettre à jour l'objet utilisateur session
        user.fullname = document.getElementById("edit-fullname").value;
        user.gsm = document.getElementById("edit-gsm").value;
        user.address = document.getElementById("edit-address").value;

        // Sauvegarder dans la liste globale des users
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users = users.map(u => u.id === user.id ? user : u);

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("user", JSON.stringify(user));

        alert("Profil mis à jour !");
    });
}

// Initialisation
afficherListe();