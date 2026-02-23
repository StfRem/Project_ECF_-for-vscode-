const form = document.getElementById("register-form");

form.addEventListener("submit", function (e) {
    // Empêche le rechargement de la page
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const gsm = document.getElementById("gsm").value.trim();
    const email = document.getElementById("email").value.trim();
    const adresse = document.getElementById("adresse").value.trim();
    const ville = document.getElementById("ville").value.trim();
    const cp = document.getElementById("cp").value.trim();
    const password = document.getElementById("password").value.trim();

    // Vérification RGPD (Verifie si la case CGV est bien cochée)
    const cgvChecked = document.getElementById("accept-cgv").checked;
    if (!cgvChecked) {
        alert("Vous devez accepter les conditions générales.");
        return;
    }

    // VALIDATIONS (que ce soit conforme au format attendu)
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexGSM = /^0[67]\d{8}$/;

    if (!regexEmail.test(email)) {
        alert("Format d'email invalide.");
        return;
    }
    if (!regexGSM.test(gsm)) {
        alert("Numéro GSM invalide. Le numéro doit commencer par 06 ou 07.");
        return;
    }
    if (!regexPassword.test(password)) {
        alert("Le mot de passe ne respecte pas les critères de sécurité.");
        return;
    }

    // OBJET ENVOYÉ AU PHP
    const newUser = {
        fullname,
        gsm,
        email,
        adresse,
        cp,
        ville,
        password,
        role: "utilisateur"
    };

    fetch('../PHP/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {

            alert("Compte créé avec succès !");
            alert(`EMAIL BIENVENUE ENVOYÉ À : ${email}`);

            localStorage.setItem("userIsLogged", "true");





//mofification du localStorage pour stocker les infos de l'utilisateur connecté
            const userSession = {
                id: data.id,
                fullname: newUser.fullname,
                email: newUser.email,
                gsm: newUser.gsm,
                adresse: newUser.adresse,
                cp: newUser.cp,
                ville: newUser.ville,
                role: newUser.role
            };

            localStorage.setItem("user", JSON.stringify(userSession));
            // Redirection après l'inscription
            const pendingMenu = localStorage.getItem("pendingMenu");
            if (pendingMenu) {
                localStorage.removeItem("pendingMenu");
                location.href = `./commande.html?id=${pendingMenu}`;
            } else {
                location.href = "../index.html";
            }

        } else {
            alert("Erreur : " + data.message);
        }
    })
    .catch(error => {
        console.error("Erreur:", error);
        alert("Erreur de connexion au serveur.");
    });
});
