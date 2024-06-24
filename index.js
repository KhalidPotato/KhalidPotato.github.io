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
    console.error("Error searching for your Dad:", error);
  }
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

  for (const value in data.values) {
    if (data.values[value] != "-" && data.values[value] != 0) {
      const valueText = document.createElement("p");
      valueText.textContent = `${
        value.charAt(0).toUpperCase() + value.slice(1)
      }: ${
        typeof data.values[value] == "number"
          ? commaify(data.values[value])
          : data.values[value]
      }`;
      values.appendChild(valueText);
      }
      }

      const copies = document.createElement("p");
      copies.textContent = `COPIES: ${commaify(data.copies)}`;
      card.appendChild(copies);

      const demand = document.createElement("p");
      demand.textContent = `DEMAND: ${data.demand[0]}/${data.demand[1] ? data.demand[1] : "10"}`;
      card.appendChild(demand);

      cardContainer.appendChild(card);
      }

      async function initializeCards() {
      cardContainer.innerHTML = "";
      const cardData = await fetchData();
      cardData.forEach((data) => {
      createCard(data);
      });
      }

      function sortItems(criteria) {
      cardContainer.innerHTML = "";
      fetchData().then((cardData) => {
      cardData.sort((a, b) => {
      if (typeof a.values[criteria] === "string") {
        return a.values[criteria].localeCompare(b.values[criteria]);
      } else {
        return a.values[criteria] - b.values[criteria];
      }
      });
      cardData.forEach((data) => {
      createCard(data);
      });
      });
      }

      function searchItems() {
      const searchText = searchInput.value.toLowerCase();
      cardContainer.innerHTML = "";
      fetchData().then((cardData) => {
      const filteredData = cardData.filter((data) =>
      data.name.toLowerCase().includes(searchText)
      );
      filteredData.forEach((data) => {
      createCard(data);
      });
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
