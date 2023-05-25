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

// function displayCategories() {
//   // Récupération des catégories de l'API

//   fetch(root + "categories")
//     .then((reponse) => reponse.json())
//     .then((category) => {
//       categoryFilters = category;
//       console.log(category)

//     //   for (let i = 0; i < category.length; i++) {
//     //     const categories = category[i];

//     //   }

//     });
// }

// displayCategories();

buttonAll.addEventListener("click", function() {
    document.querySelector(".gallery").innerHTML = "";
    buttonAll.classList.add("filter_selected")
    displayWork(loadedData)
});

buttonObjects.addEventListener("click", function() {
    document.querySelector(".gallery").innerHTML = "";
    displayWork(
        loadedData.filter((work) => work.categoryId === 1)
      );
});


buttonApartments.addEventListener("click", function(param) {
    selectFilter(param)
});

function selectFilter(param) {
  if (param.target.class === "apartments") {
    displayWork(
      loadedData.filter((work) => work.categoryId === 2)
    );
  } else {
    console.log("erreur")
  }
  }


// -------------Test avec data

// buttonApartments.addEventListener("click", function(param) {
//   document.querySelector(".gallery").innerHTML = "";
//   selectFilter(param)
// });

