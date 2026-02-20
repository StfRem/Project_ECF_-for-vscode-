// 1. Vérification du rôle utilisateur
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    alert("Vous devez être connecté pour accéder à votre espace utilisateur.");
    location.href = "./login.html";
}

const liste = document.getElementById("liste-commandes");

// 2. Récupération des commandes SQL
function chargerCommandes() {
    fetch("../PHP/getCommandesUser.php?id=" + encodeURIComponent(user.id))
        .then(res => res.json())
        .then(data => afficherCommandes(data))
        .catch(err => {
            console.error(err);
            liste.innerHTML = "<p>Erreur lors du chargement des commandes.</p>";
        });
}

// 3. Affichage des commandes utilisateur
function afficherCommandes(commandes) {
    liste.innerHTML = "";

    if (!commandes || commandes.length === 0) {
        liste.innerHTML = "<p>Aucune commande pour le moment.</p>";
        return;
    }

    commandes.forEach(cmd => {
        const li = document.createElement("li");
        li.classList.add("commande-item");
        li.dataset.id = cmd.id;

        let boutonModifier = "";
        let boutonAnnuler = "";
        let boutonAvis = "";

        if (cmd.statut === "en attente") {
            boutonModifier = `<button class="btn-modifier btn-action" data-id="${cmd.id}">Modifier</button>`;
            boutonAnnuler = `<button class="btn-annuler btn-danger" data-id="${cmd.id}">Annuler</button>`;
        }

        if (cmd.statut === "livré" || cmd.statut === "terminée") {
            if (!cmd.avis || cmd.avis.note === null) {
                boutonAvis = `<button class="btn-avis btn-action" data-id="${cmd.id}">Donner un avis</button>`;
            }
        }

        const avisTexte = cmd.avis && cmd.avis.note
            ? `<p><strong>Votre avis :</strong> ${cmd.avis.note}/5 - ${cmd.avis.commentaire || ""}</p>`
            : "";

        li.innerHTML = `
            <div class="commande-details">
                <h3>${cmd.menuTitre}</h3>
                <p><strong>Commande :</strong> ${cmd.id}</p>
                <p><strong>Nombre de personnes :</strong> ${cmd.nbPersonnes}</p>
                <p><strong>Prix total :</strong> ${Number(cmd.prixTotal).toFixed(2)} €</p>
                <p><strong>Date de prestation :</strong> ${cmd.datePrestation || ""}</p>
                <p><strong>Heure :</strong> ${cmd.heurePrestation || ""}</p>
                <p><strong>Adresse :</strong> ${cmd.adresse || ""}</p>
                <p><strong>Code postal :</strong> ${cmd.cp || ""}</p>
                <p><strong>Ville :</strong> ${cmd.ville || ""}</p>
                <p><strong>Distance :</strong> ${cmd.distance ?? ""} km</p>
                <p><strong>Statut :</strong> 
                    <span class="statut-${(cmd.statut || "").replace(/ /g, '-')}">
                        ${cmd.statut}
                    </span>
                </p>
                ${avisTexte}
                
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

// 4. Gestion centralisée des clics
document.addEventListener("click", async (e) => {
    const target = e.target;

    // --- ANNULER COMMANDE ---
    if (target.classList.contains("btn-annuler")) {
        const id = target.dataset.id;
        if (!id) return;

        if (!confirm("Voulez-vous vraiment annuler cette commande ?")) return;

        try {
            const res = await fetch("../PHP/annulerCommande.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ commandeId: id, userId: user.id })
            });
            const data = await res.json();

            if (!data.success) {
                alert(data.message || "Erreur lors de l'annulation.");
                return;
            }

            alert("Commande annulée avec succès.");
            chargerCommandes();

        } catch (err) {
            console.error(err);
            alert("Erreur technique lors de l'annulation.");
        }
        return;
    }

// --- AFFICHER FORMULAIRE MODIFICATION ---
if (target.classList.contains("btn-modifier")) {
    const id = target.dataset.id;
    const zone = document.getElementById(`zone-modification-${id}`);
    if (!zone) return;

    const li = target.closest(".commande-item");
    const details = li.querySelector(".commande-details");

    const nb = details.querySelector("p:nth-of-type(2)").textContent.replace(/\D+/g, "");
    const date = details.querySelector("p:nth-of-type(4)").textContent.split(":").slice(1).join(":").trim();
    const heure = details.querySelector("p:nth-of-type(5)").textContent.split(":").slice(1).join(":").trim();

    // 🔥 Correction : on enlève "Adresse :" et non "Rue :"
    const adresse = details.querySelector("p:nth-of-type(6)").textContent.replace("Adresse :", "").trim();
    const cp = details.querySelector("p:nth-of-type(7)").textContent.replace("Code postal :", "").trim();
    const ville = details.querySelector("p:nth-of-type(8)").textContent.replace("Ville :", "").trim();

    const distance = details.querySelector("p:nth-of-type(9)").textContent.replace(/\D+/g, "");

    zone.innerHTML = `
        <div class="formulaire-modification">
            <h4>Modifier la commande</h4>

            <label>Nombre de personnes :</label>
            <input type="number" id="mod-nb-${id}" value="${nb}" min="1">

            <label>Date :</label>
            <input type="date" id="mod-date-${id}" value="${date}">

            <label>Heure :</label>
            <input type="time" id="mod-heure-${id}" value="${heure}">

            <label>Adresse :</label>
            <input type="text" id="mod-adresse-${id}" value="${adresse}">

            <label>Code postal :</label>
            <input type="text" id="mod-cp-${id}" value="${cp}">

            <label>Ville :</label>
            <input type="text" id="mod-ville-${id}" value="${ville}">

            <label>Distance (km) :</label>
            <input type="number" id="mod-distance-${id}" value="${distance}" min="0">

            <br>
            <button class="btn-valider-modif btn-action" data-id="${id}">Valider</button>
            <button class="btn-annuler-modif btn-secondary" data-id="${id}">Annuler les modifications</button>
        </div>
    `;
    return;
}


// --- FERMER FORMULAIRE ---
    if (target.classList.contains("btn-annuler-modif")) {
        const id = target.dataset.id;
        const zone = document.getElementById(`zone-modification-${id}`);
        if (zone) zone.innerHTML = "";
        return;
    }

// --- VALIDER MODIFICATION ---
if (target.classList.contains("btn-valider-modif")) {
    const id = target.dataset.id;

    const nb = Number(document.getElementById(`mod-nb-${id}`).value);
    const date = document.getElementById(`mod-date-${id}`).value;
    const heure = document.getElementById(`mod-heure-${id}`).value;

    const adresse = document.getElementById(`mod-adresse-${id}`).value;
    const cp = document.getElementById(`mod-cp-${id}`).value;
    const ville = document.getElementById(`mod-ville-${id}`).value;

    const distance = Number(document.getElementById(`mod-distance-${id}`).value);

    if (!nb || !date || !heure || !adresse || !cp || !ville) {
        alert("Merci de remplir tous les champs.");
        return;
    }

    try {
        const res = await fetch("../PHP/updateCommande.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                commandeId: id,
                userId: user.id,
                nbPersonnes: nb,
                datePrestation: date,
                heurePrestation: heure,
                adresse,
                cp,
                ville,
                distance
            })
        });

        const data = await res.json();

        if (!data.success) {
            alert(data.message || "Erreur lors de la mise à jour.");
            return;
        }

        alert("Commande mise à jour avec succès.");
        chargerCommandes();

    } catch (err) {
        console.error(err);
        alert("Erreur technique lors de la mise à jour.");
    }
    return;
}



// --- DONNER UN AVIS ---
    if (target.classList.contains("btn-avis")) {
        const id = target.dataset.id;

        let note;
        while (true) {
            note = prompt("Note (1 à 5) :");
            if (note === null) return;
            note = Number(note);
            if (note >= 1 && note <= 5) break;
            alert("La note doit être entre 1 et 5.");
        }

        const commentaire = prompt("Votre commentaire :");
        if (!commentaire) {
            alert("Le commentaire est obligatoire.");
            return;
        }

        try {
            const res = await fetch("../PHP/addAvis.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    commandeId: id,
                    userId: user.id,
                    note,
                    commentaire
                })
            });

            const data = await res.json();

            if (!data.success) {
                alert(data.message || "Erreur lors de l'enregistrement de l'avis.");
                return;
            }

            alert("Merci pour votre avis !");
            chargerCommandes();

        } catch (err) {
            console.error(err);
            alert("Erreur technique lors de l'enregistrement de l'avis.");
        }
        return;
    }
});

// 5. Gestion du profil utilisateur (SQL)
const profileForm = document.getElementById("profile-form");
if (profileForm) {
    document.getElementById("edit-fullname").value = user.fullname || "";
    document.getElementById("edit-gsm").value = user.gsm || "";
    document.getElementById("edit-adresse").value = user.adresse || "";
    document.getElementById("edit-cp").value = user.cp || "";
    document.getElementById("edit-ville").value = user.ville || "";


    profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("edit-fullname").value;
    const gsm = document.getElementById("edit-gsm").value;
    const adresse = document.getElementById("edit-adresse").value;
    const cp = document.getElementById("edit-cp").value;   // ✔ correction
    const ville = document.getElementById("edit-ville").value;

    try {
        const res = await fetch("../PHP/updateUser.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: user.id,
                fullname,
                gsm,
                adresse,
                cp,
                ville
            })
        });


            const data = await res.json();

            if (!data.success) {
                alert(data.message || "Erreur lors de la mise à jour du profil.");
                return;
            }

            user.fullname = fullname;
            user.gsm = gsm;
            user.adresse = adresse;
            user.cp = cp;
            user.ville = ville;

            localStorage.setItem("user", JSON.stringify(user));

            alert("Profil mis à jour !");

        } catch (err) {
            console.error(err);
            alert("Erreur technique lors de la mise à jour du profil.");
        }
    });
}

// 6. Initialisation
chargerCommandes();
