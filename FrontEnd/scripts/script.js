const root = "http://localhost:5678/api/";

//Fonction pour charger les données
async function loadWorks() {
  const response = await fetch(root + 'works', {
    method: "GET"
  });
  const data = await response.json();
  works = data;
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

      // Création des boutons
      // 1. bouton "Tous"
      const btnAll = document.createElement("button");
      btnAll.innerHTML = "Tous";
      document.getElementById("filters").appendChild(btnAll);
      btnAll.addEventListener("click", function () {
        displayWork(
          works
        )
      });

      // 2. autres boutons
      const categoryListSelect = document.querySelector("select");
      const option = document.createElement("option");
        option.innerHTML = "";
        categoryListSelect.appendChild(option)

      category.forEach(element => {
        const btnFilters = document.createElement("button");
        btnFilters.innerHTML = element.name;
        document.getElementById("filters").appendChild(btnFilters);
        btnFilters.addEventListener("click", function () {
          displayWork(
            works.filter((work) => work.categoryId === element.id)
          );
        })
        // Ajout des catégories dans le selecteur de la deuxième modale
        const option = document.createElement("option");
        option.innerHTML = element.name;
        option.value = element.id;
        categoryListSelect.appendChild(option)
      });
      categoryListSelect.addEventListener("change", verifyForm)
    });
}

displayCategories();

//-----------Mode édition------------//

const logInOut = document.querySelector(".log-in-out");

function editMode() {
  // Si le token est bien stocké
  if (sessionStorage.getItem("token")) {
    // Suppression des filtres
    document.querySelector(".filters").style = "display:none"
    // Affichage des boutons du mode édition
    document.querySelector(".edit-mode").style = "display:flex";
    document.querySelector(".edit-btn").style = "visibility:visible";
    document.querySelector(".edit-btn2").style = "visibility:visible";
    logInOut.innerText = "logout";
    // Au clique sur logout on suppr le token et on renvoie la page principale
    logInOut.addEventListener("click", () => {
      sessionStorage.removeItem("token");
      logInOut.href = "index.html";
    })
  }
}

editMode()

//-----------Modales------------//

// 1. Création

// variable pour savoir quelle modale est ouverte
let modal = null

const openModal = function (e) {
  //Bloquage de l'effet au clic
  e.preventDefault()
  // Récupération de l'attribut href des liens (ici #modal)
  const idModal = e.currentTarget.className === "add-picture" ? "#modal-add" : "#modal-edit";
  modal = document.querySelector(idModal)
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
  fileChange = false
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

    // Suppression au clic sur l'icone
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

// Fonction pour récupérer le token
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
  document.getElementById("title").addEventListener("change", verifyForm )
}

function verifyForm() {
  const valueTitle = document.getElementById("title").value
  const titleOk = valueTitle !== null && valueTitle !== undefined && valueTitle.trim().length > 0;
  const categoryOk = document.getElementById("category").value.length > 0;
  if (titleOk && fileChange && categoryOk) {
    validateForm();
  }
}


modalAddImg();

const arrowLeft = document.querySelector(".fa-arrow-left");

arrowLeft.addEventListener("click", function () {
  modalAdd.style.display = "none";
  modalEdit.style.display = "flex";
});

// Ajout de la photo

const btnAdd = document.querySelector(".modal-add-img-btn");

const btnValidate = document.querySelector("#btn-add");

let formData = new FormData();

let fileChange = false;

btnAdd.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";

  input.addEventListener("change", (event) => {
    const file = event.target.files[0];
    formData = new FormData();
    formData.append("image", file);

    fileChange = true;

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
    verifyForm();
  });
  input.click()
});

btnValidate.addEventListener("click", (e) => {
  e.preventDefault();

  const btnTitle = document.querySelector(".title-form");
  const categoryOfWork = document.querySelector(".category-of-work");
  formData.append("title", btnTitle.value);
  formData.append("category", categoryOfWork.value);

  fetch(root + 'works', {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json;charset=utf-8",
        "Authorization": `Bearer ${getToken()}`,
      }
    })
    .then()
    .catch((error) => {
      console.error(error);
    });
})

// Vérification des champs pour changer la couleur du bouton d'envoi

const btnTitle = document.querySelector(".title-form");
const categoryOfWork = document.querySelector(".category-of-work");

function validateForm() {
  if (btnTitle.value) {
    btnValidate.style.background = '#1D6154';
  } else {
    btnValidate.style.background = '#A7A7A7';
  }
}

validateForm();