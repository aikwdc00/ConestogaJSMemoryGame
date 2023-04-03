const cards = []

const createCards = () => {
  for (let i = 1; i < 25; i++) {
    cards.push({
      name: `card_${i}`,
      img: `../images/card_${i}.png`,
      id: i,
    })
  }
}