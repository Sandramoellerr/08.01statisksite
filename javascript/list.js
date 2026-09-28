"use strict";
// "use strict" = JavaScript melder fejl i stedet for at ignorere dem

// TRIN 1: LÆS SÆSONEN FRA ADRESSEN
// Adressen er fx productlist.html?season=Summer
// window.location.search = delen efter "?", altså "?season=Summer"
// URLSearchParams = gør den del læsbar for JavaScript
const param = new URLSearchParams(window.location.search);

// param.get("season") = henter værdien efter "season=", fx "Summer"
// Ordet skal være det samme som i linket på forsiden (?season=)
// Står der intet ?season= i adressen, bliver den null
const selectedseason = param.get("season");
console.log("selectedseason", selectedseason);

// TRIN 2: BYG API-ADRESSEN
// ${selectedseason} sætter sæsonen ind i adressen (virker kun i backticks ` `)
// Resultat fx: https://kea-alt-del.dk/t7/api/products?season=Summer
const productURL = `https://kea-alt-del.dk/t7/api/products?season=${selectedseason}`;

// TRIN 3: FIND KASSEN I HTML'EN
// Finder <div class="product_list_container"> i HTML'en
// listContainer = et navn jeg selv har valgt, det findes kun i JS
const listContainer = document.querySelector(".product_list_container");

// TRIN 4: HENT DATA FRA API'ET
// fetch(url) = spørg API'et efter produkterne
// .then = vent på svaret, og gør så det næste
// response.json() = pak svaret ud, så det bliver et array (en liste med produkter)
// showProducts(data) = send listen videre, så den kan vises
function getData(url) {
  fetch(url).then((response) => {
    response.json().then((data) => {
      showProducts(data);
    });
  });
}

// TRIN 5: VIS PRODUKTERNE PÅ SIDEN
// products = listen (arrayet) med alle produkter fra API'et
function showProducts(products) {
  // products[0] = det første produkt i listen (man tæller fra 0)
  // products.length = hvor mange produkter der er i listen
  console.log("First product", products[0]);
  console.log("Number of products", products.length);

  // Tømmer kassen, så der ikke ligger noget gammelt i den
  listContainer.innerHTML = "";

  // forEach = gør det samme for hvert produkt i listen, et ad gangen
  // product = det produkt, vi er ved lige nu
  products.forEach((product) => {
    // += = læg et nyt kort oven i dem, der allerede står der
    // ${product.feltnavn} = sæt data fra produktet ind i HTML'en
    // ? : = en kort if/else: "betingelse ? hvis ja : hvis nej"
    //   product.soldout ? "soldout" : "" → er den udsolgt, får den klassen "soldout", ellers ingenting
    //   product.discount ? ... : "" → har den rabat, vises ny pris og rabat-%, ellers ingenting
    // Linket får produktets id med (?id=1556), så produktsiden ved hvilket produkt den skal vise
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

// TRIN 6: START DET HELE
// En funktion gør ingenting, før den bliver kaldt
// Kæden: getData → fetch → json → showProducts → produkterne står på siden
getData(productURL);

// EKSTRA: REGN PRISEN EFTER RABAT
// return = sender resultatet tilbage til der, hvor funktionen blev kaldt
// Math.round = runder af til et helt tal
// Eksempel: 500 kr og 20 % rabat
//   100 - 20 = 80
//   500 * 80 = 40000
//   40000 / 100 = 400 kr
function getDiscountPrice(origianlPrice, discount) {
  return Math.round((origianlPrice * (100 - discount)) / 100);
}
