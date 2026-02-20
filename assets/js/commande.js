const menus = [
    {
        id: 1,
        titre: "Noël Traditionnel",
        prix: 70,
        personnesMin: 4,
        stock: 20,
        materiel: true
    },
    {
        id: 2,
        titre: "Menu Vegan Fraîcheur",
        prix: 55,
        personnesMin: 2,
        stock: 15,
        materiel: false
    },
    {
        id: 3,
        titre: "Menu Événements",
        prix: 90,
        personnesMin: 6,
        stock: 10,
        materiel: true
    }
];

// Récupération de l'ID dans l'URL
const params = new URLSearchParams(location.search);
const id = params.get("id");
const menu = menus.find(m => m.id == id);

if (!menu) {
    alert("Menu introuvable.");
    location.href = "./menus.html";
}

// Pré-remplissage des infos client
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    document.getElementById("fullname").removeAttribute("readonly");
    document.getElementById("email").removeAttribute("readonly");
    document.getElementById("gsm").removeAttribute("readonly");
} else {
    document.getElementById("fullname").value = user.fullname;
    document.getElementById("email").value = user.email;
    document.getElementById("gsm").value = user.gsm;
}

// Gestion du nombre de personnes + prix total
const inputNb = document.getElementById("nbPersonnes");
const prixTotal = document.getElementById("prixTotal");

inputNb.min = menu.personnesMin;
inputNb.value = menu.personnesMin;

updatePrix();

inputNb.addEventListener("input", () => {
    if (inputNb.value < menu.personnesMin) {
        inputNb.value = menu.personnesMin;
    }
    updatePrix();
});
document.getElementById("ville").addEventListener("input", updatePrix);
document.getElementById("distance").addEventListener("input", updatePrix);

function updatePrix() {
    const nb = Number(inputNb.value);
    let total = nb * (menu.prix / menu.personnesMin);

    const reductionInfo = document.getElementById("reductionInfo");

    if (nb >= menu.personnesMin + 5) {
        total = total * 0.9;
        reductionInfo.textContent = "Réduction de 10% appliquée !";
        reductionInfo.style.color = "#FFFFFF";
    } else {
        const manque = (menu.personnesMin + 5) - nb;
        reductionInfo.textContent = `Ajoutez encore ${manque} personne(s) pour obtenir une réduction de 10% !`;
    }

    const ville = document.getElementById("ville").value.trim().toLowerCase();
    const distance = Number(document.getElementById("distance").value);

    let fraisLivraison = 5;

    if (ville !== "" && ville !== "bordeaux") {
        fraisLivraison += distance * 0.59;
    }

    window.totalFinal = total + fraisLivraison;

    prixTotal.textContent = `Prix total avec livraison : ${window.totalFinal.toFixed(2)} €`;
}

// Validation de la commande
document.getElementById("commande-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const nb = Number(inputNb.value);

    if (nb > menu.stock) {
        alert(`Stock insuffisant. Il reste seulement ${menu.stock} commandes possibles.`);
        return;
    }

    const isLogged = localStorage.getItem("userIsLogged") === "true";

    if (!isLogged) {
        alert("Vous devez être connecté pour valider une commande.");
        localStorage.setItem("pendingMenu", menu.id);
        location.href = "./login.html";
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    const nouvelleCommande = {
        id: "CMD-" + Date.now(),
        userId: user.id,
        menuId: menu.id,
        menuTitre: menu.titre,
        nbPersonnes: nb,
        prixTotal: window.totalFinal,
        reduction: nb >= menu.personnesMin + 5,
        materiel: menu.materiel,
        adresse: document.getElementById("adresse").value,
        ville: document.getElementById("ville").value,
        cp: document.getElementById("cp").value,
        distance: Number(document.getElementById("distance").value),
        datePrestation: document.getElementById("date").value,
        heurePrestation: document.getElementById("heure").value,
        gsm: user.gsm,
        statut: "en attente",
         historique: [
            {
                date: new Date().toISOString(),
                action: "Commande créée"
            }
        ],

        avis: {
            note: null,
            commentaire: null,
            date: null
        }
    };

    // ENVOI SQL UNIQUEMENT
    fetch('../PHP/saveCommande.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nouvelleCommande)
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alert("Votre commande a bien été enregistrée !");
        } else {
            alert("Erreur serveur : " + data.message);
        }
    })
    .catch(err => {
        console.error(err);
        alert("Impossible de contacter le serveur.");
    });
});
