const pokedex = document.getElementById("pokedex");
const pokeFavs = document.getElementById("pokefavs");
const allItems = document.querySelectorAll(".card");
const sortButton = document.getElementById("sort-btn");

const fetchPokemon = () => {
  const promises = [];
  for (i = 1; i <= 30; i++) {
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

    const typeCounts = countTypes(pokemon);

    displayPokemon(pokemon);

    displayTypeCounts(typeCounts);
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
};

pokeFavs.addEventListener("click", (event) => {
  const card = event.target.closest(".card");

  if (card && card.parentNode === pokeFavs) {
    const clonedCard = card.cloneNode(true);
    clonedCard.removeEventListener("click", () => {});

    pokeFavs.removeChild(card);
    pokedex.appendChild(clonedCard);
  }
});

function setupCardClickListeners() {
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

      setupCardClickListeners();
    });
  });
}

setupCardClickListeners();

const countTypes = (pokemon) => {
  const typeCounts = {};

  pokemon.forEach((pokedude) => {
    const types = pokedude.type.split(", ");

    types.forEach((type) => {
      if (typeCounts[type]) {
        typeCounts[type]++;
      } else {
        typeCounts[type] = 1;
      }
    });
  });

  return typeCounts;
};

const displayTypeCounts = (typeCounts) => {
  const typeCountsContainer = document.getElementById("type-counts");
  const typeCountsHTML = Object.keys(typeCounts)
    .map((type) => `<p>${type}: ${typeCounts[type]},</p>`)
    .join(" ");

  typeCountsContainer.innerHTML = typeCountsHTML;
};

fetchPokemon();

sortButton.addEventListener("click", () => {
  const sortDirection = sortButton.dataset.sortdir;
  sortData(sortDirection);
});

const sortFavsButton = document.getElementById("sort-favs");
sortFavsButton.addEventListener("click", () => {
  const sortDirection = sortFavsButton.dataset.sortdir;
  sortFavsData(sortDirection);
});

function sortFavsData() {
  const favsContainer = document.getElementById("pokefavs");
  const favItems = Array.from(favsContainer.querySelectorAll(".card"));
  const currentSortDirection = sortFavsButton.dataset.sortdir;

  favItems.sort((a, b) => {
    const nameA = a.querySelector("h2").textContent.toUpperCase();
    const nameB = b.querySelector("h2").textContent.toUpperCase();

    if (currentSortDirection === "asc") {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });

  sortFavsButton.dataset.sortdir =
    currentSortDirection === "asc" ? "desc" : "asc";

  favsContainer.innerHTML = "";

  favItems.forEach((item) => {
    favsContainer.appendChild(item);
  });
}

function sortData() {
  const mainContainer = document.getElementById("pokedex");
  const allItems = Array.from(mainContainer.querySelectorAll(".card"));
  const currentSortDirection = sortButton.dataset.sortdir;

  allItems.sort((a, b) => {
    const nameA = a.querySelector("h2").textContent.toUpperCase();
    const nameB = b.querySelector("h2").textContent.toUpperCase();

    if (currentSortDirection === "asc") {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });

  sortButton.dataset.sortdir = currentSortDirection === "asc" ? "desc" : "asc";

  mainContainer.innerHTML = "";

  allItems.forEach((item) => {
    mainContainer.appendChild(item);
  });
}
