const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
};

/** 
    @param {string} currentState 
    @param {array} newCardArray 
    @param {array}  afterArrangeCardList
*/
const cardsContainer = $("#cards")
const cardsController = {
  currentState: GAME_STATE.FirstCardAwaits,
  newCardArray: [],
  afterArrangeCardList: [],
  init() {
    cardsContainer.currentState = GAME_STATE.FirstCardAwaits
    cardsContainer.children().detach()
    cardsController.newCardArray = []
    cardsController.afterArrangeCardList = []
  },
  getRandom() {
    return Math.floor(Math.random() * cards.length);
  },
  filterData(index) {
    return this.newCardArray.filter((item) => item.id == cards[index].id);
  },
  getCardRandomList() {
    let index = this.getRandom();
    const filterResult = this.filterData(index);
    // if get the same id , re-random new
    filterResult.length
      ? this.getCardRandomList()
      : this.newCardArray.push(cards[index]);
  },
  createNewCardList() {
    const copyCardArr = JSON.parse(JSON.stringify(this.newCardArray)).concat(this.newCardArray)
    copyCardArr.forEach((item, index) => item.id = index + 1)

    // random card position
    for (let index = copyCardArr.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1));
      [copyCardArr[index], copyCardArr[randomIndex]] = [
        copyCardArr[randomIndex],
        copyCardArr[index],
      ];
    }

    return copyCardArr;
  },
  renderCard() {
    this.init()

    const cardNumbers = settings.NumberOfCards / 2;

    for (let i = 0; i < cardNumbers; i++) {
      this.getCardRandomList();
    }

    const memoryCardList = this.createNewCardList();
    this.afterArrangeCardList = memoryCardList;

    let cardHTML = ``;

    if (settings.PlayerName) {
      memoryCardList.map(
        (item) =>
        (cardHTML += `<a href=# id=${item.id} class="memoryCard back" data-id=${item.name}>
              <img id=${item.name}  class="" src=${item.img} alt="" />
            </a>`)
      );

      cardsContainer.append(cardHTML);
    } else {
      cardsContainer.append(`<div>Please set your game setting first and click new Game</div>`);
    }
  },
  flipCard(current) {
    // flip card
    if ($(current).hasClass("back")) {
      $(current).removeClass("back");
      $(current).children(".memoryCard img").addClass("show");
    } else {
      $(current).addClass("back");
      $(current).children(".memoryCard img").removeClass("show");
    }
  },
  dispatchCardAction(card) {
    console.log('card', card)
    console.log('card111', card.id)
    if (!$(card).hasClass("back")) return;

    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        this.flipCard(card);

        model.revealedCards.push(card);
        this.currentState = GAME_STATE.SecondCardAwaits;
        break;

      case GAME_STATE.SecondCardAwaits:

        // avoid duplicate click
        if (GAME_STATE.SecondCardAwaits == 'SecondCardAwaits' && model.revealedCards.length === 2) return

        // record tried times
        model.triedTimes += 1;

        this.flipCard(card);
        model.revealedCards.push(card);

        // check match result
        setTimeout(() => {
          if (model.isRevealedCardsMatched()) {
            // match success
            model.Correct += 1;
            settings.setCorrectness(model.Correct, model.triedTimes);
            cardsController.pairCards();

            this.currentState = GAME_STATE.FirstCardAwaits;
          } else {
            // match failed
            cardsController.resetCards();
          }
        }, 1000);
        break;
    }

    // console.log('this.currentState', this.currentState)
    // console.log('model.revealedCards', model.revealedCards)
  },
  pairCards() {
    this.currentState = GAME_STATE.CardsMatched;
    model.revealedCards.map((i) => $(i).addClass("hide"));
    model.leaveCards -= model.revealedCards.length;
    model.revealedCards = [];

    if (model.leaveCards === 0) {
      settings.setHighScore(settings.Correctness);
      this.setPrompt()
    }
  },
  resetCards() {
    this.currentState = GAME_STATE.CardsMatchFailed;
    model.revealedCards.map((i) => cardsController.flipCard(i));
    model.revealedCards = [];
    cardsController.currentState = GAME_STATE.FirstCardAwaits;
  },
  setPrompt() {
    this.init()
    cardsContainer.append(`<div class="thanks">Thank you! <br /> Click "New Game" to start new a round!!</div>`);

    // const question = window.prompt('Would you want a again? (yes / no)')
    // if (question == 'yes') {
    //   window.location.reload()
    // } else {
    //   this.init()
    //   cardsContainer.append(`<div class="thanks">Thank you! <br /> If you wanna start a game, <br /> please click "New Game"</div>`);
    // }
  }
};

/** 
    @param {number} leaveCards is leave cards length;
    @param {number} Correct is correct times;
    @param {number} triedTimes is tried times;
*/
const model = {
  revealedCards: [],
  isRevealedCardsMatched() {
    return this.revealedCards[0].dataset.id === this.revealedCards[1].dataset.id;
  },
  leaveCards: 0,
  Correct: 0,
  triedTimes: 0,
};
