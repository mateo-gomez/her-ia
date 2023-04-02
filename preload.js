const { contextBridge, ipcRenderer } = require('electron')

const electronAPI = {
  askGPT: async (userMessage, prevConversation = []) =>
    await ipcRenderer.invoke('askGPT', userMessage, prevConversation),
  whisper: async (blob) => await ipcRenderer.invoke('whisper', blob),
  textToSpeechIA: async (text) =>
    await ipcRenderer.invoke('textToSpeechIA', text),
  textToSpeech: async (text) => await ipcRenderer.invoke('textToSpeech', text)
}

process.on('loaded', () => {
  contextBridge.exposeInMainWorld('electronAPI', electronAPI)
})
