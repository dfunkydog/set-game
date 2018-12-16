document.onreadystatechange = function() {
  if (document.readyState === "interactive") {
    Game.start();
    renderTable();
  }
};

/**
 * Render Table
 *
 * @return void
 */
function renderTable() {
  const board = document.querySelector(".game__table");
  Game.table.map(card => {
    const newCard = document.createElement("div");

    newCard.classList.add("game__card");
    newCard.dataset.cardId = card.id;
    addSvg(newCard, card);
    newCard.addEventListener("click", function(e) {
      handleCardSelect(e.currentTarget);
    });
    board.appendChild(newCard);
  });
}

let userSet = [];
function handleCardSelect(card) {
  if (userSet.length === 3) {
    resetSelections();
  }
  if (!card.classList.contains("active")) {
    userSet.push(getCard(card.dataset.cardId));
  }
  if (userSet.length === 3) {
    if (Game.isSet(...userSet)) {
      console.log("you've got a set");
    } else {
      console.log(Game.whyNot(...userSet));
    }
  }
  card.classList.toggle("active");
}

function resetSelections() {
  //remove active class
  userSet.forEach(selected => {
    document
      .querySelector(`[data-card-id="${selected.id}"]`)
      .classList.remove("active");
  });
  //reset array
  userSet = [];
}

function getCard(id) {
  return Game.table.find(card => {
    return card.id == id;
  });
}

function addSvg(parent, card) {
  var counter = 0;
  while (counter < card.count) {
    var newSvg = document.createElement("div");
    newSvg.classList.add("shape__wrapper");
    newSvg.innerHTML += `<svg viewBox="0 0 4.6113 14.363" class="shape ${
      card.color
    } ${card.fill}" >
    <use xlink:href="img/shapes.svg#${card.shape}"></use>
    </svg>`;
    parent.appendChild(newSvg);
    counter++;
  }
}
