const path = require('node:path')
const { app, BrowserWindow, session, ipcMain } = require('electron')
const { askGPT, whisper } = require('./services/openai')
const { textToSpeechIA } = require('./services/playht')
const { textToSpeech } = require('./services/tts')

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
})

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const opts = {
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'none'; script-src 'self'; style-src-elem 'self'; img-src 'self'; media-src https://media.play.ht blob:; connect-src 'self' https://api.openai.com https://voicerss-text-to-speech.p.rapidapi.com/ https://media.play.ht https://play.ht/api/v1/"
        ]
      }
    }

    callback(opts)
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  ipcMain.handle('whisper', whisper)
  ipcMain.handle('askGPT', askGPT)
  ipcMain.handle('textToSpeechIA', textToSpeechIA)
  ipcMain.handle('textToSpeech', textToSpeech)

  createWindow()
})
