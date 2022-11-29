// const api="http://localhost:3000/api/products";
// let afficherproduit=function(){
//     fetch("http://localhost:3000/api/products")
//       .then((response)=>response.json)
//       .then((data)=>{
//         const sectionproduit=document.getElementById("items");
//         for(let produits=0;produits<data.length;produits++) {
//             const infoproduit=`
//             <a href="./product.html?id=${data[produits]._id}">
//             <article>
//               <img src="${data[produits].imageUrl}" alt="${data[produits].altTxt}, ${data[produits].name}">
//               <h3 class="productName">${data[produits].name}</h3>
//               <p class="productDescription">${data[produits].description}</p>
//             </article>
//           </a>`;
//           sectionproduit.innerHTML +=infoproduit;
//         }
//       })
//       .catch((error)=>alert("message"+ error));
// };
// afficherproduit();
fetch("http://localhost:3000/api/products")
  .then(function(response){
    if (response.ok){return response.json;}
  })
  .then(function(article){
    afficherproduits(article);
  })
  .catch((error)=>alert("message"+ error));

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
