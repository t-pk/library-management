import React, { useState, useEffect } from 'react';
import { Button, Layout, Menu, Space, Spin, theme, message } from 'antd';
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';

import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { internalCall } from '../actions';
import backgroundUrl from '../assets/background.svg';
const { Header, Content, Sider } = Layout;
import './css.css';

const PrivateLayout = ({ element: Component }) => {
  const [animate, setAnimate] = useState('/document/search');
  const [openKeys, setOpenKeys] = useState(['/']);
  const [spinning, setSpinning] = useState(false);
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(
      location.pathname === '/' ? '/document/search' : location.pathname
    );
    console.log('location.pathname', location.pathname);
    const keyPath = '/' + location.pathname.split('/')[1];
    const keyAdmin = openKeys.find((key) => key === keyPath);
    console.log({ keyAdmin });
    if (!keyAdmin) {
      const keys = openKeys.map((key) => key).concat(keyPath);
      setOpenKeys(keys);
    }
    console.log(openKeys);
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
    }, 50);
  }, [location]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  const items = [
    getItem('Tài Liệu', '/', <MailOutlined />, [
      getItem('Tìm Kiếm', '/document/search'),
      getItem('Thêm Mới', '/document/create'),
      getItem('Yêu Cầu Tài Liệu', '/document/request'),
    ]),
    getItem('Độc Giả', '/reader', <AppstoreOutlined />, [
      getItem('Tìm Kiếm', '/reader/search'),
      getItem('Thêm Mới', '/reader/create'),
    ]),

    getItem('Phiếu mượn', '/borrow', <AppstoreOutlined />, [
      getItem('Tìm Kiếm', '/borrow/search'),
      getItem('Thêm Mới', '/borrow/create'),
    ]),
    getItem('Phiếu Trả', '/return', <AppstoreOutlined />, [
      getItem('Tìm Kiếm', '/return/search'),
      getItem('Thêm Mới', '/return/create'),
    ]),
    getItem('Phiếu Nhắc Nhở', '/remind', <AppstoreOutlined />, [
      getItem('Tìm Kiếm', '/remind/search'),
      getItem('Thêm Mới', '/remind/create'),
    ]),
    getItem('Phiếu Phạt', '/penalty', <AppstoreOutlined />, [
      getItem('Tìm Kiếm', '/penalty/search'),
      getItem('Thêm Mới', '/penalty/create'),
    ]),
    getItem('Tác Giả', '/author', <AppstoreOutlined />, [
      getItem('Tìm Kiếm', '/author/search'),
      getItem('Thêm Mới', '/author/create'),
    ]),
    getItem('Nhà Xuất Bản', '/publisher', <AppstoreOutlined />, [
      getItem('Tìm Kiếm', '/publisher/search'),
      getItem('Thêm Mới', '/publisher/create'),
    ]),
  ];

  const onOpenChange = (e) => {
    setOpenKeys(e);
  };

  const showMessage = (type, content) => {
    console.log('content', content);
    messageApi.open({
      key: '1',
      type: 'success',
      content: content,
      duration: 5,
      className: 'custom-class',
      // style: {
      //   textAlign: 'right',
      //   paddingRight: 20,
      //   marginTop: '47%',
      // },
    });
  };

  /**
   *
   * @param {*} params {key: string, data: {}}
   */
  const callDatabase = (params) => {
    internalCall(params);
  };

  const listenOn = async (key, callback) => {
    window.electron.ipcRenderer.on('ipc-database', async (arg) => {
      if (arg && arg.key === key) await callback(arg);
      else {
        showMessage('error', arg.error);
      }
    });
  };

  const listenOnce = async (key, callback) => {
    window.electron.ipcRenderer.once('ipc-database', async (arg) => {
      console.log('window.electron.ipcRenderer', arg);
      if (!arg || arg.error) showMessage('error', arg.error);
      await callback(arg);
    });
  };

  return localStorage.getItem('TOKEN_KEY') ? (
    <>
      <img
        className="logo-login"
        src={backgroundUrl}
        style={{ width: '100%', position: 'absolute' }}
        alt="icon"
      ></img>
      <Layout>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div className="logo-icon">
            <h4 style={{ textAlign: 'center', color: 'white' }}>
              Library Management
            </h4>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={animate}
            defaultOpenKeys={openKeys}
            items={items}
            openKeys={openKeys}
            selectedKeys={animate}
            onOpenChange={onOpenChange}
            onClick={({ key }) => {
              navigate(key);
            }}
          />
        </Sider>

        <Layout>
          <Header
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          />

          <Spin
            spinning={spinning}
            wrapperClassName={`${
              animate == location.pathname ? 'my-animation' : ''
            }`}
          >
            {contextHolder}
            <Content
              style={{
                padding: 15,
                margin: 15,
                minHeight: 850,
                background: colorBgContainer,
              }}
            >
              <Component
                listenOn={listenOn}
                callDatabase={callDatabase}
                listenOnce={listenOnce}
              />
            </Content>
          </Spin>
        </Layout>
      </Layout>
    </>
  ) : (
    <Navigate to={'/login'} />
  );
};

// PrivateLayout.propTypes = {
//   element: PropTypes.elementType.isRequired,
//   layout: PropTypes.elementType.isRequired,
//   exact: PropTypes.bool.isRequired,
//   path: PropTypes.string.isRequired,
// };

export default PrivateLayout;
