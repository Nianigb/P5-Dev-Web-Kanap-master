// Récupération du panier stocker dans le local storage
let panier = localStorage.getItem('panier');
let tableaupanier = [];
if (panier) {
  tableaupanier = JSON.parse(panier);
  infosproduit();
}

let prix = 0;
document.getElementById("totalPrice").innerHTML = prix;

async function idproduit(id) {
  return new Promise((bonnevaleur, mauvaisevaleur) => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then((response) => response.json())
      .then((valeur) => {
        bonnevaleur(valeur)
      })
      .catch((error) => mauvaisevaleur("message" + error));
  })
}

async function infosproduit() {
  let produit = "";
  for (let indice of tableaupanier) {
    const idproduitpanier = await idproduit(indice.id);
    produit = produit + `
    <article class="cart__item" data-id="${indice.id}" data-color="${indice.couleur}">
    <div class="cart__item__img">
      <img src="${idproduitpanier.imageUrl}" alt="${idproduitpanier.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${idproduitpanier.name}</h2>
        <p> Couleur : ${indice.couleur}</p>
        <p> Prix : ${idproduitpanier.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p> Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${indice.quantite}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
    </article>
    `;
    const cart__items = document.querySelector("#cart__items");
    cart__items.innerHTML = produit;

    modifyQuantity();
    quantite = totalQuantity();
    // Mettre à jour la quantité totale sur la page
    document.getElementById("totalQuantity").innerHTML = quantite;
    // Calculez le prix total de tous les produits du panier
    prix = prix + (indice.quantite * idproduitpanier.price);
    // Mettre à jour le prix total sur la page
    document.getElementById("totalPrice").innerHTML = prix;
  }

  // Fonction qui renvoie la quantité totale de tous les produits du panier
  function totalQuantity() {
    // Si le panier n'est pas vide, retournez la quantité totale de tous les produits.
    if (tableaupanier) {
      return tableaupanier.map(product => product.quantite).reduce((total, quantite) => total += quantite);
    }
    // Si le panier est vide, retournez 0
    else {
      return 0;
    }
  }

  function modifyQuantity() {
    // Fonction ajouter ou retirer un article du panier en cours
    var modifyQuantity = document.querySelectorAll(".itemQuantity");

    modifyQuantity.forEach((modify) => {
      modify.addEventListener('change', (e) => {
        let ciblearticle = modify.closest("article");
        let recupid = ciblearticle.getAttribute("data-id");
        let recupcouleur = ciblearticle.getAttribute("data-color");
        let newquantity = parseInt(e.target.value);
        let searchproduct = tableaupanier.find(a => a.id == recupid && a.couleur == recupcouleur);
        // Nouvelle quantité de l'article
        searchproduct.quantite = newquantity;
        if (searchproduct.quantite > 0 && searchproduct.quantite <= 100) {
          // Mise à jour du panier
          savePanier(tableaupanier);
          location.reload();
          // tableaupanier = tableaupanier.filter(a => a.id != recupid || a.couleur != recupcouleur);
        }

      }
      )
    })
  }

  // Fonction qui va retirer un produit du panier en cours
  var deleteItem = document.querySelectorAll(".deleteItem");

  deleteItem.forEach((supprimer) => {
    supprimer.addEventListener('click', () => {
      let ciblearticle = supprimer.closest("article");
      let recupid = ciblearticle.getAttribute("data-id");
      let recupcouleur = ciblearticle.getAttribute("data-color");
      //Retrait de l'article dans la liste précédente
      let autresproduits = tableaupanier.filter((a) => !(a.id == recupid && a.couleur == recupcouleur));
      // Mise à jour du panier
      savePanier(autresproduits);
      location.reload();
    })
  })
}

// Fonction pour sauvegarder le panier
function savePanier(produits) {
  // Mise à jour du panier dans localstorage
  localStorage.setItem('panier', JSON.stringify(produits));
}

// Formulaire client
const commander = document.getElementById("order");
// Variables récupérées pour le formulaire :
const prenom = document.getElementById("firstName");
const nom = document.getElementById("lastName");
const adresse = document.getElementById("address");
const ville = document.getElementById("city");
const mail = document.getElementById("email");

// Etapes du formulaire de commande
// Première vérification
let firstname = false;
prenom.addEventListener('change', (e) => {
  // Vérification du prénom
  firstname = firstNameValid(prenom.value);
  const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
  if (firstname == false) {
    firstNameErrorMsg.innerHTML = "Vérifier le prénom";
  }
  else {
    firstNameErrorMsg.innerHTML = " ";
  }
})

//Deuxième vérification
let lastname = false;
nom.addEventListener('change', (e) => {
  // Vérification du nom
  lastname = lastNameValid(nom.value);
  const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
  if (lastname == false) {
    lastNameErrorMsg.innerHTML = "Vérifier le nom";
  }
  else {
    lastNameErrorMsg.innerHTML = " ";
  }
})

//Troisième vérification
let adress = false;
adresse.addEventListener('change', (e) => {
  // Vérification de l'adresse
  adress = adressValid(adresse.value);
  const adressErrorMsg = document.getElementById("addressErrorMsg");
  if (adress == false) {
    adressErrorMsg.innerHTML = "Vérifier l'adresse";
  }
  else {
    adressErrorMsg.innerHTML = " ";
  }
})

//Quatrième vérification
let city = false;
ville.addEventListener('change', (e) => {
  // Vérification de la ville
  city = cityValid(ville.value);
  const cityErrorMsg = document.getElementById("cityErrorMsg");
  if (city == false) {
    cityErrorMsg.innerHTML = "Vérifier la ville";
  }
  else {
    cityErrorMsg.innerHTML = " ";
  }
})

//Cinquième vérification
let email = false;
mail.addEventListener('change', (e) => {
  // Vérification de l'email
  email = emailValid(mail.value);
  const mailErrorMsg = document.getElementById("emailErrorMsg");
  if (email == false) {
    mailErrorMsg.innerHTML = "Vérifier l'email";
  }
  else {
    mailErrorMsg.innerHTML = " ";
  }
})


const regexName = /^[a-z][a-z '-.,]{1,31}$|^$/i;

// Test du first name
function firstNameValid(prenom) {
  if (regexName.test(prenom) == false) {
    return false;
  } else {
    return true;
  }
}

// Test du last name
function lastNameValid(nom) {
  if (regexName.test(nom) == false) {
    return false;
  } else {
    return true;
  }
}

// Test de l'adresse
function adressValid(adresse) {
  const regexAdress = /^([A-Za-z0-9]+( [A-Za-z0-9]+)+).*$/i;
  if (regexAdress.test(adresse) == false) {
    return false;
  } else {
    return true;
  }
}

// Test de la ville
function cityValid(ville) {
  if (regexName.test(ville) == false) {
    return false;
  } else {
    return true;
  }
}

// Test de l'email
function emailValid(mail) {
  const regexMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regexMail.test(mail) == false) {
    return false;
  } else {
    return true;
  }
}
// Au moment du clic pour commander,
// permet de retrouver le numéro de commande et de rediriger vers une page de confirmation
commander.addEventListener('click', () => {
  passerCommande();

})
async function passerCommande() {
  if (firstname && lastname && adress && city && email) {
    let contact = {
      firstName: document.querySelector("#firstName").value,
      lastName: document.querySelector("#lastName").value,
      address: document.querySelector("#address").value,
      city: document.querySelector("#city").value,
      email: document.querySelector("#email").value,
    };
    // Tableau qui contient les id du local storage
    let products = [];
    for (let eltpanier of tableaupanier) {
      products.push(eltpanier.id);
    }

    try {
      const response = await fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        body: JSON.stringify({products, contact}),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      location.href = `confirmation.html?orderId=${data.orderId}`;
      localStorage.clear();
    } catch (error) {
      console.error(error);
    }
  }


}