// main.js (chạy trong main process của Electron)
import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // nếu bạn có file preload
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  win.loadURL('http://localhost:3000'); // Thay thế bằng đường dẫn dev server Vite
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
})
