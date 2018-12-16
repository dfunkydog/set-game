var Deck = {
  reset: function() {
    this.size = 0;
    this.cards = [];

    while (this.size < 81) {
      this.cards.push(Card.new(this.size));
      this.size += 1;
    }
    this.shuffle();

    return this.cards;
  },

  shuffle: function() {
    var array = this.cards;
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    this.cards = array;
  }
};

var Card = {
  attributes: ["number", "fill", "color", "shape"],
  count: [1, 2, 3],
  fill: ["full", "empty", "lined"],
  color: ["red", "purple", "green"],
  shape: ["square", "circle", "triangle"],

  new: function(number) {
    // conver the number to base 3
    number = number.toString(3);

    // create an array of select properties
    var value = number.split("").map(function(i) {
      return parseInt(i);
    });

    // Zero pad small numbers, ie. [1,2] => [0,0,1,2]
    while (value.length < 4) {
      value.unshift(0);
    }

    return {
      value: value,
      count: this.count[value[0]],
      fill: this.fill[value[1]],
      color: this.color[value[2]],
      shape: this.shape[value[3]],
      id: value.join("")
    };
  }
};

var Game = {
  start: function() {
    this.deck = Deck.reset();
    this.deal();
  },

  deal: function() {
    this.sets = [];
    this.table = this.deck.splice(0, 12);
    this.ensureSet();
  },

  add3: function() {
    var newCards = this.deck.splice(0, 3);
    console.log(
      "Adding 3: " +
        newCards
          .map(function(c) {
            return c.id;
          })
          .join(" ")
    );
    this.table = this.table.concat(newCards);
  },

  ensureSet: function() {
    while (!this.hasSet() && 0 < this.deck.length) {
      this.add3();
    }
  },

  pickSet: function(card1, card2, card3) {
    if (this.isSet(card1, card2, card3)) {
      console.log("Correct, that was a set!");
      this.replaceCards(card1, card2, card3);
      return true;
    } else {
      console.log(this.whyNot(card1, card2, card3));
      return false;
    }
  },

  listItems: function(items) {
    if (items.length == 1) return items[0];

    items = items.slice(0);
    var list = " and " + items.pop();
    if (1 < items.length) list = "," + list;
    list = items.join(", ") + list;

    return list;
  },

  replaceCards: function(card1, card2, card3) {
    var replaceIndex = [];

    this.table.forEach(function(card, index) {
      if (card1.id == card.id || card2.id == card.id || card3.id == card.id) {
        console.log("Replacing: " + card.id);
        replaceIndex.push(index);
      }
    });

    replaceIndex.forEach(
      function(index) {
        this.table.splice(index, 1);
      }.bind(this)
    );

    this.add3();
    this.ensureSet();
  },

  hasSet: function(cards) {
    cards = cards || this.table.slice(0);

    while (3 < cards.length) {
      // Remove card1 from group
      var card1 = cards.splice(0, 1)[0];
      var cardsLeft = cards.slice(0);

      while (2 < cardsLeft.length) {
        var card2 = cardsLeft.splice(0, 1)[0];

        // Determine which card would complete the set
        var card3 = this.completeSet(card1.value, card2.value);

        // Search group
        cardsLeft.forEach(
          function(card, index) {
            if (card.id == card3.id) {
              this.sets.push([card1, card2, card]);

              // Remove card so it is not considered again for a match
              // This ensures that set [a,b,c] and [b,c,a] are not both accepted
              cardsLeft.splice(index, 1);
            }
          }.bind(this)
        );
      }
    }

    return 0 < this.sets.length;
  },

  // Are these three cards a set?
  isSet: function(card1, card2, card3) {
    return card3.id == this.completeSet(card1.value, card2.value).id;
  },

  completeSet: function(card1, card2) {
    // All properties in a set must be the same or different
    // The values of each property added together should be divisible by 3
    // For example: 0+0+0 == 0, 0+1+2 == 3, 1+1+1 == 3, 2+2+2 == 6
    var values = card1.map(function(val, index) {
      // If the properties are the same, the third card's should be too
      if (val == card2[index]) return val;

      // If they are different, the third card should be one of (0, 1, 2)
      // By subtracting from three, we find the correct property number.
      // For example: 3-(1+2) == 0, 3-(0+2) == 1, 3-(1+0) == 2
      return 3 - (val + card2[index]);
    });

    return {
      value: values,
      id: values.join("")
    };
  },

  whyNot: function(card1, card2, card3) {
    var reasons = [];

    this.completeSet(card1.value, card2.value).value.forEach(function(
      property,
      index
    ) {
      if (property != card3.value[index]) reasons.push(Card.attributes[index]);
    });

    var reason = "Sorry this was not a set: " + this.listItems(reasons);
    if (reasons.length == 1) reason = reason + " was not a set.";
    else reason = reason + " were not sets.";

    return reason;
  }
};

//Game.start()
