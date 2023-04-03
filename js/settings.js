const playerName = $('#player_name')
const card_numbers = $('#num_cards')
const player = $('#player')
const high_score = $('#high_score')

/** 
  @param {string} PlayerName 
  @param {number} NumberOfCards 
  @param {string} HighScore 
  @param {string} Correctness 
*/
const settings = {
  PlayerName: '',
  NumberOfCards: $('#num_cards').val(),
  HighScore: 0,
  Correctness: '',
  setPlayerName(name) {
    return this.PlayerName = name
  },
  setNumberOfCards(num) {
    return this.NumberOfCards = num
  },
  setCorrectness(win, lose) {
    this.Correctness = parseInt((win / lose) * 100)
    $('#correct').text(`Correct: ${this.Correctness}%`)
  },
  setHighScore(score) {
    if (score > settings.HighScore) {
      settings.HighScore = score > settings.HighScore ? +score : +settings.HighScore
      high_score.text(`High score: ${settings.HighScore}%`)
      storage.setLocalStorage(this.PlayerName)
    }
  },
  getSetting() {
    const playerInfo = storage.getSessionStorage()

    if (playerInfo) {
      const { PlayerName, NumberOfCards } = JSON.parse(playerInfo)

      this.setPlayerName(PlayerName)
      this.setNumberOfCards(NumberOfCards)
      player.text(`Player: ${settings.PlayerName}`)
      card_numbers.val(settings.NumberOfCards)

      // player score
      const playerScore = JSON.parse(storage.getLocalStorage())

      if (playerScore) {
        this.HighScore = playerScore?.PlayerName === PlayerName ? playerScore.HighScore : 0
        high_score.text(`High score: ${playerScore.HighScore}%`)
      }

      model.leaveCards = this.NumberOfCards
    }

    cardsController.renderCard()
  },
  saveSetting() {
    // if Player Name is empty, return alert
    if (!playerName.val()) {
      alert(`Please Enter Player Name`)
      return
    }

    settings.setPlayerName(playerName.val())
    settings.setNumberOfCards(card_numbers.val())
    storage.setSessionStorage()
    // settings.getSetting()
    setTimeout(() => window.location.reload(), 500)
  },
}