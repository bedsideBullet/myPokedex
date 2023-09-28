const pokedex = document.getElementById("pokedex");
const pokeFavs = document.getElementById("pokefavs");
const allItems = document.querySelectorAll(".card");
const sortButton = document.getElementById("sort-btn");

console.log(pokedex);

const fetchPokemon = () => {
  const promises = [];
  for (i = 1; i <= 151; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(url).then((res) => res.json()));
  }

  Promise.all(promises).then((results) => {
    const pokemon = results.map((data) => ({
      name: data.name,
      id: data.id,
      image: data.sprites["front_default"],
      type: data.types.map((type) => type.type.name).join(", "),
    }));
    displayPokemon(pokemon);
  });
};

const displayPokemon = (pokemon) => {
  console.log(pokemon);
  const pokemonHTMLString = pokemon
    .map(
      (pokedude) => `
  <li class="card" id="${pokedude.id}">
  <div class="id">${pokedude.id}</div>
  <h2>${pokedude.name.toUpperCase()}</h2>
     <img class="card-image" src="${pokedude.image}" alt="Pokemon Image"></img>
     <p class="type">Type</p>
     <p class="card-subtitle">${pokedude.type}</p>
  </li>
  `
    )
    .join(" ");
  pokedex.innerHTML = pokemonHTMLString;

  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const clonedCard = card.cloneNode(true);

      clonedCard.removeEventListener("click", () => {});

      if (card.parentNode === pokedex) {
        pokeFavs.appendChild(clonedCard);
        card.remove();
      } else if (card.parentNode === pokeFavs) {
        pokedex.appendChild(clonedCard);
        card.remove();
      }
    });
  });

  pokeFavs.addEventListener("click", (event) => {
    if (event.target.classList.contains("card")) {
      const clonedCard = event.target.cloneNode(true);

      clonedCard.removeEventListener("click", () => {});

      pokedex.appendChild(clonedCard);
      event.target.remove();
    }
  });
};

fetchPokemon();

sortButton.addEventListener("click", () => {
  const sortDirection = sortButton.dataset.sortdir;
  sortData(sortDirection);
});

function sortData() {
  const mainContainer = document.getElementById("pokedex");
  const allItems = Array.from(mainContainer.querySelectorAll(".card"));
  const currentSortDirection = sortButton.dataset.sortdir;

  allItems.sort((a, b) => {
    const idA = parseInt(a.id);
    const idB = parseInt(b.id);

    if (currentSortDirection === "asc") {
      return idA - idB;
    } else {
      return idB - idA;
    }
  });

  sortButton.dataset.sortdir = currentSortDirection === "asc" ? "desc" : "asc";

  mainContainer.innerHTML = "";

  allItems.forEach((item) => {
    mainContainer.appendChild(item);
  });
}

console.log(type);
