const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));
    mainWindow.webContents.openDevTools();

    // 监听来自渲染进程的消息
    ipcMain.on('to-main', (event, message) => {
        console.log('c2e:', message);
        console.log("e2c:", message);
        mainWindow.webContents.send('from-main', 'e2c: ' + message);
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});