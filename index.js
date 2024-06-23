const cardContainer = document.querySelector(".card-container");
const ticketButton = document.getElementById("ticket-button");
const keyButton = document.getElementById("key-button");
const coinButton = document.getElementById("coin-button");
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
    console.error("Error fetching JSON:", error);
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
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      }: ${commaify(data.values[value])}`;
      values.appendChild(valueText);
    }
  }

  const copies = document.createElement("p");
  copies.textContent = `COPIES: ${commaify(data.copies)}`;
  card.appendChild(copies);

  const rarity = document.createElement("p");
  rarity.textContent = `DEMAND: ${data.demand[0]}/${
    data.demand[1] ? data.demand[1] : "10"
  }`;
  card.appendChild(rarity);

  return card;
}

(async () => {
  const cardData = await fetchData();
  if (!cardData) return;

  function reorder(func) {
    cardContainer.innerHTML = "";
    cardData.sort(func);

    cardData.forEach(function (card) {
      const cardElement = createCard(card);
      cardContainer.appendChild(cardElement);
    });
  }

  function sortByValue(v) {
    function compare(a, b) {
      if (!b.values[v] || !a.values[v])
        return b.values[v] ? b.values[v] : 0 - a.values[v] ? a.values[v] : 0;
      else if (a.values[v] === "O/C" && b.values[v] !== "O/C") return -1;
      else if (a.values[v] !== "O/C" && b.values[v] === "O/C") return 1;
      else if (a.values[v] === "O/C" && b.values[v] === "O/C")
        return a.copies - b.copies;
      else return b.values[v] - a.values[v];
    }

    reorder(compare);
  }

  const sortByDemand = () =>
    reorder(
      (a, b) =>
        b.demand[0] / (b.demand[1] ? b.demand[1] : 10) -
        a.demand[0] / (a.demand[1] ? a.demand[1] : 10)
    );
  const sortByCopies = () => reorder((a, b) => b.copies - a.copies);
  const sortByName = () => reorder((a, b) => a.name.localeCompare(b.name));

  const search = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = cardData.filter((card) =>
      card.name.toLowerCase().includes(searchTerm)
    );

    cardContainer.innerHTML = "";
    filteredData.forEach((card) => cardContainer.appendChild(createCard(card)));
  };

  ticketButton.addEventListener("click", () => sortByValue("tickets"));
  keyButton.addEventListener("click", () => sortByValue("keys"));
  coinButton.addEventListener("click", () => sortByValue("coins"));
  demandButton.addEventListener("click", sortByDemand);
  copiesButton.addEventListener("click", sortByCopies);
  nameButton.addEventListener("click", sortByName);
  searchInput.addEventListener("input", search);

  sortByCopies();
})();
