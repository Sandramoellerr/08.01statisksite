"use strict";
console.log("hej");
const productUrl = "https://kea-alt-del.dk/t7/api/seasons";
const seasonsList = document.querySelector(".grid_1-1-1-1");

getData();
function getData() {
  fetch(productUrl).then((result) => result.json().then((data) => showData(data)));
}

function showData(data) {
  console.log("DATA", data);
  seasonsList.innerHTML = "";
  let myInnerHTML = "";

  data.forEach((season) => {
    console.log(season);

    myInnerHTML += `<article class="card">
                <img class="card_img" src="img/Skærmbillede 2026-09-21 kl. 19.47.49.png" alt="Sommer kollektion" />
                <div class="card_body">
                    <h3 class="card_titel">${season.season} kollektion</h3>
                    <p class="card_tekst">Lette silhuetter og bløde farver til de varme dage.</p>
                    <a class="card_btn" href="product.html">Se kollektion</a>
                </div>
            </article>`;
  });
  seasonsList.innerHTML = myInnerHTML;
}
