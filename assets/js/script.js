
// NAVBAR DYNAMIQUE
export function loadNavbar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const header = document.getElementById("header");
    if (!header) return;

    // On vérifie si on est dans le dossier /pages/
    const isInsidePages = window.location.pathname.indexOf("/pages/") !== -1;

    if (isInsidePages) {
        // LIENS DEPUIS LE DOSSIER PAGES
        header.innerHTML = `
            <nav class="nav-header">
                <img src="../assets/images/logo.png" alt="logo" class="logo">
                <span class="burger">&#9776;</span>
                <ul class="menu_header">
                    <li><a href="../index.html">Accueil</a></li>
                    <li><a href="./menus.html">Menus</a></li>
                    <li><a href="./contact.html">Contact</a></li>
                    ` + (user ? '<li><a href="#" id="btn-deconnexion">Déconnexion</a></li>' : '<li><a href="./login.html">Connexion</a></li><li><a href="./register.html">Inscription</a></li>') + `
                </ul>
            </nav>`;
    } else {
        // LIENS DEPUIS L'ACCUEIL (RACINE)
        header.innerHTML = `
            <nav class="nav-header">
                <img src="./assets/images/logo.png" alt="logo" class="logo">
                <span class="burger">&#9776;</span>
                <ul class="menu_header">
                    <li><a href="./index.html">Accueil</a></li>
                    <li><a href="./pages/menus.html">Menus</a></li>
                    <li><a href="./pages/contact.html">Contact</a></li>
                    ` + (user ? '<li><a href="#" id="btn-deconnexion">Déconnexion</a></li>' : '<li><a href="./pages/login.html">Connexion</a></li><li><a href="./pages/register.html">Inscription</a></li>') + `
                </ul>
            </nav>`;
    }

    // Gestion du menu burger
    const burger = document.querySelector(".burger");
    if (burger) {
        burger.onclick = function() {
            document.querySelector(".menu_header").classList.toggle("open");
        };
    }

    // Gestion de la déconnexion
    const btnDeconnexion = document.getElementById("btn-deconnexion");
    if (btnDeconnexion) {
        btnDeconnexion.onclick = function(e) {
            e.preventDefault();
            localStorage.clear(); 
            alert("Vous êtes déconnecté.");
            window.location.href = isInsidePages ? "../index.html" : "./index.html";
        };
    }
}

// FOOTER DYNAMIQUE
export function loadFooter() {
    const footerElem = document.getElementById("footer");
    if (!footerElem) return;

    const isInsidePages = window.location.pathname.indexOf("/pages/") !== -1;
    
    // On définit le chemin vers les fichiers légaux selon où on se trouve
    const legalPath = isInsidePages ? "./" : "./pages/";

    footerElem.innerHTML = `
        <div class="footer">
            <h2>Horaires</h2>
            <ul class="ul_horaire">
                <li>Lundi : 08h00 – 20h00</li>
                <li>Mardi : 08h00 – 20h00</li>
                <li>Mercredi : 08h00 – 20h00</li>
                <li>Jeudi : 08h00 – 20h00</li>
                <li>Vendredi : 08h00 – 20h00</li>
                <li>Samedi : 09h00 – 18h00</li>
                <li>Dimanche : 09h00 – 13h00</li>
            </ul>
            <div class="mention">
                <h3><a href="` + legalPath + `mentionlegal.html">Mentions légales</a></h3>
                <h3><a href="` + legalPath + `cgv.html">Conditions Générales de Vente (CGV)</a></h3>
            </div>
        </div>
    `;
}