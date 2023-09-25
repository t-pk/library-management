/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { UserSchema, sequelize } from './databases';
import { encryptPassword } from '../renderer/utils/authenticate';
import { createDocument, getDocuments } from './databases/logic/document';
import { createAuthor, getAuthors } from './databases/logic/author';
import { createPublisher, getPublishers } from './databases/logic/publisher';
import { getDocumentTypes } from './databases/logic/document-type';
import { getReaderTypes } from './databases/logic/reader-type';
import { createReader, getReaders } from './databases/logic/reader';
import { createBorrower, getBorrowers } from './databases/logic/borrower';
import { getBorrowerDetail } from './databases/logic/borrower-detail';
import { createReturn, getReturns } from './databases/logic/return';

sequelize.authenticate();
sequelize.sync({ force: false }).then((res) => {
  sequelize.query(`INSERT INTO public.users
(id, username, "password", email, phone_number, status, "position", created_at, created_by, updated_at, updated_by)
VALUES(6, 'admin', 'c9e9c18a2d3cc1af154d08be8b13929cc6f6d84afdb477524c52c8f0ae8597e92421426efdde90820655e2191034d0d6a13201eb50d35a72e471861e55926609', 'lawndjkw@gmail.com', '12312124', false, '123', '2023-09-14 02:03:15.850', 6, '2023-09-14 02:03:15.850', 6);
`);
  sequelize.query(`INSERT INTO reader_types ("id","name", status, created_at, updated_at) VALUES(1,'Sinh Viên', true, '2023-09-21 00:13:56.237', '2023-09-21 00:13:56.237');
INSERT INTO reader_types (2,"name", status, created_at, updated_at) VALUES('Cán Bộ - Nhân Viên', true, '2023-09-21 00:14:14.005', '2023-09-21 00:14:14.005');`);

});

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
    let result;
    const data = arg.data || {};
    await getUserId();
    if (arg.key.includes('create') || arg.key.includes('update')) {

      const userId = await getUserId();

      if (arg.key.includes('create')) {
        data.createdBy = userId;
      }
      data.updatedBy = userId;
    }
    console.log(arg);
    switch (arg.key) {
      case 'user-login':
        const password = encryptPassword(data.password);
        result = await UserSchema.findOne({ where: { username: data.username, password }, raw: true, attributes: ['id', 'username', 'position'] });
        break;
      case 'document-search':
        result = await getDocuments(data);
        break;
      case 'document-create':
        result = await createDocument(data);
        break;
      case 'author-create':
        result = await createAuthor(data);
        break;
      case 'author-search':
        result = await getAuthors(data);
        break;
      case 'publisher-create':
        result = await createPublisher(data);
        break;
      case 'publisher-search':
        result = await getPublishers(data);
        break;
      case 'documentType-search':
        result = await getDocumentTypes(data);
        break;
      case 'readerType-search':
        result = await getReaderTypes(data);
        break;
      case 'reader-create':
        result = await createReader(data);
        break;
      case 'reader-search':
        result = await getReaders(data);
        break;
      case 'borrower-create':
        result = await createBorrower(data);
        break;
      case 'borrower-search':
        result = await getBorrowers(data);
        break;
      case 'borrowerDetail-search':
        result = await getBorrowerDetail(data);
        break;
      case 'return-create':
        result = await createReturn(data);
        break;
      case 'return-search':
        result = await getReturns(data);
        break;

      default:
        break
    }
    // console.log(result);
    event.reply('ipc-database', { key: arg.key, data: result });
  } catch (error) {
    console.log("JSON.stringify(error)", error);
    event.reply('ipc-database', { error: JSON.stringify(error) });
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

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

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1377,
    minHeight: 1000,
    minWidth: 1377,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
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


export const getUserId = () => {
  return (mainWindow as BrowserWindow).webContents
    .executeJavaScript('localStorage.getItem("TOKEN_KEY");', true)
    .then(result => {
      return JSON.parse(result || `{}`).id || 0;
    });
}
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
