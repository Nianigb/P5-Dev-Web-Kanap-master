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

  let addQuantite = document.querySelectorAll('.itemQuantity'); // Cible l'élément ainsi que ca valeur
  for (let add of addQuantite) {
    add.addEventListener('click', () => {
      let article = add.closest("article");
      let dataId = article.getAttribute('data-id');
      let dataCouleur = article.getAttribute('data-color');
      for (let local of tableaupanier) {
        if ((local.id === dataId) && (local.couleur === dataCouleur)) {
          let newQuantite = parseInt(add.value);
          local.quantite = newQuantite;
          break;
        }
      }
      localStorage.setItem("panier", JSON.stringify(tableaupanier));
      window.location.reload();
    })

  }

  document.getElementById("totalPrice").innerHTML = prix;


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
}
