// NAVBAR DYNAMIQUE (ajout connexion/déconnexion)
export function loadNavbar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const isLogged = !!user;

    let loginLogoutLink = '<li><a href="./login.html">Connexion</a></li>';
    let registerLink = '<li><a href="./register.html">Inscription</a></li>'; 

    if (isLogged) {
        loginLogoutLink = '<li><a href="#" id="btn-deconnexion">Déconnexion</a></li>';
        registerLink = ''; 
    }

    document.getElementById("header").innerHTML = `
        <nav class="nav-header">
            <img src="./assets/images/logo.png" alt="logo" class="logo">
            <span class="burger">&#9776;</span>
            <ul class="menu_header">
                <li><a href="./index.html">Accueil</a></li>
                <li><a href="./menus.html">Menus</a></li>
                <li><a href="./contact.html">Contact</a></li>
                ${loginLogoutLink}
                ${registerLink}
            </ul>
        </nav>
    `;

    // Gestion du menu burger
    document.querySelector(".burger").addEventListener("click", () => {
        document.querySelector(".menu_header").classList.toggle("open");
    });

    // Gestion du clic sur Déconnexion
    const btnDeconnexion = document.getElementById("btn-deconnexion");
    if (btnDeconnexion) {
        btnDeconnexion.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.clear(); 
            alert("Vous êtes déconnecté.");
            window.location.href = "./index.html";
        });
    }
} // <--- C'EST CETTE ACCOLADE QUI MANQUAIT !

// FOOTER DYNAMIQUE
export function loadFooter() {
    const footerElem = document.getElementById("footer");
    if (footerElem) {
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
                    <h3><a href="./mentionlegal.html">Mentions légales</a></h3>
                    <h3><a href="./cgv.html">Conditions Générales de Vente (CGV)</a></h3>
                </div>
            </div>
        `;
    }
}

let userIsLogged = false;