import { useState, useEffect } from 'react';
import { Layout, Menu, Spin, theme, message, notification } from 'antd';
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import backgroundUrl from '../assets/background.svg';
const { Header, Content, Sider } = Layout;
import './ui.scss';

const PrivateLayout = ({ element: Component }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState(['/']);
  const [spinning, setSpinning] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [animate, setAnimate] = useState('/document/search');
  const widthStyle = { minWidth: '32%' };

  const formItemLayout = {
    labelCol: { xs: { span: 30 }, sm: { span: 30 } },
    wrapperCol: { xs: { span: 40 }, sm: { span: 23 } },
  };

  const tailFormItemLayout = { wrapperCol: { xs: { span: 40, offset: 0 }, sm: { span: 30, offset: 0 } } };

  useEffect(() => {
    console.log('asdsa', location);
    setAnimate(location.pathname === '/' ? '/document/search' : location.pathname);

    const keyPath = '/' + location.pathname.split('/')[1];
    const keyAdmin = openKeys.find((key) => key === keyPath);

    if (!keyAdmin) {
      const keys = openKeys.map((key) => key).concat(keyPath);
      setOpenKeys(keys);
    }
    setSpinning(true);
    setTimeout(() => setSpinning(false), 50);
  }, [location]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  function getItem(label, key, icon, children) {
    return { key, icon, children, label };
  }
  const items = [
    getItem('Tài Liệu', '/', <MailOutlined />, [
      getItem('Tìm Kiếm', '/document/search'),
      getItem('Thêm - Cập Nhật', '/document/create'),
      getItem('Yêu Cầu Tài Liệu', '/document/request'),
    ]),
    getItem('Độc Giả', '/reader', <AppstoreOutlined />, [getItem('Tìm Kiếm', '/reader/search'), getItem('Thêm - Cập Nhật', '/reader/create')]),

    getItem('Phiếu mượn', '/borrow', <AppstoreOutlined />, [getItem('Tìm Kiếm', '/borrow/search'), getItem('Thêm Mới', '/borrow/create')]),
    getItem('Phiếu Trả', '/return', <AppstoreOutlined />, [getItem('Tìm Kiếm', '/return/search'), getItem('Thêm Mới', '/return/create')]),
    getItem('Phiếu Nhắc Nhở', '/remind', <AppstoreOutlined />, [getItem('Tìm Kiếm', '/remind/search'), getItem('Thêm Mới', '/remind/create')]),
    getItem('Phiếu Phạt', '/penalty', <AppstoreOutlined />, [getItem('Tìm Kiếm', '/penalty/search'), getItem('Thêm - Cập Nhật', '/penalty/create')]),
    getItem('Tác Giả', '/author', <AppstoreOutlined />, [getItem('Tìm Kiếm', '/author/search'), getItem('Thêm - Cập Nhật', '/author/create')]),
    getItem('Nhà Xuất Bản', '/publisher', <AppstoreOutlined />, [getItem('Tìm Kiếm', '/publisher/search'), getItem('Thêm - Cập Nhật', '/publisher/create')]),
  ];

  const onOpenChange = (e) => {
    const keys = e.slice(-3);
    setOpenKeys(keys);
  };

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
      else openNotification('error', arg.error);
    });
  };

  const listenOnce = async (key, callback) => {
    window.electron.ipcRenderer.once('ipc-database', async (arg) => {
      console.log(arg);
      if (arg && arg.key === key) await callback(arg);
      if (!arg || arg.error) openNotification('error', arg.error);
    });
  };

  return localStorage.getItem('TOKEN_KEY') ? (
    <>
      <img className="logo-login" src={backgroundUrl} style={{ width: '100%', position: 'absolute' }} alt="icon"></img>
      <Layout>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div className="logo-icon">
            <h4 style={{ textAlign: 'center', color: 'white' }}>Library Management</h4>
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

          <Spin spinning={spinning} wrapperClassName={`${animate == location.pathname ? 'my-animation' : ''}`}>
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
                widthStyle={widthStyle}
                formItemLayout={formItemLayout}
                tailFormItemLayout={tailFormItemLayout}
                listenOn={listenOn}
                callDatabase={callDatabase}
                listenOnce={listenOnce}
                openNotification={openNotification}
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

export default PrivateLayout;
