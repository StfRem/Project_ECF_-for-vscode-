import { loadNavbar, loadFooter } from "./script.js";
loadNavbar();
loadFooter();

// -----------------------------
// Données des menus (identiques à menus.js)
// -----------------------------
const menus = [
    {
        id: 1,
        titre: "Noël Traditionnel",
        description: "Un menu festif aux saveurs authentiques pour vos repas de fin d’année.",
        theme: "Noël",
        regime: "Classique",
        images: [
            "./assets/images/entree_noel.jpg",
            "./assets/images/repasnoel.jpg",
            "./assets/images/repasnoel1.jpg"
        ],
        entrees: [
            { nom: "Velouté de potimarron", allergenes: ["Lactose"] },
            { nom: "Saumon fumé sur blinis", allergenes: ["Gluten", "Poisson", "Œufs"] }
        ],
        plats: [
            { nom: "Dinde farcie aux marrons", allergenes: ["Lactose"] },
            { nom: "Filet de cabillaud sauce citron", allergenes: ["Poisson"] }
        ],
        desserts: [
            { nom: "Bûche chocolat praliné", allergenes: ["Lactose", "Gluten", "Œufs"] },
            { nom: "Tarte aux pommes caramélisées", allergenes: ["Gluten", "Œufs"] }
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
            "./assets/images/Vegan1.jpg",
            "./assets/images/Vegan2.jpg",
            "./assets/images/Vegan3.jpg"
        ],
        entrees: [
            { nom: "Salade fraîcheur", allergenes: [] },
            { nom: "Houmous et crudités", allergenes: ["Sésame"] }
        ],
        plats: [
            { nom: "Curry de légumes", allergenes: [] },
            { nom: "Pâtes complètes", allergenes: ["Gluten"] }
        ],
        desserts: [
            { nom: "Mousse chocolat vegan", allergenes: [] },
            { nom: "Tartelette fruits rouges", allergenes: ["Gluten"] }
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
            "./assets/images/event1.jpg",
            "./assets/images/event2.jpg",
            "./assets/images/event3.jpg"
        ],
        entrees: [
            { nom: "Mini wraps variés", allergenes: ["Gluten"] },
            { nom: "Verrines saumon avocat", allergenes: ["Poisson"] }
        ],
        plats: [
            { nom: "Buffet froid varié", allergenes: ["Gluten", "Lactose"] },
            { nom: "Plateau charcuterie", allergenes: [] }
        ],
        desserts: [
            { nom: "Assortiment de mini desserts", allergenes: ["Gluten", "Œufs", "Lactose"] }
        ],
        personnesMin: 6,
        prix: 90,
        conditions: "À commander 3 jours avant.",
        stock: 10
    }
];

// -----------------------------
// Récupération de l'ID dans l'URL
// -----------------------------
const params = new URLSearchParams(location.search);
const id = params.get("id");
const menu = menus.find(m => m.id == id);

const container = document.getElementById("menu-detail-container");

if (!menu) {
    container.innerHTML = "<p>Menu introuvable.</p>";
    throw new Error("Menu introuvable");
}

// -----------------------------
// Construction HTML du menu
// -----------------------------
const htmlEntrees = menu.entrees
    .map(e => `<li>${e.nom} <span class="allergenes">${e.allergenes.join(", ")}</span></li>`)
    .join("");

const htmlPlats = menu.plats
    .map(p => `<li>${p.nom} <span class="allergenes">${p.allergenes.join(", ")}</span></li>`)
    .join("");

const htmlDesserts = menu.desserts
    .map(d => `<li>${d.nom} <span class="allergenes">${d.allergenes.join(", ")}</span></li>`)
    .join("");

container.innerHTML = `
    <article class="menu-card">
        <div class="menu-info">
            <h1>${menu.titre}</h1>
            <p>${menu.description}</p>

            <p><strong>Thème :</strong> ${menu.theme}</p>
            <p><strong>Régime :</strong> ${menu.regime}</p>

            <h3>Entrées</h3>
            <ul>${htmlEntrees}</ul>

            <h3>Plats</h3>
            <ul>${htmlPlats}</ul>

            <h3>Desserts</h3>
            <ul>${htmlDesserts}</ul>

            <p><strong>Conditions :</strong> ${menu.conditions}</p>
            <p><strong>Prix :</strong> ${menu.prix} € (pour ${menu.personnesMin} pers.)</p>
            <p><strong>Stock :</strong> ${menu.stock}</p>

            <button class="btn-commande" data-id="${menu.id}">
                Commander ce menu
            </button>
        </div>

        <div class="menu-img">
            <img class="main-img" src="${menu.images[0]}" alt="${menu.titre}" id="img-${menu.id}" data-index="0">

            <div class="arrow-container">
                <button class="arrow left" data-menu="${menu.id}">
                    <img src="./assets/images/gauche.png" alt="gauche">
                </button>

                <button class="arrow right" data-menu="${menu.id}">
                    <img src="./assets/images/droite.png" alt="droite">
                </button>
            </div>
        </div>
    </article>
`;

// -----------------------------
// Slider
// -----------------------------
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
// Bouton Commander
// -----------------------------
document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-commande")) return;

    const menuId = e.target.dataset.id;
    const menu = menus.find(m => m.id == menuId);

    const isLogged = localStorage.getItem("userIsLogged") === "true";

    if (isLogged) {
        location.href = `./commande.html?id=${menuId}`;
    } else {
        alert(
            "Vous devez être inscrit pour commander ce menu.\n\n" +
            "Conditions du menu :\n" +
            menu.conditions +
            "\n\nVeuillez vous connecter ou créer un compte pour continuer."
        );
        localStorage.setItem("pendingMenu", menuId);
        location.href = "./register.html";
    }
});
