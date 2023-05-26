const root = "http://localhost:5678/api/";

//Fonction pour charger les données
async function loadWorks() {
  const response = await fetch(root + 'works', {
    method: "GET"
  });
  const data = await response.json();
  loadedData = data;
  console.log(data);
  displayWork(loadedData);
};

//Fonction pour afficher les travaux dans le DOM
function displayWork(data) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML= "";
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

function displayCategories() {
  // Récupération des catégories de l'API

  fetch(root + "categories")
    .then((reponse) => reponse.json())
    .then((category) => {
      categoryFilters = category;
      console.log(category)

      const btnAll = document.createElement("button");
        btnAll.innerHTML = "Tous";
        document.getElementById("filters").appendChild(btnAll);
        btnAll.addEventListener("click", function() {
          displayWork(
            loadedData
        )});
        

      category.forEach(element => {
        const btnFilters = document.createElement("button");
        btnFilters.innerHTML = element.name;
        document.getElementById("filters").appendChild(btnFilters);
        btnFilters.addEventListener("click", function() {
          displayWork(
            loadedData.filter((work) => work.categoryId === element.id)
          );
        })
      });
    });
}

displayCategories();