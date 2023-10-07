import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { handleData, sequelize } from './databases';

sequelize.authenticate();
sequelize.sync({ force: false });

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-database', async (event, arg) => {
  try {
    const data = arg.data || {};
    if (arg.key.includes('create') || arg.key.includes('update')) {
      const userId = await getUserId();
      if (arg.key.includes('create')) {
        data.createdBy = userId;
      }
      data.updatedBy = userId;
    }

    const result = await handleData(arg, data);
    event.reply('ipc-database', { key: arg.key, data: result });
  } catch (error) {
    event.reply('ipc-database', { key: arg.key, error: JSON.stringify(error) });
  }
});

ipcMain.handle('invoke-database', async (channel, arg) => {
  try {
    const data = arg.data || {};
    if (arg.key.includes('create') || arg.key.includes('update')) {
      const userId = await getUserId();
      if (arg.key.includes('create')) {
        data.createdBy = userId;
      }
      data.updatedBy = userId;
    }
    const result = await handleData(arg, data);
    return { key: arg.key, data: result };
  } catch (error) {
    return { key: arg.key, error: JSON.stringify(error) };
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets') : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1377,
    minHeight: 900,
    minWidth: 1377,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged ? path.join(__dirname, 'preload.js') : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

const getUserId = async () => {
  return (mainWindow as BrowserWindow).webContents.executeJavaScript('localStorage.getItem("TOKEN_KEY");', true).then((result) => {
    return JSON.parse(result || `{}`).id || 0;
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
