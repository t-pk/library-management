

export const internalCall = (params) => {
  window.electron.ipcRenderer.sendMessage('ipc-database', params);
}

export const delay = (t) => {
  return new Promise(resolve => setTimeout(resolve, t));
}