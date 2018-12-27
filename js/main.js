let available = 0;
let totalCards = 0;
let gameTarget = 6;
let maxCards = 12;
let userSet = [];
let foundSets = [];
let flashContainer;
let foundContainer;
const imgPath = (document.onreadystatechange = function() {
  flashContainer = document.getElementById("js-feedback");
  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("reset")) {
      gameReset();
    }
  });
  if (document.readyState == "interactive") {
    gameStart();
  }
});

function gameStart() {
  while (available !== gameTarget) {
    Game.start();
    available = Game.sets.length;
    totalCards = Game.table.length;
  }
  renderTable();
  renderStatus();
}

/**
 * Render Table
 *
 * @return void
 */
function renderTable() {
  const board = document.querySelector(".game__table");
  board.innerHTML = "";
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

/**
 * Render Found
 *
 * @return void
 */
function renderFound(set) {
  foundContainer = document.querySelector(".found-sets");
  const newSet = document.createElement("div");
  newSet.classList.add("found-set");
  set
    .sort((a, b) => a.count - b.count)
    .map(card => {
      const newCard = document.createElement("div");
      newCard.classList.add("found-set__card");
      newCard.dataset.cardId = card.id;
      addSvg(newCard, card);
      newSet.appendChild(newCard);
    });
  if (foundContainer.hasChildNodes()) {
    foundContainer.insertBefore(newSet, foundContainer.childNodes[0]);
  } else {
    foundContainer.appendChild(newSet);
  }
}

/**
 * Render Table
 *
 * @return void
 */
function renderTable() {
  const board = document.querySelector(".game__table");
  board.innerHTML = "";
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

/**
 * Show game status. Sets found from sets available
 *
 * @return void
 */
function renderStatus() {
  foundEle = document.getElementById("found");
  availableEle = document.getElementById("available");
  availableEle.textContent = available;
  foundEle.textContent = foundSets.length;
}

/**
 *
 * @param {object} card
 *
 */
function handleCardSelect(card) {
  if (userSet.length === 3) {
    resetSelections();
  }
  if (!card.classList.contains("active")) {
    userSet.push(getCard(card.dataset.cardId));
  } else {
    userSet.splice(
      userSet.findIndex(set => {
        return set.id == card.dataset.cardId;
      }),
      1
    );
  }
  card.classList.toggle("active");

  if (userSet.length === 3) {
    if (Game.isSet(...userSet)) {
      alreadyFound(userSet);
    } else {
      flash(Game.whyNot(...userSet), `error`);
    }
  }

  if (foundSets.length === available) {
    gameEnd();
  }
}
/**
 *
 * @param {string} message
 * @param {string} type
 */
function flash(message = "", type = "success") {
  flashContainer.classList.remove("error", "success", "warn");
  flashContainer.classList.add(type);
  flashContainer.innerHTML = `<p>${message}</p>`;
}

function clearFlash() {
  flashContainer.classList.remove("error", "success", "warn");
  flashContainer.innerHTML = "";
}

function resetSelections() {
  clearFlash();
  clearSelections();
  userSet = [];
}

function clearSelections() {
  userSet.forEach(selected => {
    document
      .querySelector(`[data-card-id="${selected.id}"]`)
      .classList.remove("active");
  });
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
    newSvg.innerHTML += `<svg viewBox="0 0 8 16" class="shape ${card.color} ${
      card.fill
    }" >
    <use xlink:href="#${card.shape}"></use>
    </svg>`;
    parent.appendChild(newSvg);
    counter++;
  }
}

function alreadyFound(set) {
  let isNewSet = false;
  if (foundSets.length === 0) {
    isNewSet = true;
  } else {
    isNewSet = !matchSets(set);
  }

  if (isNewSet) {
    flash(`You've found a set!`, `success`);
    foundSets.push(set);
    renderStatus();
    renderFound(set);
    return true;
  } else {
    flash(`This set has already been found!`, `error`);
    renderStatus();
    return true;
  }
}
function matchSets(set) {
  let matched = false;
  for (const found of foundSets) {
    if (matched) continue;
    matched = found.every(card => {
      return set.find(item => {
        return item.id === card.id;
      });
    });
  }
  return matched;
}

function gameEnd() {
  flash(
    `\u{1F3C6} Congratulations! \u{1F3C6} You've found all the sets. \u{1F947} <span class="reset" >Play again?</span>`,
    "success"
  );
}

function gameReset() {
  available = 0;
  totalCards = 0;
  userSet = [];
  foundSets = [];
  foundContainer.innerHTML = "";
  clearFlash();
  renderStatus();
  gameStart();
}
