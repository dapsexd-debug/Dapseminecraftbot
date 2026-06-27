const mineflayer = require('mineflayer')

let retryCount = 0
const maxRetry = 5

function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function createBot() {
  if (retryCount >= maxRetry) {
    console.log('Terlalu banyak gagal, bot berhenti.')
    return
  }

  const bot = mineflayer.createBot({
    host: 'mineshive.id',
    username: 'FrancescoDap',
    version: false,
    hideErrors: false
  })

  bot.on('login', () => {
    const socket = bot._client.socket
    console.log(`Logged in to ${socket.server || socket._host}`)
    retryCount = 0

    setTimeout(() => {
      bot.chat(`/login ${process.env.PASSWORD}`)
    }, randomDelay(10000, 15000))

    setInterval(() => {
      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 500)
    }, randomDelay(25000, 35000))
  })

  bot.on('message', (message) => {
    const msg = message.toString().toLowerCase()

    if (msg.includes('register') || msg.includes('registrasi')) {
      setTimeout(() => {
        bot.chat(`/registrasi ${process.env.PASSWORD}`)
        console.log('Bot melakukan registrasi')
      }, randomDelay(2000, 4000))
    }

    if (msg.includes('login') || msg.includes('masuk')) {
      setTimeout(() => {
        bot.chat(`/login ${process.env.PASSWORD}`)
        console.log('Bot melakukan login')
      }, randomDelay(2000, 4000))
    }
  })

  bot.on('kicked', (reason, loggedIn) => {
    if (loggedIn) {
      console.log(`Kicked from server: ${reason}`)
    } else {
      console.log(`Kicked whilst trying to connect: ${reason}`)
    }
    retryCount++
    const delay = randomDelay(180000, 300000)
    console.log(`Retry ke-${retryCount}, reconnect dalam ${delay/1000} detik...`)
    setTimeout(createBot, delay)
  })

  bot.on('end', (reason) => {
    console.log(`Disconnected: ${reason}`)
    retryCount++
    setTimeout(createBot, randomDelay(180000, 300000))
  })

  bot.on('error', (err) => {
    console.log('Error:', err)
    retryCount++
    setTimeout(createBot, randomDelay(180000, 300000))
  })
}

createBot()
