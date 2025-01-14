import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';

const isDev = process.env.NODE_ENV === 'dev';
console.log(`isDev:${isDev}`)
import { initializeIpc } from '../backend/ipc'

async function createWindow() {
  // if (isDev) {
    // await import('../backend/socketio.mjs') // socket.io listeners
  // }
  //const { initializeIpc } = await import('../backend/ipc.mts', { assert: { type: "module" } }) // ipc listener
  await initializeIpc(ipcMain)

  // Create the browser window.
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js") // use a preload script
    },

  });

  if (isDev) {
    const devServerUri = 'http://localhost:3000'
    console.log(`load devServer uri:${devServerUri}`)
    await win.loadURL(devServerUri);
  } else {
    const fn = path.resolve(__dirname, '..', '..', 'build', 'index.html')
    console.log(`open file index ${fn}`)
    await win.loadFile(fn)
  }

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
  
  let cnt =0;
  // setInterval(() => {
  //   cnt++;
  //   win.webContents.send('data', { cnt });
  // }, 1000)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
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