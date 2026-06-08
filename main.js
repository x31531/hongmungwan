const { app, BrowserWindow, Tray, nativeImage } = require('electron');
const path = require('path');

let tray = null;
let win = null;

app.dock.hide(); // 독에서 숨김

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'LOGO2.png'));
  const resized = icon.resize({ width: 18, height: 18 });
  resized.setTemplateImage(true);
  tray = new Tray(resized);
  tray.setToolTip('홍문관');

  tray.on('click', (event, bounds) => {
    if (win && win.isVisible()) {
      win.hide();
    } else {
      showWindow(bounds);
    }
  });
}

function createWindow() {
  win = new BrowserWindow({
    width: 420,
    height: 700,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
  });

  win.loadFile(path.join(__dirname, 'index.html'));

  win.on('blur', () => {
    win.hide();
  });
}

function showWindow(trayBounds) {
  const x = Math.round(trayBounds.x - 420 / 2 + trayBounds.width / 2);
  const y = trayBounds.y + trayBounds.height + 4;
  win.setPosition(x, y, false);
  win.show();
}

app.whenReady().then(() => {
  createTray();
  createWindow();
});

app.on('window-all-closed', () => {});