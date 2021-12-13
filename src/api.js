const API_KEY = '70bda199b9bef647ccedc1ddb2b56dc69023f72e9dc2101f33bb58f56bd4f793'

const tickers = new Map()

// TODO: refactor to use URLSearchParams
const loadTickers = () => {

  if (tickers.size === 0) {
    return
  }

  fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickers].keys().join(',')}&tsyms=USD&api_key=${API_KEY}`)
    .then(r => r.json()).then(rawData => Object.fromEntries(Object.entries(rawData).map(
    ([key, value]) => [key, value.USD]
  )))
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = ticker.get(ticker) || []
  tickers.set(ticker, [...subscribers, cb])
}

export const unsubscribeFromTicker = (ticker, cb) => {
  const subscribers = ticker.get(ticker) || []
  tickers.set(ticker, subscribers.filter(fn => fn !== cb))
}

setInterval(loadTickers, 5000)

window.tickers = tickers
