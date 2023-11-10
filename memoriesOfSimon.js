let game;
let firstGame = true;

class Game {
  constructor(levels, colors) {
    document.getElementById('openingAnim').classList.add('hidden');
    document.getElementById('textSlider').style.animationName = 'slideOut';
    this.colors = colors;
    this.levels = levels;
    this.currentLevel = 0;
    if (firstGame) {
      document.getElementById('textSlider').style.animationDuration = '8.75s';
      setTimeout(() => {
        this.startLevel();
        firstGame = false;
        document.getElementById('tutorial').style.display = 'none';
      }, 9000);
    } else {
      this.startLevel();
    }
  }

  startLevel() {
    shuffle(this.colors);
    this.levels[this.currentLevel].start(this.colors);
  }

  nextLevel() {
    if (this.currentLevel + 1 < this.levels.length) {
      this.currentLevel++;
      setTimeout(() => {
        this.startLevel();
      }, 3000);
    } else {
      this.endGame(true);
    }
  }

  endGame(won) {
    if (won) {
      new Audio('assets/winSound.wav').play();
      document.getElementById('win').style.animationName = 'colorSlide';
    } else {
      new Audio('assets/loseSound.wav').play();
      document.getElementById('lose').style.animationName = 'colorSlide';
    }
    setTimeout(() => {
      document.getElementById('win').style.animationName = 'none';
      document.getElementById('lose').style.animationName = 'none';
      document.getElementById('openingAnim').classList.remove('hidden');
      document.getElementById('textSlider').style.animationName = 'slideIn';
      document.getElementById('textSlider').style.animationDuration = '2s';
    }, 3000);
  }
}

class Level {
  constructor(cardCount, levelBanner) {
    this.cardCount = cardCount;
    this.cardsChecked = 0;
    this.cards = [];
  }

  start(colors) {
    this.colors = colors.slice(0, this.cardCount);
    this.generateCards();
    shuffle(this.colors);
    this.showColors();
    setTimeout(() => {
      this.flipAllCards();
    }, 1000);
    setTimeout(() => {
      this.flipAllCards();
    }, 3000);
    setTimeout(() => {
      for (const card of this.cards) {
        card.canFlip = true;
      }
    }, 6000);
  }

  generateCards() {
    for (let i = 0; i < this.cardCount; i++) {
      let newCard = new Card(this.colors[i], i);
      newCard.element.addEventListener('click', () => {
        if (newCard.canFlip) {
          newCard.canFlip = false;
          this.checkCard(newCard);
          this.cardsChecked++;
          newCard.flip();
        }
      });
      newCard.canFlip = false;
      this.cards.push(newCard);
    }
  }

  flipAllCards = () => {
    let leng = this.cards.length;
    for (let i = 0; i < leng; i++) {
      this.cards[i].flip();
    }
  };

  showColors() {
    let delay = 3.5;
    for (let i = 0; i < this.cardCount; i++) {
      let newColor = document.createElement('div');
      newColor.style.animationDelay = delay + 's';
      newColor.classList.add('color');
      newColor.style.backgroundColor = this.colors[i];
      document.querySelector('#slider').appendChild(newColor);
      delay += 0.35;
    }
  }

  checkCard(card) {
    if (card.color != this.colors[this.cardsChecked]) {
      game.endGame(false);
      this.clear();
    } else if (this.cardsChecked + 1 === this.cardCount) {
      game.nextLevel();
      this.clear();
    }
  }

  clear() {
    setTimeout(() => {
      this.flipAllCards();
    }, 1000);

    for (const card of this.cards) {
      card.discard();
    }
  }
}

class Card {
  constructor(color, cardNumber) {
    this.cardNumber = cardNumber;
    this.flipped = false;
    this.canFlip = true;
    this.color = color;
    this.img = `${color}Card.png`;
    this.x = '0%';
    this.y = '0%';
    this.render();
  }

  render = () => {
    this.element = document.createElement('div');
    this.element.style.backgroundImage = `url("assets/backCard.png")`;
    if (this.cardNumber % 2 !== 0) {
      this.x = '100%';
    }
    this.element.style.transform = `translateX(50%) translateY(50%)`;
    this.y = '0%';
    this.y = `${Math.floor(this.cardNumber / 2) * 100}%`;
    setTimeout(() => {
      this.element.style.transform = `translateX(${this.x}) translateY(${this.y})`;
    }, 100);
    this.element.classList.add('playingCard');
    document.querySelector('#cardsContainer').appendChild(this.element);
  };

  flip = () => {
    let background = '';
    if (this.flipped) {
      this.flipped = false;
      this.element.style.transform = `translateX(${this.x}) translateY(${this.y}) rotateY(0deg)`;
      background = 'url(assets/backCard.png)';
    } else {
      this.flipped = true;
      this.element.style.transform = `translateX(${this.x}) translateY(${this.y}) rotateY(180deg)`;
      background = `url(assets/${this.img})`;
    }
    setTimeout(() => {
      this.element.style.backgroundImage = background;
    }, 400);
    new Audio('assets/cardFlip.wav').play();
  };

  discard = () => {
    this.canFlip = false;
    setTimeout(() => {
      this.element.style.transform = `translateX(50%) translateY(50%) ${
        this.flipped ? 'rotateY(180deg)' : ''
      }`;
    }, 2000);
    setTimeout(() => {
      this.element.remove();
    }, 3000);
  };
}

function shuffle(array) {
  array.sort((a, b) => 0.5 - Math.random());
}

function startGame() {
  game = new Game(
    [new Level(1), new Level(2), new Level(3), new Level(4)],
    ['blue', 'red', 'yellow', 'green']
  );
}
