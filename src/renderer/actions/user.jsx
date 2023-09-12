

export const internalCall = (params) => {
  console.log(params);
  window.electron.ipcRenderer.sendMessage('ipc-database', params);
}

