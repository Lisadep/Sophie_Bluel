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