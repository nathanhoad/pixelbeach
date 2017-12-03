const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const url = require('url');
const Resolution = require('./resolution');

let mainWindow;

function createWindow() {
  const { width, height } = Resolution.getWindowSize();

  mainWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    backgroundColor: '#000',
    resizable: false,
    fullscreen: true,
    // kiosk: true, // This is a good way to go full screen but removes the title bar
    webPreferences: {
      devTools: true
    }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});
