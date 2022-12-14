// Définir les variables de l'article en question (id, nom, prix...)
// var lienproduit = new URL(window.location.href);
// var id = lienproduit.searchParams.get("id");
// var imgkanap = document.querySelector(".item__img");
// var nom = document.querySelector("#title");
// var prix = document.querySelector(".totalPrice");
// var description = document.querySelector("#description");
// var couleur = document.querySelector("#colors");
// var quantite = document.querySelector(".totalQuantity");

let panier = JSON.parse(localStorage.getItem('panier'));
let prix = 0;

for (let produitlocal=0; produitlocal<panier.length; produitlocal++) {
  const produitapi = "http://localhost:3000/api/products/" + panier[produitlocal].id;
  fetch(produitapi)
  .then(function (response) {
    if (response.ok) { return response.json(); }
  })
  .then(function (article) {
   afficherproduits(article);
  })
  .catch((error) => alert("message" + error));
  function afficherproduits(response){
    let articlepanier=document.createElement("article");
    articlepanier.classList.add("cart__item");
    articlepanier.dataset.id=panier[produitlocal].id;
    articlepanier.dataset.color=panier[produitlocal].couleur;
    document.getElementById("cart__items").appendChild(articlepanier);
    
    let divcart=document.createElement("div");
    divcart.classList.add("cart__item__img");
    articlepanier.appendChild(divcart);

    let imgcart=document.createElement("img");
    imgcart.src=response.imageUrl;
    imgcart.alt=response.altTxt;
    divcart.appendChild(imgcart);

  }
}

// // Fonction qui va afficher les produits sur la page panier
// function affichageProduits(response) {
//   // Récupération du panier à partir de localstorage
//   let panier = JSON.parse(localStorage.getItem('panier'));
//   // Si le panier n'est pas vide, on affiche les produits qu'il contient
//   if (panier && Object.keys(panier).length > 0) {
//     // Récupération de la div dans laquelle on affichera les produits
//     let produits = document.getElementById('cart__items');

//     // Pour chaque produit dans le panier, on crée un élément HTML qui affiche l'ID, la quantité et la couleur
//     for (let id of panier) {
//       let produit = id;
//       if (produit) {
//         // Pour chaque couleur du produit dans la panier, on récupère sa valeur
//         for (let couleur of produit) {
//           let element = document.createElement('div');
//           let contenu = `ID : ${id} - Couleur : ${couleur} - Quantité : ${produit.quantite}`;
//           element.textContent = contenu; // on affiche le contenu du produit dans l'élément HTML
//           produits.appendChild(element); // on ajoute l'élément HTML dans la div "cart__items"
//         }
//       }
//     }
//   }
// }

// affichageProduits();