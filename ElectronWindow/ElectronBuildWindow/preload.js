const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
    sendToMain: (message) => ipcRenderer.send('to-main', message),
    onFromMain: (callback) => ipcRenderer.on('from-main', callback)
});