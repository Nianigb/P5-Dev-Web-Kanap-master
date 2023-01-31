// Récupération du panier stocker dans le local storage
let panier = localStorage.getItem('panier');
let tableaupanier = [];
if (panier) {
  tableaupanier = JSON.parse(panier);
  infosproduit();
}
// Récupérer les infos de chaque ligne du panier en appelant le serveur (on lui passe l'id, il nous retourne le product correspondant)

async function idproduit(id) {
  return new Promise((bonnevaleur, mauvaisevaleur) => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then((response) => response.json())
      .then((valeur) => {
        bonnevaleur(valeur);
      })
      .catch((error) => mauvaisevaleur("Erreur : " + error));
  });
}

async function infosproduit() {
  let html = "";
  let totalPrice = 0;
  let quantite = 0;

  // On boucle sur chaque article contenu dans le panier
  for (let indice of tableaupanier) {
    // On récupère les données à jour contenues sur le serveur
    const idproduitpanier = await idproduit(indice.id);
    // On enrichit le html avec la donnée reçue
    html =
      html +
      `<article class="cart__item" data-id="${indice.id}" data-color="${indice.couleur}">
                <div class="cart__item__img">
                    <img src="${idproduitpanier.imageUrl}" alt="${idproduitpanier.altTxt}"></img>
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${idproduitpanier.name}</h2>
                        <p>${indice.couleur}</p>
                        <p>${idproduitpanier.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${indice.quantite}"></input>
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`;
    totalPrice += indice.quantite * idproduitpanier.price;
    quantite += parseInt(indice.quantite);
  }
  // Après on injecte la variable avec le texte(html)produit au dessus, dans l'element avec id "cart__items"
  const cart__items = document.querySelector("#cart__items");
  cart__items.innerHTML = html;
  // Gestion suppression
  const deleteBtns = document.querySelectorAll(".deleteItem");
  for (let deleteBtn of deleteBtns) {
    // On ajoute un écouteur d'evenement sur chaque btn delete
    deleteBtn.addEventListener("click", () => {
      // On récupère le parent
      const selectedArticle = deleteBtn.closest("article");
      // On récupère l'id et la couleur stockées dans data-color et data-id
      const removeId = selectedArticle.getAttribute("data-id");
      const removeColor = selectedArticle.getAttribute("data-color");
      // On boucle sur le tableaupanier pour savoir quelle ligne/objet effacer
      // ou on utilise une fonction toute faite qui filtre des données dans un tableau
      tableaupanier = tableaupanier.filter(
        (product) => !(product.id === removeId && product.couleur === removeColor)
      );
      // Mise à jour du panier ds le localstorage
      localStorage.setItem("panier", JSON.stringify(tableaupanier));
      // Je rappelle la meme fonction pour mettre à jour l'affichage
      infosproduit();
    });
  }

  // Recupérer les boutons quantity
  const quantityBtns = document.querySelectorAll(".itemQuantity");
  for (const quantityBtn of quantityBtns) {
    // On écoute le changement de valeur sur toutes les quantités
    quantityBtn.addEventListener("change", async () => {
      // On récupère le parent
      const selectedArticle = quantityBtn.closest("article");
      // On récupère l'id et la couleur stockées dans data-color et data-id
      const updatedId = selectedArticle.getAttribute("data-id");
      const updatedColor = selectedArticle.getAttribute("data-color");
      // On boucle sur le tableaupanier pour savoir quelle ligne/objet éditer
      for (const product of tableaupanier) {
        if (product.id === updatedId && product.couleur === updatedColor) {
          product.quantite = parseInt(quantityBtn.value);
          if (product.quantite > 100) {
            alert(
              "Vous ne pouvez pas acheter plus de 100 canapés de cette couleur."
            );
            return;
          }
          // On arrete la boucle quand on a trouvé et mis à jour le bon product : break
          break;
        }
      }
      localStorage.setItem("panier", JSON.stringify(tableaupanier));
      // Je rappelle la meme fonction pour mettre à jour l'affichage
      infosproduit();
    });
  }
  // Mettre à jour la quantité totale sur la page
  document.getElementById("totalQuantity").textContent = quantite;
  // Mettre à jour le prix total sur la page
  document.getElementById("totalPrice").textContent = totalPrice;
}

// Fonction pour sauvegarder le panier
function savePanier(produits) {
  // Mise à jour du panier dans localstorage
  localStorage.setItem('panier', JSON.stringify(produits));
}

// Fonction qui récupère tous les élements du formulaire et passe les étapes de vérifications
function verifierChamp(champ) {
  if (champ.value === "") {
    document.getElementById(`${champ.id}ErrorMsg`).innerHTML = `Veuillez entrer votre ${champ.id}.`;
    return false;
  } else if (!champ.regex.test(champ.value)) {
    document.getElementById(`${champ.id}ErrorMsg`).innerHTML = champ.errorMessage;
    return false;
  } else {
    document.getElementById(`${champ.id}ErrorMsg`).innerHTML = "";
    return true;
  }
}
// La fonction "verifierForm" est utilisée pour valider le formulaire en vérifiant si tous les champs 
// sont remplis correctement en appelant la fonction "verifierChamp" pour chaque champ.
function verifierForm() {
  let champs = [
    {
      id: "firstName",
      value: document.getElementById("firstName").value,
      regex: /^([^0-9]*)$/,
      errorMessage: "Veuillez entrer un prénom valide."
    },
    {
      id: "lastName",
      value: document.getElementById("lastName").value,
      regex: /[a-zA-Z]/,
      errorMessage: "Veuillez entrer un nom valide."
    },
    {
      id: "address",
      value: document.getElementById("address").value,
      regex: /^[a-zA-Z0-9\s,'-]*$/,
      errorMessage: "Veuillez entrer une adresse valide."
    },
    {
      id: "city",
      value: document.getElementById("city").value,
      regex: /[a-zA-Z]/,
      errorMessage: "Veuillez entrer une ville valide."
    },
    {
      id: "email",
      value: document.getElementById("email").value,
      regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      errorMessage: "Veuillez entrer un email valide."
    }
  ];
  for (let champ of champs) {
    if (!verifierChamp(champ)) {
      return false;
    }
  }
  return true
}

// La fonction "creerCommande" récupère les informations du client dans le formulaire
// et les envoie au serveur pour créer une commande.
async function creerCommande() {
  if (verifierForm() === false) {
    return
  }

  let contact = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  }

  let detailsPanier = {
    products: tableaupanier.map(product => (product.id)), contact
  };

  try {
    const response = await fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      body: JSON.stringify(detailsPanier),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    location.href = `confirmation.html?orderId=${data.orderId}`;
    if (localStorage) {
      localStorage.clear();
    }
  } catch (error) {
    console.error(error);
  }
}

let boutonCommander = document.getElementById('order');

boutonCommander.addEventListener('click', (event) => {
  event.preventDefault();
  creerCommande();
});

