"use strict";

// Læser beskeden efter "?" i adressen (fx ?season=Summer)
// window.location = adressen vi er på, .search = delen efter "?"
const param = new URLSearchParams(window.location.search);

// Henter sæsonen fra adressen
const selectedseason = param.get("season");
console.log("selectedseason", selectedseason);
// API-adressen, henter produkter fra den valgte sæson
const productURL = `https://kea-alt-del.dk/t7/api/products?season=${selectedseason}`;

// Kassen i HTML'en, hvor kortene skal stå
const listContainer = document.querySelector(".product_list_container");

// Henter data fra API'et og sender det videre til showProducts
function getData(url) {
  fetch(url).then((response) => {
    // Laver svaret om fra JSON til et array
    response.json().then((data) => {
      showProducts(data);
    });
  });
}

// Viser alle produkterne på siden
function showProducts(products) {
  // Til fejlfinding i konsollen
  console.log("First product", products[0]);
  console.log("Number of products", products.length);

  // Tømmer kassen først
  listContainer.innerHTML = "";

  // Laver et kort for hvert produkt
  products.forEach((product) => {
    // ${} indsætter data. ? : betyder "hvis ja : hvis nej"
    // Udsolgt: får klassen "soldout" og et "UDSOLGT"-mærke
    // Rabat: viser ny pris og rabatprocent
    listContainer.innerHTML += `<article class="product ${product.soldout ? "soldout" : ""}">
      <img src="https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp" alt="${product.productdisplayname}" />
      <h3>${product.productdisplayname}</h3>
      <p>${product.brandname} - ${product.category}</p>
      <div>
        ${product.discount ? "<p>" + getDiscountPrice(product.price, product.discount) + " kr</p>" : ""}
        <p>${product.price} kr ${product.discount ? " <em>-" + product.discount + "%</em>" : ""}</p>
      
      </div>
      
      
      ${product.soldout ? "<p class='soldout_tag'>UDSOLGT</p>" : ""}
      <a class="card_btn" href="product.html?id=${product.id}">Shop nu</a>
    </article>`;
  });
}

// Starter det hele
getData(productURL);

// Regner prisen efter rabat (fx 500 kr - 20% = 400 kr)
function getDiscountPrice(origianlPrice, discount) {
  return Math.round((origianlPrice * (100 - discount)) / 100);
}
