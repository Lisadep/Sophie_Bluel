const root = "http://localhost:5678/api/";

//Fonction pour charger les données
async function loadWorks() {
    const response = await fetch(root + 'works', {method: "GET"});
    const data = await response.json();
    loadedData = data;
    displayWork(loadedData);
};

//Fonction pour afficher les travaux dans le DOM
function displayWork(data) {
    const gallery = document.querySelector(".gallery");
    for (let i = 0; i < data.length; i++) {
        // Récupération de l'élément du DOM qui accueillera les travaux
        const figure = document.createElement("figure");
        // Affichage des travaux récupérés
        figure.innerHTML = `
      <img src="${data[i].imageUrl}" alt="${data[i].title}" crossorigin="anonymous">
      <figcaption>${data[i].title}</figcaption>
    `;
        // On rattache la balise figure a la section Gallery
        gallery.appendChild(figure);
    }
};

loadWorks();


//-----------Filtres------------//

const buttonAll = document.querySelector(".all");
const buttonObjects = document.querySelector(".objects");
const buttonApartments = document.querySelector(".apartments");
const buttonHotelsAndRestaurants = document.querySelector(".hotelsAndRestaurants");

buttonAll.addEventListener("click", function() {
    document.querySelector(".gallery").innerHTML = "";
    displayWork(loadedData);
});

buttonObjects.addEventListener("click", function() {
    document.querySelector(".gallery").innerHTML = "";
    displayWork(
        loadedData.filter((work) => work.category.name.includes("Objets"))
      );
});

buttonApartments.addEventListener("click", function() {
    document.querySelector(".gallery").innerHTML = "";
    displayWork(
        loadedData.filter((work) => work.category.name.includes("Appartements"))
      );
});

buttonHotelsAndRestaurants.addEventListener("click", function() {
    document.querySelector(".gallery").innerHTML = "";
    displayWork(
        loadedData.filter((work) => work.category.name.includes("Hotels & restaurants"))
      );
});


//-----------Connexion------------//


let user = {
    "email": "sophie.bluel@test.tld",
    "password": "S0phie "
};

const email = document.getElementById("email");
const password = document.getElementById("password");
