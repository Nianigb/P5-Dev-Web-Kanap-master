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

// Fonction pour ajouter un produit au panier
function ajouterAuPanier(id, couleur, quantite) {
  // Récupérer les données du panier à partir de localStorage
  let panier = JSON.parse(localStorage.getItem('panier'));
  // Si le panier n'existe pas encore, création d'un panier vide
  if (!panier) {
    panier = {};
  }
  // Si le produit a déjà été ajouté au panier
  if (panier[id]) {
    // Si la couleur du produit existe déjà dans le panier, ajouter la quantité au produit existant
    if (panier[id][couleur]) {
      // Récupération de la quantité d'un produit déjà existant
      let oldQuantity = getQuantity(id, couleur);
      panier[id][couleur] = oldQuantity + quantite;
    } else {
      // Si la couleur du produit n'existe pas encore dans le panier, ajouter la quantité en fonction de la couleur
      panier[id][couleur] = quantite;
    }
  } else {
    // Si le produit n'a pas encore été ajouté au panier, ajouter l'id du produit avec la quantité en fonction de la couleur
    panier[id] = {
      "id": id,
      "nom": nom.innerHTML,
      "couleur": couleur,
      "quantite": quantite,
    };
  }

  // Fonction pour récupérer la quantité d'un produit déjà mis dans le panier, en fonction de sa couleur
  function getQuantity(id, couleur) {
    // Récupérer les données du panier à partir de localStorage
    let panier = JSON.parse(localStorage.getItem('panier'));
    // Si le panier n'existe pas ou si le produit n'existe pas dans le panier, retourner 0
    if (!panier || !panier[id] || !panier[id][couleur]) {
      return 0;
    }
    // Retourner la quantité du produit
    return panier[id][couleur];
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
  let couleur = document.getElementById('colors').value;
  let quantite = parseInt(document.getElementById('quantity').value);
  ajouterAuPanier(produit, couleur, quantite);
});