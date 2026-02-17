import { loadNavbar, loadFooter } from "./script.js";
loadNavbar();
loadFooter();

// ---------------------------------------------------------
// Données des menus
// ---------------------------------------------------------
const menus = [
    {
        id: 1,
        titre: "Noël Traditionnel",
        description: "Un menu festif aux saveurs authentiques pour vos repas de fin d’année.",
        theme: "Noël",
        regime: "Classique",
        images: [
            "/assets/images/entree_noel.jpg",
            "/assets/images/repasnoel.jpg",
            "/assets/images/repasnoel1.jpg"
        ],
        entrees: [
            { nom: "Velouté de potimarron", allergenes: ["(Lactose)"] },
            { nom: "Saumon fumé sur blinis", allergenes: ["(Gluten", "Poisson", "Œufs)"] }
        ],
        plats: [
            { nom: "Dinde farcie aux marrons", allergenes: ["(Lactose)"] },
            { nom: "Filet de cabillaud sauce citron", allergenes: ["(Poisson)"] }
        ],
        desserts: [
            { nom: "Bûche chocolat praliné", allergenes: ["(Lactose)", "(Gluten)", "(Œufs)"] },
            { nom: "Tarte aux pommes caramélisées", allergenes: ["(Gluten)", "(Œufs)"] }
        ],
        personnesMin: 4,
        prix: 70,
        conditions: "À commander 2 jours avant. Conserver au frais.",
        stock: 20
    },

    {
        id: 2,
        titre: "Menu Vegan Fraîcheur",
        description: "Un menu 100% végétal, équilibré et savoureux.",
        theme: "Vegan",
        regime: "Vegan",
        images: [
            "/assets/images/Vegan1.jpg",
            "/assets/images/Vegan2.jpg",
            "/assets/images/Vegan3.jpg"
        ],
        entrees: [
            { nom: "Salade fraîcheur", allergenes: [] },
            { nom: "Houmous et crudités", allergenes: ["(Sésame)"] }
        ],
        plats: [
            { nom: "Curry de légumes", allergenes: [] },
            { nom: "Pâtes complètes", allergenes: ["(Gluten)"] }
        ],
        desserts: [
            { nom: "Mousse chocolat vegan", allergenes: [] },
            { nom: "Tartelette fruits rouges", allergenes: ["(Gluten)"] }
        ],
        personnesMin: 2,
        prix: 55,
        conditions: "À commander 24h avant.",
        stock: 15
    },

    {
        id: 3,
        titre: "Menu Événements",
        description: "Un menu conçu pour vos fêtes et grands rassemblements.",
        theme: "Événements",
        regime: "Classique",
        images: [
            "/assets/images/event1.jpg",
            "/assets/images/event2.jpg",
            "/assets/images/event3.jpg"
        ],
        entrees: [
            { nom: "Mini wraps variés", allergenes: ["(Gluten)"] },
            { nom: "Verrines saumon avocat", allergenes: ["(Poisson)"] }
        ],
        plats: [
            { nom: "Buffet froid varié", allergenes: ["(Gluten)", "(Lactose)"] },
            { nom: "Plateau charcuterie", allergenes: [] }
        ],
        desserts: [
            { nom: "Assortiment de mini desserts", allergenes: ["(Gluten)", "(Œufs)", "(Lactose)"] }
        ],
        personnesMin: 6,
        prix: 90,
        conditions: "À commander 3 jours avant.",
        stock: 10
    }
];

const container = document.getElementById("menus-container");

// ---------------------------------------------------------
// Fonction d'affichage des menus
// ---------------------------------------------------------
function afficherMenus(liste) {
    container.innerHTML = "";

    liste.forEach(menu => {
        const htmlEntrees = menu.entrees
            .map(e => `<li>${e.nom} <span class="allergenes">${e.allergenes.join(", ")}</span></li>`)
            .join("");

        const htmlPlats = menu.plats
            .map(p => `<li>${p.nom} <span class="allergenes">${p.allergenes.join(", ")}</span></li>`)
            .join("");

        const htmlDesserts = menu.desserts
            .map(d => `<li>${d.nom} <span class="allergenes">${d.allergenes.join(", ")}</span></li>`)
            .join("");

        container.innerHTML += `
            <article class="menu-card">
                <div class="menu-info">
                    <h2>${menu.titre}</h2>
                    <p>${menu.description}</p>
                <br>

                    <p><strong>Thème :</strong> ${menu.theme}</p>
                    <p><strong>Régime :</strong> ${menu.regime}</p>
                <br>
                    <h3>Entrées</h3>
                    <ul>${htmlEntrees}</ul>
                <br>
                    <h3>Plats</h3>
                    <ul>${htmlPlats}</ul>
                <br>
                    <h3>Desserts</h3>
                    <ul>${htmlDesserts}</ul>
                <br>
                    <p><strong>Conditions :</strong> ${menu.conditions}</p>
                    <p><strong>Prix :</strong> ${menu.prix} €</p>
                    <p><strong>Personnes min :</strong> ${menu.personnesMin}</p>
                    <p><strong>Stock :</strong> ${menu.stock}</p>

                    <button class="btn-details2" data-id="${menu.id}">
                        + de détails
                    </button>
                </div>

                <div class="menu-img">
                    <img class="main-img" src="${menu.images[0]}" alt="${menu.titre}" id="img-${menu.id}" data-index="0">

                    <div class="arrow-container">
                        <button class="arrow left" data-menu="${menu.id}">
                            <img src="/assets/images/gauche.png" alt="gauche">
                        </button>

                        <button class="arrow right" data-menu="${menu.id}">
                            <img src="/assets/images/droite.png" alt="droite">
                        </button>
                    </div>
                </div>
            </article>
        `;
    });
}

afficherMenus(menus);

// ---------------------------------------------------------
// 🔥 SYSTÈME GÉNÉRIQUE POUR TOUS LES FILTRES
// ---------------------------------------------------------
document.querySelector(".filters").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const type = btn.dataset.filter;

    // On récupère le conteneur vertical du bouton
    const container = btn.parentElement;

    // Supprimer un ancien input sous CE bouton
    const oldInput = container.querySelector(".filter-input");
    if (oldInput) oldInput.remove();

    // Création de l'input
    const input = document.createElement("input");
    input.classList.add("filter-input");

    // On insère l'input DANS le conteneur vertical
    container.appendChild(input);

    // -----------------------------------------------------
    // FILTRE : PRIX MAXIMUM
    // -----------------------------------------------------
    if (type === "prix") {
        input.type = "number";
        input.placeholder = "Prix maximum";

        input.addEventListener("input", () => {
            const max = Number(input.value);
            if (!max) return afficherMenus(menus);

            afficherMenus(menus.filter(m => m.prix <= max));
        });
    }

    // -----------------------------------------------------
    // FILTRE : FOURCHETTE DE PRIX
    // -----------------------------------------------------
    if (type === "prix-range") {
        input.placeholder = "Ex : 40-80";

        input.addEventListener("input", () => {
            const [min, max] = input.value.split("-").map(Number);
            if (!min || !max) return afficherMenus(menus);

            afficherMenus(menus.filter(m => m.prix >= min && m.prix <= max));
        });
    }

    // -----------------------------------------------------
    // FILTRE : THÈME
    // -----------------------------------------------------
    if (type === "theme") {
        input.placeholder = "Ex : Noël, Vegan...";

        input.addEventListener("input", () => {
            const txt = input.value.toLowerCase();
            if (!txt) return afficherMenus(menus);

            afficherMenus(menus.filter(m => m.theme.toLowerCase().includes(txt)));
        });
    }

    // -----------------------------------------------------
    // FILTRE : RÉGIME
    // -----------------------------------------------------
    if (type === "regime") {
        input.placeholder = "Ex : Vegan, Classique...";

        input.addEventListener("input", () => {
            const txt = input.value.toLowerCase();
            if (!txt) return afficherMenus(menus);

            afficherMenus(menus.filter(m => m.regime.toLowerCase().includes(txt)));
        });
    }

    // -----------------------------------------------------
    // FILTRE : PERSONNES MINIMUM
    // -----------------------------------------------------
    if (type === "personnes") {
        input.type = "number";
        input.placeholder = "Min. personnes";

        input.addEventListener("input", () => {
            const min = Number(input.value);
            if (!min) return afficherMenus(menus);

            afficherMenus(menus.filter(m => m.personnesMin >= min));
        });
    }
});

// ---------------------------------------------------------
// SLIDER
// ---------------------------------------------------------
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".arrow");
    if (!btn) return;

    const menuId = btn.dataset.menu;
    const direction = btn.classList.contains("left") ? -1 : 1;

    const menu = menus.find(m => m.id == menuId);
    const imgElement = document.getElementById(`img-${menuId}`);

    let currentIndex = parseInt(imgElement.dataset.index);
    let newIndex = currentIndex + direction;

    if (newIndex < 0) newIndex = menu.images.length - 1;
    if (newIndex >= menu.images.length) newIndex = 0;

    imgElement.src = menu.images[newIndex];
    imgElement.dataset.index = newIndex;
});

// -----------------------------
// Redirection vers la page détail
// -----------------------------
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-details2");
    if (!btn) return;

    const id = btn.dataset.id;
    location.href = `./menu-detail.html?id=${id}`;
});
