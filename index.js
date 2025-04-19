const cardContainer = document.querySelector(".card-container");
const buttons = {
  name: document.getElementById("name-button"),
  tickets: document.getElementById("ticket-button"),
  keys: document.getElementById("key-button"),
  coins: document.getElementById("coin-button"),
  casebux: document.getElementById("case-bux-button"),
  demand: document.getElementById("demand-button"),
  copies: document.getElementById("copies-button"),
};
const searchInput = document.getElementById("search-input");

const commaify = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

async function fetchData() {
  try {
    const response = await fetch("./values.json");
    const cardData = await response.json();
    return cardData;
  } catch (error) {
    console.error("Error loading values.json:", error);
    return [];
  }
}

function createCard(data) {
  const card = document.createElement("div");
  card.classList.add("card");

  const name = document.createElement("h2");
  name.textContent = data.name;
  card.appendChild(name);

  const image = document.createElement("img");
  image.src = data.image.includes("./") ? `./images/${data.image.slice(2)}` : data.image;
  image.alt = data.name;
  image.loading = "lazy";
  card.appendChild(image);

  const values = document.createElement("div");
  values.classList.add("value");

  for (const key in data.values) {
    const val = data.values[key];
    if (val !== "-" && val !== 0 && val !== "0" && val !== "N/A") {
      const p = document.createElement("p");
      p.textContent = `${key[0].toUpperCase() + key.slice(1)}: ${commaify(val)}`;
      values.appendChild(p);
    }
  }

  card.appendChild(values);

  const copies = document.createElement("p");
  copies.textContent = `COPIES: ${commaify(data.copies)}`;
  card.appendChild(copies);

  const demand = document.createElement("p");
  demand.textContent = `DEMAND: ${data.demand[0]}/${data.demand[1] ?? "10"}`;
  card.appendChild(demand);

  cardContainer.appendChild(card);
}

function parseValue(val) {
  if (val === "O/C") return 99999999999999;
  if (val === "N/A") return 999999999999999;
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
}

function parseDemand(demandArr) {
  const val = demandArr[0];
  if (val === "O/C") return 11;
  if (val === "N/A") return 12;
  return parseFloat(val) || 0;
}

function parseCopies(val) {
  return parseValue(val);
}

function sortItems(criteria) {
  fetchData().then((cardData) => {
    let sorted;

    if (criteria === "name") {
      sorted = [...cardData].sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    } else if (criteria === "demand") {
      sorted = [...cardData].sort((a, b) =>
        parseDemand(a.demand) - parseDemand(b.demand)
      );
    } else if (criteria === "copies") {
      sorted = [...cardData].sort((a, b) =>
        parseCopies(a.copies) - parseCopies(b.copies)
      );
    } else {
      sorted = [...cardData].sort((a, b) =>
        parseValue(a.values[criteria]) - parseValue(b.values[criteria])
      );
    }

    cardContainer.innerHTML = "";
    sorted.forEach(createCard);
  });
}

function searchItems() {
  const searchText = searchInput.value.toLowerCase();
  fetchData().then((cardData) => {
    const filtered = cardData.filter((item) =>
      item.name.toLowerCase().includes(searchText)
    );
    cardContainer.innerHTML = "";
    filtered.forEach(createCard);
  });
}

function initializeCards() {
  fetchData().then((cardData) => {
    cardContainer.innerHTML = "";
    cardData.forEach(createCard);
  });
}

// Event Listeners
searchInput.addEventListener("input", searchItems);

buttons.name.addEventListener("click", () => sortItems("name"));
buttons.tickets.addEventListener("click", () => sortItems("tickets"));
buttons.keys.addEventListener("click", () => sortItems("keys"));
buttons.coins.addEventListener("click", () => sortItems("coins"));
buttons.casebux.addEventListener("click", () => sortItems("case-bux"));
buttons.copies.addEventListener("click", () => sortItems("copies"));
buttons.demand.addEventListener("click", () => sortItems("demand"));

window.addEventListener("DOMContentLoaded", initializeCards);
