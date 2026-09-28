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
