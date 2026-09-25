"use strict";
/* "use strict" = en streng lærer
den siger med det samme til, hvis du laver en fejl */

console.log("hej");
/* console.log = skriv en besked i konsollen
bare for at tjekke, at filen virker */

/* productUrl = adressen, hvor dataen bor på internettet
det er ligesom en adresse på et hus, vi skal hen og hente noget fra */
const productUrl = "https://kea-alt-del.dk/t7/api/seasons";

/* seasonsList = find kassen i HTML, hvor kortene skal stå
. betyder "find den med denne class" */
const seasonsList = document.querySelector(".grid_1-1-1-1");

/* getData() = sig "GO!" og start med at hente data
(man kan godt kalde den, før den er skrevet længere nede) */
getData();

/* FUNCTION = en opskrift
den gør ingenting, før man kalder den med getData() */
function getData() {
  /* fetch = gå hen til adressen og hent dataen
  .then = NÅR du er kommet tilbage, så gør det næste
  result.json() = pak dataen ud, så JavaScript kan forstå den
  showData(data) = giv den udpakkede data videre til showData */
  fetch(productUrl).then((result) => result.json().then((data) => showData(data)));
}

/* showData = opskriften, der viser dataen på siden
"data" = listen med sæsoner, vi lige har hentet */
function showData(data) {
  console.log("DATA", data);

  /* tøm kassen på siden, så der ikke ligger noget gammelt i den */
  seasonsList.innerHTML = "";

  /* myInnerHTML = en tom pose, som vi fylder kort i
  let og ikke const, fordi posen bliver ændret hele tiden */
  let myInnerHTML = "";

  /* FOREACH = lav et kort for hver sæson, et ad gangen
  "season" = den sæson, vi er ved lige nu */
  data.forEach((season) => {
    console.log(season);

    /* += = læg et nyt kort oveni i posen
    `` (backticks) = så kan man skrive HTML over flere linjer
    ${season.season} = sæt sæsonens navn ind her, fx "Summer" */
    myInnerHTML += `<article class="card">
                <img class="card_img" src="img/Skærmbillede 2026-09-21 kl. 19.47.49.png" alt="Sommer kollektion" />
                <div class="card_body">
                    <h3 class="card_titel">${season.season} kollektion</h3>
                    <p class="card_tekst">Lette silhuetter og bløde farver til de varme dage.</p>
                    <a class="card_btn" href="product.html">Se kollektion</a>
                </div>
            </article>`;
  });

  /* hæld hele posen med kort ind i kassen på siden, alt på én gang */
  seasonsList.innerHTML = myInnerHTML;
}
