// Définir les variables de l'article en question (id, nom, prix...)
// var lienproduit = new URL(window.location.href);
// var id = lienproduit.searchParams.get("id");
var imgkanap = document.querySelector(".item__img");
var nom = document.querySelector("#title");
var prix = document.querySelector(".totalPrice");
var description = document.querySelector("#description");
var couleur = document.querySelector("#colors");
var quantite = document.querySelector(".totalQuantity");

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

// Récupération du panier à partir de localstorage
let panier = JSON.parse(localStorage.getItem('panier'));

// Si le panier n'est pas vide, on affiche les produits qu'il contient
if (panier && Object.keys(panier).length > 0) {
  // Récupération de la div dans laquelle on affichera les produits
  let produits = document.getElementById('produits');

  // Pour chaque produit dans le panier, on crée un élément HTML qui affiche l'ID, la quantité et la couleur
  for (let id in panier) {
    let produit = panier[id];
    let element = document.createElement('div');
    let = `ID : ${id} - Quantité : ${produit.quantite} - Couleur : ${produit.couleur}`;
    produits.appendChild(element);
  }
}