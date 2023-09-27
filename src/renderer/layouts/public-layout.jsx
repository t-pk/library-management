import { notification } from 'antd';
import './ui.scss';

const PublicLayout = ({ element: Component }) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, description) => {
    api[type]({
      message: `Notification ${type}`,
      description: description,
      duration: 6,
    });
  };

  /**
   * @param {*} params {key: string, data: {}}
   */
  const callDatabase = (params) => {
    window.electron.ipcRenderer.sendMessage('ipc-database', params);
  };

  const listenOn = async (callback) => {
    window.electron.ipcRenderer.on('ipc-database', async (arg) => {
      if (arg && arg.data) await callback(arg);
      if (!arg || arg.error) openNotification('error', arg.error);
    });
  };

  const listenOnce = async (key, callback) => {
    window.electron.ipcRenderer.once('ipc-database', async (arg) => {
      if (arg && arg.key === key) await callback(arg);
      if (!arg || arg.error) openNotification('error', arg.error);
    });
  };
  return (
    <>
      {contextHolder}
      <Component listenOn={listenOn} callDatabase={callDatabase} listenOnce={listenOnce} openNotification={openNotification} />
    </>
  );
};
export default PublicLayout;
