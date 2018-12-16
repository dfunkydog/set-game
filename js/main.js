let available = 0;

let userSet = [];
let foundSets = [];
document.onreadystatechange = function() {
  if (document.readyState === "interactive") {
    while (available < 6) {
      Game.start();
      available = Game.sets.length;
    }
    renderTable();
    renderStatus();
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

function renderStatus() {
  foundEle = document.getElementById("found");
  availableEle = document.getElementById("available");
  availableEle.textContent = available;
  foundEle.textContent = foundSets.length;
}

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

  if (userSet.length === 3) {
    if (Game.isSet(...userSet)) {
      alreadyFound(userSet);
    } else {
      flash(Game.whyNot(...userSet), `error`);
    }
  }
  card.classList.toggle("active");
}
/**
 *
 * @param {string} message
 * @param {string} type
 */
function flash(message = "", type = "success") {
  const ele = document.getElementById("feedback");
  ele.classList.remove("error", "success", "warn");
  ele.classList.add(type);
  ele.textContent = `${message}`;
  setTimeout(() => {
    ele.classList.remove("error", "success", "warn");
    ele.textContent = "";
  }, 4000);
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
    newSvg.innerHTML += `<svg viewBox="0 0 8 16" class="shape ${card.color} ${
      card.fill
    }" >
    <use xlink:href="img/shapes.svg#${card.shape}"></use>
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
