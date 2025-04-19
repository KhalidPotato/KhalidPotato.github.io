const cardContainer = document.querySelector(".card-container");
const ticketButton = document.getElementById("ticket-button");
const keyButton = document.getElementById("key-button");
const coinButton = document.getElementById("coin-button");
const caseBuxButton = document.getElementById("case-bux-button");
const demandButton = document.getElementById("demand-button");
const copiesButton = document.getElementById("copies-button");
const nameButton = document.getElementById("name-button");
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

function parseValue(val) {
  if (val === "O/C") return 99999999999999;
  if (val === "N/A" || val === undefined || val === "-") return 999999999999999;
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
}

function parseDemand(demandArr) {
  const val = demandArr?.[0];
  if (val === "O/C") return 11;
  if (val === "N/A" || val === undefined || val === "-") return 12;
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
}

function parseCopies(val) {
  return parseValue(val);
}

function createCard(data) {
  const card = document.createElement("div");
  card.classList.add("card");

  const name = document.createElement("h2");
  name.textContent = data.name;
  card.appendChild(name);

  const image = document.createElement("img");
  const imageSrc = `${
    data.image.includes("./") ? `./images/${data.image.slice(1)}` : data.image
  }`;
  image.src = imageSrc;
  image.alt = data.name;
  image.loading = "lazy";
  card.appendChild(image);

  const values = document.createElement("div");
  values.classList.add("value");
  card.appendChild(values);

  const valueLabels = ["tickets", "keys", "lapis", "coins", "case-bux"];
  valueLabels.forEach((key) => {
    const val = data.values?.[key];
    if (val !== undefined && val !== "-") {
      const valueText = document.createElement("p");
      valueText.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${
        typeof val === "number" ? commaify(val) : val
      }`;
      values.appendChild(valueText);
    }
  });


  const copies = document.createElement("p");
  copies.textContent = `COPIES: ${
    data.copies && data.copies !== "-" ? commaify(data.copies) : "N/A"
  }`;
  card.appendChild(copies);

  const demand = document.createElement("p");
  const demandVal = data.demand?.[0];
  const demandMax = data.demand?.[1] ?? "10";
  demand.textContent = `DEMAND: ${demandVal ?? "N/A"}/${demandMax}`;
  card.appendChild(demand);

  cardContainer.appendChild(card);
}

async function initializeCards() {
  cardContainer.innerHTML = "";
  const cardData = await fetchData();
  cardData.forEach(createCard);
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
        parseValue(a.values?.[criteria]) - parseValue(b.values?.[criteria])
      );
    }

    cardContainer.innerHTML = "";
    sorted.forEach(createCard);
  });
}

function searchItems() {
  const searchText = searchInput.value.toLowerCase();
  fetchData().then((cardData) => {
    const filteredData = cardData.filter((data) =>
      data.name.toLowerCase().includes(searchText)
    );
    cardContainer.innerHTML = "";
    filteredData.forEach(createCard);
  });
}

searchInput.addEventListener("input", searchItems);
nameButton.addEventListener("click", () => sortItems("name"));
ticketButton.addEventListener("click", () => sortItems("tickets"));
keyButton.addEventListener("click", () => sortItems("keys"));
coinButton.addEventListener("click", () => sortItems("coins"));
caseBuxButton.addEventListener("click", () => sortItems("case-bux"));
copiesButton.addEventListener("click", () => sortItems("copies"));
demandButton.addEventListener("click", () => sortItems("demand"));

window.addEventListener("DOMContentLoaded", initializeCards);
