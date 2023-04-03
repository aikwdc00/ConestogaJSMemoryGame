const storage = {
  getSessionStorage() {
    return sessionStorage.getItem(`playerInfo`)
  },
  setSessionStorage() {
    sessionStorage.setItem(`playerInfo`, JSON.stringify({
      PlayerName: settings.PlayerName,
      NumberOfCards: settings.NumberOfCards,
    }))
  },
  getLocalStorage() {
    return localStorage.getItem(`playerScore_${settings.PlayerName}`)
  },
  setLocalStorage(param) {
    // store data to storage
    localStorage.setItem(`playerScore_${settings.PlayerName}`, JSON.stringify({
      PlayerName: settings.PlayerName,
      HighScore: settings.HighScore,
    }))

    if (param == 'finishGame') return
    settings.getSetting()
  },
}