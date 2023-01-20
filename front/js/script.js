// Faire appel à L'API pour affaicher les produits sur la page d'acceuil
fetch("http://localhost:3000/api/products")
  .then(function(response){
    if (response.ok){return response.json();}
  })
  .then(function(article){
    afficherproduits(article);
  })
  .catch((error)=>alert("message"+ error));

  // Afficher la page d'un produit avec les éléments, image, description

  function afficherproduits(article){
    for(let produit=0;produit<article.length;produit++){
      let lien=document.createElement("a");
      document.querySelector(".items").appendChild(lien);
      lien.href="./product.html?id="+article[produit]._id;

      let elementarticle=document.createElement("article");
      lien.appendChild(elementarticle);

      let image=document.createElement("img");
      elementarticle.appendChild(image);
      image.src=article[produit].imageUrl;
      image.alt=article[produit].altTxt;
      
      let titre=document.createElement("h3");
      elementarticle.appendChild(titre);
      titre.classList.add("productName");
      titre.innerHTML=article[produit].name;

      let description=document.createElement("p");
      elementarticle.appendChild(description);
      description.classList.add("productDescription");
      description.innerHTML=article[produit].description;
    }
  }
