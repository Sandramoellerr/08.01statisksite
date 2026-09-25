"use strict";

/* productURL = adressen, hvor produkterne bor på internettet */
const productUrl = "https://kea-alt-del.dk/t7/api/products";

/* listContainer = find kassen i HTML, hvor kortene skal stå */
const listContainer = document.querySelector(".product_list_container");

/* GETDATA = opskriften, der henter dataen */
function getData(url) {
  fetch(url).then((response) => {
    response.json().then((data) => {
      console.log("data", data);
      showProducts(data);
    });
  });
}

/* SHOWPRODUCTS = opskriften, der viser produkterne på siden */
function showProducts(products) {
  console.log("First product", products[0]);
  console.log("Number of products", products.length);

  /* tøm kassen på siden, før vi fylder nye kort i */
  listContainer.innerHTML = "";

  products.forEach((product) => {
    /* += = læg et nyt kort oveni det, der allerede er på siden
    ${ } står MELLEM > og <, så teksten kommer frem på siden */

    /*${product.soldout ? "soldout" : ""}"
Det er en kort if/else på én linje
spørgsmål ? hvis ja : hvis nej
er produktet udsolgt? ja -> skriv "soldout", nej -> skriv ingenting "" */

    listContainer.innerHTML += `<article class="product ${product.soldout ? "soldout" : ""}">
      <img src="https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp" alt="${product.productdisplayname}" />
      <h3>${product.productdisplayname}</h3>
      <p>${product.brandname} - ${product.category}</p>
      <div>
        <p>${product.price} kr</p>
      </div>
      <a class="card_btn" href="product.html?id=${product.id}">Shop nu</a>
    </article>`;
  });
}

/* sig "GO!" */
getData(productUrl);
/* DE BETYDER DET SAMME DE TO NEDESTÅENDE 
 
 soldOutClass = en tom kasse til en class
    HVIS produktet er udsolgt, putter vi "soldout" i den
    // ellers forbliver den tom "" */
// let soldOutClass = "";
// if (product.soldout) {
//   soldOutClass = "soldout";
// }

/*${product.soldout ? "soldout" : ""}"
Det er en kort if/else på én linje
spørgsmål ? hvis ja : hvis nej
er produktet udsolgt? ja -> skriv "soldout", nej -> skriv ingenting "" */
