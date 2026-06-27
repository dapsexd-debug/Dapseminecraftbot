const mineflayer = require('mineflayer')

function createBot() {
  const bot = mineflayer.createBot({
    host: 'robbymc.usga.me',
    username: 'FrancescoDap',
    version: '1.21.4'
  })

  bot.on('spawn', () => {
    console.log('Bot berhasil join server!')

    setTimeout(() => {
      bot.chat(`/login ${process.env.PASSWORD}`)
    }, 2000)

    setInterval(() => {
      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 500)
    }, 30000)
  })

  bot.on('message', (message) => {
    const msg = message.toString().toLowerCase()

    if (msg.includes('register') || msg.includes('registrasi')) {
      setTimeout(() => {
        bot.chat(`/registrasi ${process.env.PASSWORD}`)
        console.log('Bot melakukan registrasi')
      }, 1000)
    }

    if (msg.includes('login') || msg.includes('masuk')) {
      setTimeout(() => {
        bot.chat(`/login ${process.env.PASSWORD}`)
        console.log('Bot melakukan login')
      }, 1000)
    }
  })

  bot.on('kicked', (reason) => {
    console.log('Kicked:', reason)
    setTimeout(createBot, 15000)
  })

  bot.on('end', () => {
    console.log('Disconnected, reconnecting...')
    setTimeout(createBot, 15000)
  })

  bot.on('error', (err) => {
    console.log('Error:', err)
    setTimeout(createBot, 15000)
  })
}

createBot()
