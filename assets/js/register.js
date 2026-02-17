const form = document.getElementById("register-form");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const gsm = document.getElementById("gsm").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const password = document.getElementById("password").value.trim();
    const cp = document.getElementById("cp").value.trim();

    // 1. VALIDATIONS (Ta structure d'origine)
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexGSM = /^(0[67]\d{8}|(\+33|0033)[67]\d{8})$/;

    if (!regexEmail.test(email)) {
        alert("Format d'email invalide.");
        return;
    }
    if (!regexGSM.test(gsm)) {
        alert("Numéro GSM invalide.");
        return;
    }
    if (!regexPassword.test(password)) {
        alert("Le mot de passe ne respecte pas les critères de sécurité.");
        return;
    }

    // 2. PRÉPARATION DE L'OBJET POUR SQL
    const newUser = {
        id: "USR-" + Date.now(),
        fullname,
        gsm,
        email,
        address,
        cp,
        password, // Envoyé au PHP
        role: "utilisateur"
    };

    // 3. ENVOI AU SERVEUR (PHP / SQL)
    fetch('./php/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            // ALERTES D'ORIGINE
            alert("Compte créé avec succès !");
            alert(`EMAIL BIENVENUE ENVOYÉ À : ${email}`);

            // 4. GESTION DE LA SESSION (Le strict nécessaire)
            localStorage.setItem("userIsLogged", "true");
            
            // On crée un objet session SANS le mot de passe
            const userSession = {
                id: newUser.id,
                fullname: newUser.fullname,
                email: newUser.email,
                role: newUser.role
            };
            localStorage.setItem("user", JSON.stringify(userSession));

            // 5. REDIRECTION
            const pendingMenu = localStorage.getItem("pendingMenu");
            if (pendingMenu) {
                localStorage.removeItem("pendingMenu");
                location.href = `./commande.html?id=${pendingMenu}`;
            } else {
                location.href = "./index.html";
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