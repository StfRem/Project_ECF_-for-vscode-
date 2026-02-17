// Connexion utilisateur via PHP / SQL
const form = document.getElementById("login-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailSaisi = document.getElementById("email").value.trim();
    const passwordSaisi = document.getElementById("password").value.trim();

    // ENVOI AU SERVEUR (WAMP / PHP)
    fetch('./php/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email: emailSaisi, 
            password: passwordSaisi 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            // L'utilisateur renvoyé par le PHP contient ses infos SQL (fullname, role, etc.)
            const user = data.user;

            // Sauvegarde de la session (on garde ta logique d'alerte)
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("userIsLogged", "true");

            alert("Connexion réussie !");

            // Redirection selon le rôle (Ta structure d'origine)
            if (user.role === "admin") {
                location.href = "./espace-admin.html";
            } 
            else if (user.role === "employe") {
                location.href = "./espace-employe.html";
            } 
            else {
                location.href = "./espace-utilisateur.html";
            }
        } else {
            // Si le PHP dit que l'email ou le mdp est faux
            alert(data.message); // Affiche "Email ou mot de passe incorrect"
        }
    })
    .catch(error => {
        console.error("Erreur login:", error);
        alert("Erreur de connexion au serveur. Vérifie que Wamp est lancé.");
    });
});

// Réinitialisation de mot de passe (Simulation)
document.getElementById("btn-reset").addEventListener("click", () => {
    const email = prompt("Entrez votre adresse email :");
    
    if (!email) return;

    // Ici, on pourrait aussi faire un fetch pour vérifier si l'email existe en SQL
    // Mais on garde ta simulation console pour l'instant
    console.log(`
        EMAIL ENVOYÉ À : ${email}
        Lien de réinitialisation : [simulation]
    `);

    alert("Un lien de réinitialisation a été envoyé à votre adresse email.");
});