
let user = {
    email: "sophie.bluel@test.tld",
    password: "S0phie"
};

// Sélection des champs et du btn d'envoi du formulaire
const email = document.getElementById("email");
const password = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");



function login() {
    // Ecouteur sur le bouton d'envoi
// submitBtn.addEventListener("click", () => {

    fetch(root + "users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json()
    .then((responseToken) => {
        console.log(responseToken);
        sessionStorage.setItem("token", responseToken.token)
        //retour à la page d'accueil
        //window.location.href="index.html"
    }));
// })

}

//Recuperer le token pour le passer au Web service (pour l'étape suivante)
function getToken() {
    return sessionStorage.getItem('token');
}


login();