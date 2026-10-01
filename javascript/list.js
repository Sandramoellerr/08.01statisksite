"use strict";
// "use strict" = JavaScript melder fejl i stedet for at ignorere dem

// allData = alle produkter, vi har hentet. Den skal stå her øverst,
// så både getData og btnKlik kan bruge den
let allData;

// TRIN 1: LÆS SÆSONEN FRA ADRESSEN
// Adressen er fx productlist.html?season=Summer
// Står der intet ?season= i adressen, bliver den null
const param = new URLSearchParams(window.location.search);
const selectedseason = param.get("season");
console.log("selectedseason", selectedseason);

// TRIN 2: BYG API-ADRESSEN
// Er der en sæson i adressen, henter vi kun den sæson
// Er der ingen (null), henter vi alle produkter, så siden aldrig er tom
// &limit=100 = hent op til 100 produkter (ellers kun 10)
let productURL;
if (selectedseason) {
  productURL = `https://kea-alt-del.dk/t7/api/products?season=${selectedseason}&limit=100`;
} else {
  productURL = `https://kea-alt-del.dk/t7/api/products?limit=100`;
}

// TRIN 3: FIND KASSEN I HTML'EN
const listContainer = document.querySelector(".product_list_container");

// TRIN 4: HENT DATA FRA API'ET
function getData(url) {
  fetch(url).then((response) => {
    response.json().then((data) => {
      allData = data;
      showProducts(data);
    });
  });
}

// TRIN 5: VIS PRODUKTERNE PÅ SIDEN
function showProducts(products) {
  console.log("First product", products[0]);
  console.log("Number of products", products.length);

  // Tømmer kassen, så der ikke ligger noget gammelt i den
  listContainer.innerHTML = "";

  products.forEach((product) => {
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

// EKSTRA: REGN PRISEN EFTER RABAT
// fx 500 kr og 20 %: 100 - 20 = 80 → 500 * 80 = 40000 → 40000 / 100 = 400 kr
function getDiscountPrice(origianlPrice, discount) {
  return Math.round((origianlPrice * (100 - discount)) / 100);
}

/*-----------------------------------------------------------
FILTRERING MED KNAPPERNE
-----------------------------------------------------------*/

// Giv hver knap en klik-lytter. btnKlik står UDEN (), så den først kører ved klik
document.querySelectorAll(".btn_container button").forEach((btn) => {
  btn.addEventListener("click", btnKlik);
});

function btnKlik(evt) {
  // evt.target = den knap, du klikkede på
  // .dataset.filter = det, der står i knappens data-filter, fx "Winter"
  console.log("Knap der er klikket på:", evt.target.dataset.filter);
  console.log("Alle produkter:", allData);

  // Fjern den blå farve fra alle knapper, og giv den kun til den, der blev klikket på
  document.querySelectorAll(".btn_container button").forEach((btn) => {
    btn.classList.remove("active_btn");
  });
  evt.target.classList.add("active_btn");
  const filterArr = allData.filter((product) => product.category === evt.target.dataset.filter);
  console.log("FILTER", filterArr);
  showProducts(filterArr);
  // Hent den valgte sæson fra API'et og vis den
  //getData(`https://kea-alt-del.dk/t7/api/products?season=${evt.target.dataset.filter}&limit=100`);
}

// TRIN 6: START DET HELE
getData(productURL);
/*
==========================================================
  LIST.JS: FRA STATISK TIL DYNAMISK, 7 TRIN
  productlist.html?season=Summer → list.js → API: /api/products?season=Summer
==========================================================

STATISK  = jeg har selv skrevet alt indholdet i HTML'en
DYNAMISK = JavaScript henter indholdet fra et API og skriver HTML'en for mig

----------------------------------------------------------
TRIN 1: BYG SIDEN STATISK FØRST
----------------------------------------------------------
Jeg skrev ét kort i productlist.html og stylede det med CSS.
Det kort er min SKABELON, altså det JavaScript skal gentage.

  <article class="product discount soldout">
      <img src="img/Skærmbillede 2026-09-21 kl. 20.10.31.png" alt="Placeholder" />
      <h3>Tuva top, Women - koral</h3>
      <p>FashionRus - Top</p>
      <div>
          <p class="førpris">200 kr</p>
          <p class="efterpris">100 kr - 50%</p>
      </div>
      <p class="soldout_tag">UDSOLGT</p>
      <a class="card_btn" href="product.html">Shop nu</a>
  </article>

----------------------------------------------------------
TRIN 2: LAV EN JS-FIL OG FORBIND DEN
----------------------------------------------------------
I <head> i productlist.html:
  <script src="javascript/list.js" defer></script>
defer = JS venter, til HTML'en er læst (ellers finder querySelector intet)

----------------------------------------------------------
TRIN 3: TOM KASSE I HTML'EN + UDKOMMENTÉR KORTENE
----------------------------------------------------------
I productlist.html:
  <div class="product_list_container">
      <!-- gamle kort, udkommenteret -->
  </div>
Kassen (div'en) skal BLIVE. Kun kortene indeni udkommenteres.

I list.js finder jeg kassen:
  const listContainer = document.querySelector(".product_list_container");
listContainer = et navn jeg selv har valgt, det findes kun i JS

----------------------------------------------------------
TRIN 4: FIND API-ADRESSEN
----------------------------------------------------------
  const productURL = `https://kea-alt-del.dk/t7/api/products?season=${selectedSeason}&limit=100`;

${selectedSeason} = sæsonen fra adressen (se trin 7)
&limit=100        = hent op til 100 produkter (ellers kun 10)

Svaret starter med [ → en LISTE → brug forEach
Felter jeg bruger: id, productdisplayname, brandname, category,
price, discount, soldout

----------------------------------------------------------
TRIN 5: HENT DATA (motoren)
----------------------------------------------------------
  getData(productURL);                        // start det hele

  function getData(url) {
    fetch(url).then((response) => {           // spørg API'et
      response.json().then((data) => {        // pak svaret ud
        showProducts(data);                   // send det videre
      });
    });
  }

----------------------------------------------------------
TRIN 6: KOPIÉR KORTET IND I JS OG SÆT DATA IND
----------------------------------------------------------
  function showProducts(products) {
    listContainer.innerHTML = "";             // tøm kassen

    products.forEach((product) => {           // for hvert produkt
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
      </article>`;                            // husk ` til sidst
    });
  }

  Statisk (før)                →  Dynamisk (efter)
  Tuva top, Women - koral      →  ${product.productdisplayname}
  FashionRus - Top             →  ${product.brandname} - ${product.category}
  200 kr                       →  ${product.price} kr
  img/Skærmbillede....png      →  https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp
  href="product.html"          →  href="product.html?id=${product.id}"

? : = kort if/else: "betingelse ? hvis ja : hvis nej"
  ${product.soldout ? "soldout" : ""}   → udsolgt? så klassen "soldout", ellers intet
  ${product.discount ? ... : ""}        → rabat? så vis ny pris og rabat-%, ellers intet

Prisen efter rabat:
  function getDiscountPrice(origianlPrice, discount) {
    return Math.round((origianlPrice * (100 - discount)) / 100);
  }
  fx 500 kr og 20 %: 100 - 20 = 80 → 500 * 80 = 40000 → 40000 / 100 = 400 kr

Klasserne er de samme som i HTML'en, så CSS'en virker stadig.
${ } virker KUN i backticks ` `, ikke i " ".

----------------------------------------------------------
TRIN 7: FORBIND SIDERNE MED URL-PARAMETRE
----------------------------------------------------------
list.js læser parameteren fra forsiden:
  const param = new URLSearchParams(window.location.search);
  const selectedSeason = param.get("season");     // → "Summer"
Linket på forsiden er: productlist.html?season=Summer

list.js er også siden FØR produktsiden, så den laver et nyt link:
  href="product.html?id=${product.id}"
  → fx product.html?id=1556

Ordet i linket og ordet i param.get("...") skal være stavet PRÆCIS ens.
  ?season=  ↔  param.get("season")

----------------------------------------------------------
HVIS SIDEN ER TOM
----------------------------------------------------------
1. Rød fejl i konsollen?           → læs den
2. selectedSeason er null?         → ordet i linket ≠ ordet i param.get()
3. Number of products er 0?        → sæsonen er stavet forkert i adressen
4. listContainer er null?          → klassen er stavet forkert, eller div'en er udkommenteret
5. Mangler defer på <script>?
6. Mangler ` til sidst i kortet?
7. Viser browseren en gammel fil?  → Cmd + Shift + R
==========================================================
*/

/******querySelectorAll vælger alle inde i html
 ******* querySelector vælger det første inde i html******/

/*******
 * querySelectorAll laver automatisk et array
 * array og nodeclass er det samme, array er bare js og nodeclass er i html
 */

/* NY NOTE: Lille rettelse til noten ovenover.
 * querySelectorAll giver en NodeList, ikke et rigtigt array.
 * En NodeList ligner et array, og man kan bruge forEach på den.
 * Men man kan IKKE bruge filter eller map på en NodeList.
 * Begge dele er JavaScript. NodeList er bare en liste af HTML-elementer.
 */

/* NY NOTE: "use strict" gør JavaScript mere streng.
 * Den giver en fejl, hvis man f.eks. bruger en variabel uden at lave den med let eller const.
 * Så finder man fejl hurtigere.
 */

/* NY NOTE: const = værdien skal ikke ændres.
 * carList er det element på siden, hvor bilerne bliver vist.
 * productUrl er stien til filen med bil-data.
 */

// code here
/* NY NOTE: cars er det array, som showCars får med.
 * Det kan være alle biler (allData) eller de filtrerede (filterlArr).
 * Funktionen er ligeglad. Den viser bare det, den får.
 */
