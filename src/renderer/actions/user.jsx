

export const internalCall = (params) => {
  window.electron.ipcRenderer.sendMessage('ipc-database', params);
}

