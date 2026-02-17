const form = document.getElementById("contact-form");
const confirmation = document.getElementById("message-confirmation");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const titre = document.getElementById("titre").value;
    const description = document.getElementById("description").value;
    const email = document.getElementById("email").value;

    // Simulation d'envoi d'email
    console.log(`
        EMAIL ENVOYÉ À : contact@viteetgourmand.fr
        De : ${email}
        Titre : ${titre}
        Message : ${description}
    `);

    // Affichage confirmation
    form.classList.add("hidden");
    confirmation.classList.remove("hidden");

    setTimeout(() => {
        location.href = "./index.html";
    }, 3000);
});