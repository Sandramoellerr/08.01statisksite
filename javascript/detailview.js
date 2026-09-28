"use strict";

// Læser beskeden efter "?" i adressen (fx ?seasons=Summer)
// window.location = adressen vi er på, .search = delen efter "?"
const param = new URLSearchParams(window.location.search);

// Henter sæsonen fra adressen
const selectedId = param.get("id");
console.log("selectedId", selectedId);

const detailURL = `https://kea-alt-del.dk/t7/api/products/${selectedId}`;
console.log("detailURL", detailURL);

const product_detail = document.querySelector(".product_detail");

function loadData(url) {
  fetch(url).then((response) => {
    // Laver svaret om fra JSON til et array
    response.json().then((data) => {
      showDetails(data);
    });
  });
}

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

  document.querySelector(".card_img").src = `https://kea-alt-del.dk/t7/images/webp/640/${detail.id}.webp`;
}

loadData(detailURL);
