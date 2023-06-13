const root = "http://localhost:5678/api/";

//Fonction pour charger les données
async function loadWorks() {
  const response = await fetch(root + 'works', {
    method: "GET"
  });
  const data = await response.json();
  works = data;
  console.log(data);
  displayWork(works);
  displayWorkInModal(works);
};

//Fonction pour afficher les travaux dans le DOM
function displayWork(data) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    // Création de l'élément du DOM qui accueillera les travaux
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

let categoryFilters = []

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
        const categoryListSelect = document.querySelector("select");
        const option = document.createElement("option");
        option.innerHTML = element.name;
        option.value = element.id;
        categoryListSelect.appendChild(option)
      });
    });
}

displayCategories();

//-----------Mode édition------------//

const logInOut = document.querySelector(".log-in-out");

function editMode() {
  // Si le token est bien stocké
  if (sessionStorage.getItem("token")) {
    console.log(sessionStorage)
    // Suppression des filtres
    document.querySelector(".filters").style = "display:none"
    // Affichage des boutons du mode édition
    document.querySelector(".edit-mode").style = "display:flex";
    document.querySelector(".edit-btn").style = "visibility:visible";
    document.querySelector(".edit-btn2").style = "visibility:visible";
    logInOut.innerText = "logout";
    // Au clique sur logout on suppr le token et on renvoi la page principale
    logInOut.addEventListener("click", () => {
      sessionStorage.removeItem("token");
      logInOut.href = "index.html";
    })
  }
}

editMode()

//-----------Modale------------//

// 1. Création

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

document.querySelectorAll(".add-picture").forEach(a => {
  // Au clique on apl la fonction openModal
  a.addEventListener("click", openModal)
})

// Gestion de la fermeture de la modale avec le clavier (échap)
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e)
  }
})

// 2. Affichage des travaux

const modalGallery = document.querySelector("#modal-gallery");

//Fonction pour afficher les travaux dans la modale
function displayWorkInModal(data) {
  for (let i = 0; i < data.length; i++) {
    const figure = document.createElement("figure");
    // Affichage des travaux
    figure.innerHTML = `
      <img src="${data[i].imageUrl}" alt="${data[i].title}" crossorigin="anonymous">
      <p>éditer</p>
      `;
    modalGallery.appendChild(figure)

    // Icone pour supprimer
    const deleteIconeBg = document.createElement("div");
    const deleteIcone = document.createElement("i");
    deleteIconeBg.className = "deleteIconeBg";
    deleteIcone.className = "fa-solid fa-trash-can fa-xs deleteIcone";
    figure.appendChild(deleteIconeBg)
    deleteIconeBg.appendChild(deleteIcone)


    deleteIcone.addEventListener("click", function () {
      // Récupération de l'ID de l'élément parent
      const workId = data[i].id;
      // Requête à l'API pour supprimer
      fetch(root + `works/${workId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": `Bearer ${getToken()}`,
          }
        })
        .then(function (response) {
          if (response.ok) {
            // Réaffichage des travaux dans la modale et la page d'accueil
            const filterWork = works.filter(work => workId !== work.id)
            displayWorkInModal(filterWork);
            displayWork(filterWork);
          } else {
            console.error("Erreur lors de la suppression")
          }
        })

    });
  }
}

function getToken() {
    return sessionStorage.getItem("token");
}

let works = []

// Modale pour ajouter une photo

const modalEdit = document.querySelector("#modal-edit");
const modalAdd = document.querySelector("#modal-add");
const btnAddImg = document.querySelector(".add-picture");

function modalAddImg() {
  btnAddImg.addEventListener("click", function () {
    modalEdit.style.display = "none";
    modalAdd.style.display = "flex";
  });
}

modalAddImg();

const arrowLeft = document.querySelector(".fa-arrow-left");

arrowLeft.addEventListener("click", function () {
  modalAdd.style.display = "none";
  modalEdit.style.display = "flex";
});

const btnAdd = document.querySelector(".modal-add-img-btn");

btnAdd.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    const imgElement = document.createElement("img");
    imgElement.classList.add("selected-image");
    const boxModalAdd = document.querySelector(".modal-add-img");
    boxModalAdd.innerHTML = "";
    boxModalAdd.appendChild(imgElement);
    const reader = new FileReader();
    reader.onload = function (e) {
      imgElement.src = e.target.result;
    };
    reader.readAsDataURL(file);
    fetch("http://" + window.location.hostname + ":5678/api/works", {
        method: "POST",
        body: formData,
      })
      .then((response) => {})
      .catch((error) => {
        console.error(error);
      });
  });
  input.click();
});
