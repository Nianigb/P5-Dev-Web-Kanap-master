// Définir les variables de l'article en question (id, nom, prix...)
// var lienproduit = new URL(window.location.href);
// var id = lienproduit.searchParams.get("id");
// var imgkanap = document.querySelector(".item__img");
// var nom = document.querySelector("#title");
// var prix = document.querySelector(".totalPrice");
// var description = document.querySelector("#description");
// var couleur = document.querySelector("#colors");
// var quantite = document.querySelector(".totalQuantity");

let panier = localStorage.getItem('panier');
let tableaupanier = [];
if (panier) {
  tableaupanier = JSON.parse(panier);
  
}
let prix = 0;

async function idproduit (id) {
  return new Promise((bonnevaleur,mauvaisevaleur) =>{
    fetch(`http://localhost:3000/api/products/${id}`)
    .then((response)=> response.json())
    .then((valeur)=>{
      bonnevaleur(valeur)
    })
    .catch((error) => mauvaisevaleur("message" + error));
  })
}

async function infosproduit(){
  let produit = "";
  for (let indice of tableaupanier){
    const idproduitpanier = await idproduit(indice.id);
    produit += `
    <article class="cart__item" data-id="${indice.id}" data-color="{product-color}">
    <div class="cart__item__img">
      <img src="${idproduitpanier.imageUrl}" alt="${idproduitpanier.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${indice.nom}</h2>
        <p>${indice.couleur}</p>
        <p>${idproduitpanier.price}</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${indice.quantite}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article
    `;

  }
}

// for (let product in tableaupanier) {
//   const produitapi = "http://localhost:3000/api/products/" + product.id;
//   fetch(produitapi)
//     .then(function (response) {
//       if (response.ok) { return response.json(); }
//     })
//     .then(function (article) {
//       afficherproduits(article);
//     })
//     .catch((error) => alert("message" + error));
//   function afficherproduits(article) {
//     let articlepanier = document.createElement("article");
//     articlepanier.classList.add("cart__item");
//     articlepanier.dataset.id = product.id;
//     articlepanier.dataset.color = product.couleur;
//     document.getElementById("cart__items").appendChild(articlepanier);

//     let divcart = document.createElement("div");
//     divcart.classList.add("cart__item__img");
//     articlepanier.appendChild(divcart);

//     // let imgcart = document.createElement("img");
//     // imgcart.src = article.imageUrl;
//     // imgcart.alt = article.altTxt;
//     // divcart.appendChild(imgcart);

//     let contenupanier = document.createElement("div");
//     contenupanier.classList.add("cart__item__content");
//     articlepanier.appendChild("contenupanier");

//     let description = document.createElement("div");
//     description.classList.add("cart__item__content__description");
//     contenupanier.appendChild(description);

//     let h2 = document.createElement("h2");
//     h2.innerHTML = product.nom;
//     description.appendChild(h2);

//     let p = document.createElement("p")
//     p.textContent = product.couleur;
//     description.appendChild(p);

//     let prix = document.createElement("p")
//     prix.textContent = article.price;
//     description.appendChild(prix);

//     let parametrespanier = document.createElement("div");
//     parametrespanier.classList.add("cart__item__content__settings");
//     contenupanier.appendChild(parametrespanier);

//     let quantitepanier = document.createElement("div");
//     quantitepanier.classList.add("cart__item__content__settings__quantity");
//     parametrespanier.appendChild(quantitepanierr);

//     let p2 = document.createElement("p")
//     p2.textContent = "Qté :" ;
//     quantitepanier.appendChild(p2);
  
//   }
// }

// // Fonction qui va afficher les produits sur la page panier
// function affichageProduits(response) {
//   // Récupération du panier à partir de localstorage
//   let panier = JSON.parse(localStorage.getItem('panier'));
//   // Si le panier n'est pas vide, on affiche les produits qu'il contient
//   if (panier && Object.keys(panier).length > 0) {
//     // Récupération de la div dans laquelle on affichera les produits
//     let produits = document.getElementById('cart__items');

//     // Pour chaque produit dans le panier, on crée un élément HTML qui affiche l'ID, la quantité et la couleur
//     for (let id in panier) {
//       let produit = panier[id];
//       if (produit) {
//         let element = document.createElement('div');
//         let contenu = `Nom : ${produit.nom} - Couleur : ${produit.couleur} - Quantité : ${produit.quantite}`;
//         element.textContent = contenu; // on affiche le contenu du produit dans l'élément HTML
//         produits.appendChild(element); // on ajoute l'élément HTML dans la div "cart__items"
//       }
//     }
//   }
// }

// affichageProduits();

// Fonction qui va retirer un produit du panier en cours
function retirerArticle(product) {
  //Retrait de l'article dans la liste précédente
  panier = panier.filter(a => a.id != product.id);
  savePanier(panier);
}

// Fonction pour sauvegarder le panier
function savePanier(panier) {
  // Mise à jour du panier dans localstorage
  localStorage.setItem('panier', JSON.stringify(panier));
}

// Fonction ajouter ou retirer un article du panier en cours
function changerQuantite(product, quantite) {
  // Nouvelle quantite de l'article
  let nouveauProduit = panier.find(p => p.id == product.id);
  if (nouveauProduit != undefined) {
    nouveauProduit.quantite += quantite;
  }
  // Mise à jour du panier
  savePanier(panier);
}



