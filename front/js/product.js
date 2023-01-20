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
  let panier = localStorage.getItem('panier');
  // Si le panier n'existe pas encore, création d'un panier vide
  let tableauProduit = [];
  if (panier) {
    tableauProduit = JSON.parse(panier);
  }
  // Si le produit a déjà été ajouté au panier alors j'effectue une recherche dans le tableau des produits en utilisant la fonction find
  let resultFind = tableauProduit.find(
    (el) => el.id === id && el.couleur === couleur
  );
  if (resultFind) {
    // Si la couleur du produit existe déjà dans le panier, ajouter la quantité au produit existant

    // Récupération de la quantité d'un produit déjà existant
    let oldQuantity = getQuantity(id, couleur);
    resultFind.quantite = oldQuantity + quantite;
    if (resultFind.quantite > 0 && resultFind.quantite <= 100) {
      localStorage.setItem("panier", JSON.stringify(tableauProduit));
    }
    else {
      alert("erreur quantité");
    }
  } else {
    // Si le produit n'a pas encore été ajouté au panier, ajouter l'id du produit avec la quantité en fonction de la couleur
    let paniernew = {
      "id": id,
      "couleur": couleur,
      "quantite": quantite,
    };
    tableauProduit.push({ id: paniernew.id, couleur: paniernew.couleur, quantite: paniernew.quantite });
    localStorage.setItem("panier", JSON.stringify(tableauProduit));
  }

  // Fonction pour récupérer la quantité d'un produit déjà mis dans le panier, en fonction de sa couleur et de son id
  function getQuantity(id, couleur) {
    let qte = 0;
    // Boucle sur la liste des produits présents dans le panier
    for (let kanap of tableauProduit) {
      if (kanap.id === id && kanap.couleur === couleur) {
        qte = kanap.quantite;
      }
    }
    return qte;
  }

  // Mise à jour du panier dans localstorage

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
  if (couleur) {
    ajouterAuPanier(produit, couleur, quantite);
  }
  else {
    alert("erreur couleur");
  }
});