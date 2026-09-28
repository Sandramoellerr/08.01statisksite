"use strict";
// "use strict" = JavaScript melder fejl i stedet for at ignorere dem

// TRIN 1: LÆS ID'ET FRA ADRESSEN
// Adressen er fx product.html?id=1556
// window.location.search = delen efter "?", altså "?id=1556"
// URLSearchParams = gør den del læsbar for JavaScript
const param = new URLSearchParams(window.location.search);

// param.get("id") = henter værdien efter "id=", fx "1556"
// Står der intet ?id= i adressen, bliver den null
const selectedId = param.get("id");
console.log("selectedId", selectedId);

// TRIN 2: BYG API-ADRESSEN
// ${selectedId} sætter id'et ind i adressen (virker kun i backticks ` `)
// Resultat fx: https://kea-alt-del.dk/t7/api/products/1556
const detailURL = `https://kea-alt-del.dk/t7/api/products/${selectedId}`;
console.log("detailURL", detailURL);

// TRIN 3: FIND KASSEN I HTML'EN
// Finder <div class="product_detail"> i HTML'en
// product_detail = et navn jeg selv har valgt, det findes kun i JS
const product_detail = document.querySelector(".product_detail");

// TRIN 4: HENT DATA FRA API'ET
// fetch(url) = spørg API'et efter produktet
// .then = vent på svaret, og gør så det næste
// response.json() = pak svaret ud, så det bliver et JS-objekt
// showDetails(data) = send produktet videre, så det kan vises
function loadData(url) {
  fetch(url).then((response) => {
    response.json().then((data) => {
      showDetails(data);
    });
  });
}

// TRIN 5: VIS PRODUKTET PÅ SIDEN
// detail = produktet fra API'et, fx { id: 1556, productdisplayname: "...", price: 895 }
// innerHTML = HTML'en inde i kassen
// += = læg ny HTML til det, der allerede står der
// ${detail.feltnavn} = sæt data fra produktet ind i HTML'en
function showDetails(detail) {
  console.log("detail", detail);

  product_detail.innerHTML += `<article class="product">
                <img class="card_img" src="https://kea-alt-del.dk/t7/images/webp/640/${detail.id}.webp"
                    alt="${detail.productdisplayname}" />

                <div class="card_body">
                    <div class="card_indhold">
                        <h3 class="produkt_titel">${detail.productdisplayname}</h3>
                        <p class="produkt_brand">${detail.brandname} - ${detail.articletype}</p>
                        <p class="produkt_pris">${detail.price} kr</p>

                        <span class="streg"></span>

                        <div class="farve_info">
                            <p>Farve: ${detail.basecolour}</p>
                        </div>

                        <span class="streg streg_product"></span>

                        <h3 class="produkt_stoerrelser">xs, s, m, l, xl</h3>
                    </div>

                    <a class="card_btn" href="product.html">Læg i kurv</a>
                </div>
            </article>`;

  // Sætter produktbilledet på .card_img (billedet inde i kortet, ikke logoet)
  document.querySelector(".card_img").src = `https://kea-alt-del.dk/t7/images/webp/640/${detail.id}.webp`;
}

// TRIN 6: START DET HELE
// En funktion gør ingenting, før den bliver kaldt
// Kæden: loadData → fetch → json → showDetails → produktet står på siden
loadData(detailURL);
