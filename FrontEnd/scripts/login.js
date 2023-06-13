// Sélection du bouton d'envoi
const submitBtn = document.getElementById("submitBtn");

// Ecouteur sur le bouton d'envoi
submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Sélection des valeurs entrées dans les champs
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Appel à l'API
    fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            // Conversion en JSON des valeurs retournées
            body: JSON.stringify({
                email,
                password
              })
        })
        // Vérification des entrées
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                alert("Erreur dans l'e-mail ou le mot de passe");
            }
        })
        .then((responseToken) => {
            sessionStorage.setItem("token", responseToken.token)
            //retour à la page d'accueil
            window.location.href = "index.html"
        })
});
