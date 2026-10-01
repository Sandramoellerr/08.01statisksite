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
//
// NYT: UDSALGSPRIS
// ? : = en kort if/else: "betingelse ? hvis ja : hvis nej"
// detail.discount ? ... : "" → har produktet rabat, vises udsalgsprisen, ellers ingenting
// Den normale pris vises altid, og har produktet rabat, står rabat-% efter, fx "1595 kr -28%"
function showDetails(detail) {
  console.log("detail", detail);

  product_detail.innerHTML += `<article class="product">
                <img class="card_img" src="https://kea-alt-del.dk/t7/images/webp/640/${detail.id}.webp"
                    alt="${detail.productdisplayname}" />

                <div class="card_body">
                    <div class="card_indhold">
                        <h3 class="produkt_titel">${detail.productdisplayname}</h3>
                        <p class="produkt_brand">${detail.brandname} - ${detail.articletype}</p>
                        ${detail.discount ? "<p class='produkt_pris'>" + getDiscountPrice(detail.price, detail.discount) + " kr</p>" : ""}
                        <p class="produkt_pris">${detail.price} kr ${detail.discount ? " <em>-" + detail.discount + "%</em>" : ""}</p>

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

// NYT: REGN PRISEN EFTER RABAT
// Samme funktion som i list.js. Den skal stå her også,
// fordi product.html kun indlæser detailview.js og ikke list.js
// return = sender resultatet tilbage til der, hvor funktionen blev kaldt
// Math.round = runder af til et helt tal
// Eksempel: 1595 kr og 28 % rabat
//   100 - 28 = 72
//   1595 * 72 = 114840
//   114840 / 100 = 1148,4 → 1148 kr
function getDiscountPrice(origianlPrice, discount) {
  return Math.round((origianlPrice * (100 - discount)) / 100);
}

/*
==========================================================
  DETAILVIEW.JS: FRA STATISK TIL DYNAMISK, 7 TRIN
  product.html?id=1556 → detailview.js → API: /api/products/1556
==========================================================

STATISK  = jeg har selv skrevet alt indholdet i HTML'en
DYNAMISK = JavaScript henter indholdet fra et API og skriver HTML'en for mig

----------------------------------------------------------
TRIN 1: BYG SIDEN STATISK FØRST
----------------------------------------------------------
Jeg skrev ét produkt i product.html og stylede det med CSS.
Det er min SKABELON, altså det JavaScript skal udfylde.

  <article class="product">
      <img class="card_img" src="img/Skærmbillede 2026-09-21 kl. 20.10.31.png" alt="Tuva top i koral, set forfra" />
      <div class="card_body">
          <div class="card_indhold">
              <h3 class="produkt_titel">Tuva top, Women - koral</h3>
              <p class="produkt_brand">FashionRus - Top</p>
              <p class="produkt_pris">148 kr</p>
              <div class="farve_info">
                  <p>Farve: Rust red</p>
              </div>
              <h3 class="produkt_stoerrelser">xs, s, m, l, xl</h3>
          </div>
          <a class="card_btn" href="product.html">Læg i kurv</a>
      </div>
  </article>

----------------------------------------------------------
TRIN 2: LAV EN JS-FIL OG FORBIND DEN
----------------------------------------------------------
I <head> i product.html:
  <script src="javascript/detailview.js" defer></script>
defer = JS venter, til HTML'en er læst (ellers finder querySelector intet)

----------------------------------------------------------
TRIN 3: TOM KASSE I HTML'EN + UDKOMMENTÉR KORTET
----------------------------------------------------------
I product.html:
  <div class="product_detail">
      <!-- gammelt kort, udkommenteret -->
  </div>
Kassen (div'en) skal BLIVE. Kun kortet indeni udkommenteres.

I detailview.js finder jeg kassen:
  const product_detail = document.querySelector(".product_detail");
product_detail = et navn jeg selv har valgt, det findes kun i JS

----------------------------------------------------------
TRIN 4: FIND API-ADRESSEN
----------------------------------------------------------
  const detailURL = `https://kea-alt-del.dk/t7/api/products/${selectedId}`;

${selectedId} = id'et fra adressen (se trin 7)

Svaret starter med { → ÉT produkt → INGEN forEach, men detail.feltnavn
Felter jeg bruger: id, productdisplayname, brandname, articletype,
price, discount, basecolour

----------------------------------------------------------
TRIN 5: HENT DATA (motoren)
----------------------------------------------------------
  function loadData(url) {
    fetch(url).then((response) => {           // spørg API'et
      response.json().then((data) => {        // pak svaret ud
        showDetails(data);                    // send det videre
      });
    });
  }

  loadData(detailURL);                        // start det hele

----------------------------------------------------------
TRIN 6: KOPIÉR KORTET IND I JS OG SÆT DATA IND
----------------------------------------------------------
Ét produkt → ingen forEach, jeg skriver direkte detail.feltnavn

  function showDetails(detail) {
    product_detail.innerHTML += `<article class="product">
        <img class="card_img" src="https://kea-alt-del.dk/t7/images/webp/640/${detail.id}.webp"
            alt="${detail.productdisplayname}" />
        <div class="card_body">
            <div class="card_indhold">
                <h3 class="produkt_titel">${detail.productdisplayname}</h3>
                <p class="produkt_brand">${detail.brandname} - ${detail.articletype}</p>
                ${detail.discount ? "<p class='produkt_pris'>" + getDiscountPrice(detail.price, detail.discount) + " kr</p>" : ""}
                <p class="produkt_pris">${detail.price} kr ${detail.discount ? " <em>-" + detail.discount + "%</em>" : ""}</p>
                <div class="farve_info">
                    <p>Farve: ${detail.basecolour}</p>
                </div>
                <h3 class="produkt_stoerrelser">xs, s, m, l, xl</h3>
            </div>
            <a class="card_btn" href="product.html">Læg i kurv</a>
        </div>
    </article>`;                              // husk ` til sidst

    // sætter billedet på .card_img (billedet i kortet, ikke logoet)
    document.querySelector(".card_img").src = `https://kea-alt-del.dk/t7/images/webp/640/${detail.id}.webp`;
  }

  Statisk (før)                →  Dynamisk (efter)
  Tuva top, Women - koral      →  ${detail.productdisplayname}
  FashionRus - Top             →  ${detail.brandname} - ${detail.articletype}
  148 kr                       →  ${detail.price} kr
  (ingen udsalgspris)          →  ${detail.discount ? ... getDiscountPrice(...) ... : ""}
  Farve: Rust red              →  Farve: ${detail.basecolour}
  img/Skærmbillede....png      →  https://kea-alt-del.dk/t7/images/webp/640/${detail.id}.webp

? : = kort if/else: "betingelse ? hvis ja : hvis nej"
  ${detail.discount ? ... : ""}  → rabat? så vis udsalgspris og rabat-%, ellers intet

Prisen efter rabat (samme funktion som i list.js, den skal stå i begge filer):
  function getDiscountPrice(origianlPrice, discount) {
    return Math.round((origianlPrice * (100 - discount)) / 100);
  }
  fx 1595 kr og 28 %: 100 - 28 = 72 → 1595 * 72 = 114840 → / 100 = 1148 kr

Klasserne er de samme som i HTML'en, så CSS'en virker stadig.
${ } virker KUN i backticks ` `, ikke i " ".

----------------------------------------------------------
TRIN 7: FORBIND SIDERNE MED URL-PARAMETRE
----------------------------------------------------------
detailview.js læser parameteren fra produktlisten:
  const param = new URLSearchParams(window.location.search);
  const selectedId = param.get("id");             // → "1556"
Linket i list.js er: product.html?id=${product.id}

Ordet i linket og ordet i param.get("...") skal være stavet PRÆCIS ens.
  ?id=  ↔  param.get("id")

----------------------------------------------------------
HVIS SIDEN ER TOM
----------------------------------------------------------
1. Rød fejl i konsollen?           → læs den
2. selectedId er null?             → siden er åbnet uden ?id= i adressen
3. product_detail er null?         → klassen er stavet forkert, eller div'en er udkommenteret
4. Billedet havner i logoet?       → brug querySelector(".card_img"), ikke querySelector("img")
5. getDiscountPrice is not defined? → funktionen mangler nederst i detailview.js
6. Mangler defer på <script>?
7. Mangler ` til sidst i kortet?
8. Viser browseren en gammel fil?  → Cmd + Shift + R
==========================================================
*/
