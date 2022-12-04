var lienproduit = new URL(window.location.href);

var id = lienproduit.searchParams.get("id");

var imgkanap = document.querySelector(".item__img");

var nom = document.querySelector("#title");

var prix = document.querySelector("#price");

var description = document.querySelector("#description");

var couleur = document.querySelector("#color");

const produitid = "http://localhost:3000/api/products/" + id;
fetch(produitid)
  .then(function (response) {
    if (response.ok) { return response.json(); }
  })
  .then(function (article) {
    infosproduit(article);
  })
  .catch((error) => alert("message" + error));

function infosproduit(article) {
  let image = document.createElement("img");
  imgkanap.appendChild(image);
  image.src = article.imageUrl;
  image.alt = article.altTxt;
  nom.innerHTML = article.name;
  prix.innerHTML = article.price;
  description.innerHTML = article.description;
  for (let color = 0; color < article.colors.length; color++) {
    couleur.innerHTML = `<option value="${article.colors[color]}">${article.colors[color]}</option>`;
  }
}