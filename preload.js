const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('versiones', {})
