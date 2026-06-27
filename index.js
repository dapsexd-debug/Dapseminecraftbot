const mineflayer = require('mineflayer')

let retryCount = 0
const maxRetry = 5

function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function createBot() {
  if (retryCount >= maxRetry) {
    console.log('Terlalu banyak gagal, bot berhenti. Restart manual diperlukan.')
    return
  }

  const bot = mineflayer.createBot({
    host: 'robbymc.usga.me',
    username: 'FrancescoDap',
    version: false
  })

  bot.on('spawn', () => {
    console.log('Bot berhasil join server!')
    retryCount = 0 // Reset retry jika berhasil join

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

  bot.on('kicked', (reason) => {
    console.log('Kicked:', reason)
    retryCount++
    const delay = randomDelay(180000, 300000) // 3-5 menit
    console.log(`Retry ke-${retryCount}, reconnect dalam ${delay/1000} detik...`)
    setTimeout(createBot, delay)
  })

  bot.on('end', () => {
    console.log('Disconnected, reconnecting...')
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
