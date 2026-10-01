"use strict";
// "use strict" = JavaScript melder fejl i stedet for at ignorere dem

// console.log = skriv en besked i konsollen
// Bare for at tjekke, at filen bliver indlæst
console.log("hej");

// TRIN 1: API-ADRESSEN
// Her ligger listen over sæsoner på internettet
// Svaret er: [{season:"Fall"}, {season:"Spring"}, {season:"Summer"}, {season:"Winter"}]
const productUrl = "https://kea-alt-del.dk/t7/api/seasons";

// TRIN 2: FIND KASSEN I HTML'EN
// Finder <div class="grid_1-1-1-1"> i HTML'en
// . betyder "find den med denne class"
// seasonsList = et navn jeg selv har valgt, det findes kun i JS
const seasonsList = document.querySelector(".grid_1-1-1-1");

// TRIN 6: START DET HELE
// Man må godt kalde en funktion, før den er skrevet længere nede i filen
// Kæden: getData → fetch → json → showData → kortene står på siden
getData();

// TRIN 3: HENT DATA FRA API'ET
// En funktion gør ingenting, før den bliver kaldt med getData()
// fetch(productUrl) = spørg API'et efter sæsonerne
// .then = vent på svaret, og gør så det næste
// result.json() = pak svaret ud, så det bliver et array (en liste)
// showData(data) = send listen videre, så den kan vises
function getData() {
  fetch(productUrl).then((result) => result.json().then((data) => showData(data)));
}

// TRIN 4: VIS SÆSONERNE PÅ SIDEN
// data = listen med sæsoner fra API'et
function showData(data) {
  console.log("DATA", data);

  // Tømmer kassen, så der ikke ligger noget gammelt i den
  seasonsList.innerHTML = "";

  // myInnerHTML = en tom tekst, som vi fylder kort i
  // let og ikke const, fordi den bliver ændret for hver sæson
  let myInnerHTML = "";

  // forEach = gør det samme for hver sæson i listen, en ad gangen
  // season = den sæson, vi er ved lige nu, fx {season: "Summer"}
  data.forEach((season) => {
    console.log(season);

    // += = læg et nyt kort oven i dem, der allerede er i myInnerHTML
    // ` ` (backticks) = så kan man skrive HTML over flere linjer og bruge ${ }
    // ${season.season} = sæt sæsonens navn ind her, fx "Summer"
    // Linket får sæsonen med (?season=Summer), så produktlisten ved hvilken kollektion den skal vise
    // Ordet "season" skal være det samme som i param.get("season") i list.js
    myInnerHTML += `<article class="card">
                <img class="card_img" src="img/Skærmbillede 2026-09-21 kl. 19.47.49.png" alt="Sommer kollektion" />
                <div class="card_body">
                    <h3 class="card_titel">${season.season} kollektion</h3>
                    <p class="card_tekst">Lette silhuetter og bløde farver til de varme dage.</p>
                    <a class="card_btn" href="productlist.html?season=${season.season}">Se kollektion</a>                </div>
            </article>`;
  });

  // TRIN 5: SÆT KORTENE IND PÅ SIDEN
  // Alle kortene bliver sat ind i kassen på én gang
  seasonsList.innerHTML = myInnerHTML;
}

/*
==========================================================
  INDEX.JS: FRA STATISK TIL DYNAMISK, 7 TRIN
  index.html → index.js → API: /api/seasons
==========================================================

STATISK  = jeg har selv skrevet alt indholdet i HTML'en
DYNAMISK = JavaScript henter indholdet fra et API og skriver HTML'en for mig

Det til højre kommer ind i det til venstre.

seasonsList.innerHTML = myInnerHTML;
//      venstre      ⬅     højre
//    (modtager)          (bliver sendt)

----------------------------------------------------------
TRIN 1: BYG SIDEN STATISK FØRST
----------------------------------------------------------
Jeg skrev ét kort i index.html og stylede det med CSS.
Det kort er min SKABELON, altså det JavaScript skal gentage.

  <article class="card">
      <img class="card_img" src="img/Skærmbillede 2026-09-21 kl. 19.47.49.png" alt="Sommer kollektion" />
      <div class="card_body">
          <h3 class="card_titel">Sommer kollektion</h3>
          <p class="card_tekst">Lette silhuetter og bløde farver til de varme dage.</p>
          <a class="card_btn" href="product.html">Se kollektion</a>
      </div>
  </article>

----------------------------------------------------------
TRIN 2: LAV EN JS-FIL OG FORBIND DEN
----------------------------------------------------------
I <head> i index.html:
  <script src="javascript/index.js" defer></script>
defer = JS venter, til HTML'en er læst (ellers finder querySelector intet)

Test øverst i index.js:
  console.log("hej");      → står der "hej" i konsollen, er filen forbundet

----------------------------------------------------------
TRIN 3: TOM KASSE I HTML'EN + UDKOMMENTÉR KORTENE
----------------------------------------------------------
I index.html:
  <div class="grid_1-1-1-1">
      <!-- gamle kort, udkommenteret -->
  </div>
Kassen (div'en) skal BLIVE. Kun kortene indeni udkommenteres.

I index.js finder jeg kassen:
  const seasonsList = document.querySelector(".grid_1-1-1-1");
seasonsList = et navn jeg selv har valgt, det findes kun i JS

----------------------------------------------------------
TRIN 4: FIND API-ADRESSEN
----------------------------------------------------------
  const productUrl = "https://kea-alt-del.dk/t7/api/seasons";

Svaret:
  [{"season":"Fall"},{"season":"Spring"},{"season":"Summer"},{"season":"Winter"}]
Starter med [ → en LISTE → brug forEach
Felt jeg bruger: season

----------------------------------------------------------
TRIN 5: HENT DATA (motoren)
----------------------------------------------------------
  getData();                                  // start det hele

  function getData() {
    fetch(productUrl).then((result) => result.json().then((data) => showData(data)));
  }

fetch(productUrl) = spørg API'et
result.json()     = pak svaret ud
showData(data)    = send listen videre

----------------------------------------------------------
TRIN 6: KOPIÉR KORTET IND I JS OG SÆT DATA IND
----------------------------------------------------------
  function showData(data) {
    seasonsList.innerHTML = "";               // tøm kassen
    let myInnerHTML = "";                     // tom tekst, som vi fylder kort i

    data.forEach((season) => {                // for hver sæson
      myInnerHTML += `<article class="card">
          <img class="card_img" src="img/Skærmbillede 2026-09-21 kl. 19.47.49.png" alt="Sommer kollektion" />
          <div class="card_body">
              <h3 class="card_titel">${season.season} kollektion</h3>
              <p class="card_tekst">Lette silhuetter og bløde farver til de varme dage.</p>
              <a class="card_btn" href="productlist.html?season=${season.season}">Se kollektion</a>
          </div>
      </article>`;                            // husk ` til sidst
    });

    seasonsList.innerHTML = myInnerHTML;      // sæt alle kort ind på én gang
  }

  Statisk (før)          →  Dynamisk (efter)
  Sommer kollektion      →  ${season.season} kollektion
  href="product.html"    →  href="productlist.html?season=${season.season}"

Klasserne er de samme som i HTML'en, så CSS'en virker stadig.
${ } virker KUN i backticks ` `, ikke i " ".

----------------------------------------------------------
TRIN 7: FORBIND SIDERNE MED URL-PARAMETRE
----------------------------------------------------------
Index er siden FØR, så den laver linket med en parameter:
  href="productlist.html?season=${season.season}"
  → fx productlist.html?season=Summer

list.js læser den med:
  param.get("season")

Ordet "season" skal være stavet PRÆCIS ens begge steder.

----------------------------------------------------------
HVIS SIDEN ER TOM
----------------------------------------------------------
1. Rød fejl i konsollen?        → læs den
2. Står der ikke "hej"?         → index.js er ikke forbundet (tjek <script>)
3. seasonsList er null?         → klassen er stavet forkert, eller div'en er udkommenteret
4. Mangler defer på <script>?
5. Mangler ` til sidst i kortet?
6. Viser browseren en gammel fil? → Cmd + Shift + R
==========================================================



Du har gennemgået hele index.js!

Her er det hele med dine egne ord (rettet lidt til):

"use strict": JavaScript siger til, når der er fejl, i stedet for at ignorere dem.

console.log("hej"): tester, at JS-filen er forbundet til HTML'en.

const productUrl = "...": gemmer API-adressen, så den kan bruges senere.

document.querySelector(".grid_1-1-1-1"): finder kassen i HTML'en, så JavaScript kan sætte kort ind i den.

getData(): sætter funktionen i gang. Uden den sker der ingenting.

fetch → .json() → showData: henter data, pakker JSON ud, så JavaScript forstår det, og sender det videre.

innerHTML = "": tømmer kassen, så den er klar.

let myInnerHTML = "": en tom pose, der skal fyldes. let, fordi den bliver ændret.

forEach((season) => ...): går igennem sæsonerne én ad gangen, til der ikke er flere. season er bare et navn.

+= og backticks: lægger hvert kort til uden at overskrive. Backticks gør, at ${ } virker.

${season.season} kollektion: bliver til fx "Fall kollektion".

href="productlist.html?season=...": sender sæsonen videre til produktlisten.

seasonsList.innerHTML = myInnerHTML: det til højre kommer ind i det til venstre, altså alle kort ind på siden på én gang.
*/
