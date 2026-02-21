import { loadNavbar, loadFooter } from "./script.js";
loadNavbar();
loadFooter();

let menusFromDB = [];

// -----------------------------
// Récupération de l'ID dans l'URL
// -----------------------------
const params = new URLSearchParams(location.search);
const id = params.get("id");

// Conteneur HTML
const container = document.getElementById("menu-detail-container");

// -----------------------------
// Récupération du menu depuis la base
// -----------------------------
fetch("../PHP/getMenus.php")
    .then(res => res.json())
    .then(data => {

        menusFromDB = data;

        const menu = data.find(m => m.id == id);


        if (!menu) {
            container.innerHTML = "<p>Menu introuvable.</p>";
            return;
        }

        afficherMenu(menu);
    })
    .catch(err => {
        console.error("Erreur fetch menu :", err);
        container.innerHTML = "<p>Erreur lors du chargement du menu.</p>";
    });

// -----------------------------
// Fonction d'affichage du menu
// -----------------------------
function afficherMenu(menu) {

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
                        <img src="/assets/images/gauche.png" alt="gauche">
                    </button>

                    <button class="arrow right" data-menu="${menu.id}">
                        <img src="/assets/images/droite.png" alt="droite">
                    </button>
                </div>
            </div>
        </article>
    `;
}

// -----------------------------
// Slider
// -----------------------------
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".arrow");
    if (!btn) return;

    const menuId = btn.dataset.menu;
    const direction = btn.classList.contains("left") ? -1 : 1;

    const imgElement = document.getElementById(`img-${menuId}`);
    const menu = menusFromDB.find(m => m.id == menuId);

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

    const isLogged = localStorage.getItem("userIsLogged") === "true";

    if (isLogged) {
        location.href = `./commande.html?id=${menuId}`;
    } else {
        alert(
            "Vous devez être inscrit pour commander ce menu.\n\n" +
            "Veuillez vous connecter ou créer un compte pour continuer."
        );
        localStorage.setItem("pendingMenu", menuId);
        location.href = "./register.html";
    }
});
