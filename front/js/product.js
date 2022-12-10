// Définir les variables de l'article en question (id, nom, prix...)
var lienproduit = new URL(window.location.href);
var id = lienproduit.searchParams.get("id");
var imgkanap = document.querySelector(".item__img");
var nom = document.querySelector("#title");
var prix = document.querySelector("#price");
var description = document.querySelector("#description");
var couleur = document.querySelector("#colors");

// Récupération du produit à partir de son id
const productId = "http://localhost:3000/api/products/" + id;
fetch(productId)
  .then(function (response) {
    if (response.ok) { return response.json(); }
  })
  .then(function (article) {
    infosproduit(article);
  })
  .catch((error) => alert("message" + error));


// Récupération des informations du produit suivant: son image, son nom, son prix, sa description et ses couleurs
function infosproduit(article) {
  // Création de l'image du produit
  let image = document.createElement("img");
  // Affichage de l'image
  imgkanap.appendChild(image);
  image.src = article.imageUrl;
  image.alt = article.altTxt;
  // Informations suivantes
  nom.innerHTML = article.name;
  prix.innerHTML = article.price;
  description.innerHTML = article.description;
  // Pour chaque couleur présente dans la liste du produit, on l'affiche
  for (let color of article.colors) {
    let opt = document.createElement("option");
    opt.innerHTML = color;
    couleur.appendChild(opt);
  }
}

// Récupération de la quantité de l'article sélectionné
var quantite = document.querySelector("#quantity").value;

// Création d'un objet panier vide
let panier = {};

// Fonction pour ajouter un produit au panier
function ajouterAuPanier(id, quantite, couleur) {
  // Si le produit n'existe pas dans le panier, on l'ajoute avec la quantité spécifiée
  console.log(panier[id])
  if (!panier[id]) {
    panier[id] = {
      quantite: quantite,
      couleur: couleur
    };
  }
  // Si le produit existe déjà dans le panier, on ajoute la quantité spécifiée à la quantité actuelle
  else {
    panier[id].quantite += quantite;
    panier[id].couleur = couleur;
  }

  // Mise à jour du panier dans localstorage
  localStorage.setItem('panier', JSON.stringify(panier));
}

// Fonction pour récupérer le panier à partir de localstorage
function recupererPanier() {
  // Récupération du panier à partir de localstorage
  let panierLocal = localStorage.getItem('panier');

  // Si le panier existe dans localstorage, on le convertit en objet JavaScript et on le stock dans la variable globale panier
  if (panierLocal) {
    panier = JSON.parse(panierLocal);
  }
}

// Récupération du panier à partir de localstorage lorsque la page est chargée
recupererPanier();

// Ajout d'un produit au panier lorsque le bouton "Ajouter au panier" est cliqué
let boutonAjouter = document.getElementById('addToCart');
boutonAjouter.addEventListener('click', function () {
  let produit = id;
  let quantite = parseInt(document.getElementById('quantity').value);
  let couleur = document.getElementById('colors').value;
  ajouterAuPanier(produit, quantite, couleur);
});