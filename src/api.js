const API_KEY = '70bda199b9bef647ccedc1ddb2b56dc69023f72e9dc2101f33bb58f56bd4f793'

const tickersHandlers = new Map()

const loadTickers = () => {

  if (tickersHandlers.size === 0) {
    return
  }

  fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()].join(',')}&tsyms=USD&api_key=${API_KEY}`)
    .then(r => r.json()).then(rawData => {
    const updatedPrices = Object.fromEntries(
      Object.entries(rawData).map(([key, value]) => [key, value['USD']])
    )

    Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
      const handlers = tickersHandlers.get(currency) ?? []
      handlers.forEach(fn => fn(newPrice))
    })
  })
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || []
  tickersHandlers.set(ticker, [...subscribers, cb])
}

export const unsubscribeFromTicker = ticker => {
  tickersHandlers.delete(ticker)
}

setInterval(loadTickers, 5000)

window.tickers = tickersHandlers
