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
  gallery.innerHTML = "";
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
      btnAll.addEventListener("click", function () {
        displayWork(
          loadedData
        )
      });


      category.forEach(element => {
        const btnFilters = document.createElement("button");
        btnFilters.innerHTML = element.name;
        document.getElementById("filters").appendChild(btnFilters);
        btnFilters.addEventListener("click", function () {
          displayWork(
            loadedData.filter((work) => work.categoryId === element.id)
          );
        })
      });
    });
}

displayCategories();


//-----------Modale------------//

// variable pour savoir quelle modale est ouverte
let modal = null

const openModal = function (e) {
  //Bloquage de l'effet au clic
  e.preventDefault()
  // Récupération de l'attribut href des liens (ici #modal)
  modal = document.querySelector(e.target.getAttribute("href"))
  // Affichage de la boîte modal
  modal.style.display = null
  modal.removeAttribute("aria-hidden")
  modal.setAttribute("aria-modal", "true")
  // Ecouteur sur la modale pour la fermer
  modal.addEventListener("click", closeModal)
  // Ecouteur sur la croix dans la modale pour la fermer
  modal.querySelector(".js-modal-cross").addEventListener("click", closeModal)
  modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
}

const closeModal = function (e) {
  // si aucune modale n'est active on ne fait rien
  if (modal === null) return
  // on fait l'inverse de l'ouverture de la modale
  e.preventDefault()
  modal.style.display = "none"
  modal.setAttribute("aria-hidden", "true")
  modal.removeAttribute("aria-modal")
  modal.removeEventListener("click", closeModal)
  // Suppression de l'écouteur sur la modale
  modal.querySelector(".js-modal-cross").removeEventListener("click", closeModal)
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
  modal = null
}

// Fonction pour que la modale ne se ferme pas au clic nimporte où
const stopPropagation = function (e) {
  e.stopPropagation()
}

// Sélection des tous les liens de class js-modal
document.querySelectorAll(".js-modal").forEach(a => {
  // Au clique on apl la fonction openModal
  a.addEventListener("click", openModal)
})

// Gestion de la fermeture de la modale avec le clavier (échap)
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e)
  }
})