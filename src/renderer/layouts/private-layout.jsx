import { useState, useEffect } from 'react';
import { Layout, Menu, Spin, theme, notification, Dropdown, Space, Modal, Descriptions, Button } from 'antd';
import {
  AppstoreOutlined,
  BookOutlined,
  CaretDownFilled,
  FileSearchOutlined,
  FileExcelOutlined,
  FileDoneOutlined,
  FileExclamationOutlined,
  FileAddOutlined,
  FileProtectOutlined,
  AppstoreAddOutlined,
  UsergroupAddOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import backgroundUrl from '../assets/background.svg';
const { Header, Content, Sider, Footer } = Layout;
import { getUser } from '../utils/helper';
import './ui.scss';

const PrivateLayout = ({ element: Component }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState(['/']);
  const [spinning, setSpinning] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [animate, setAnimate] = useState('/document/search');
  const widthStyle = { minWidth: '32%' };
  const [openModal, setOpenModal] = useState(false);

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
    getItem('Tài Liệu', '/', <BookOutlined />, [
      getItem('Tìm Kiếm', '/document/search', <FileSearchOutlined />),
      getItem('Thêm - Sửa', '/document/create', <FileAddOutlined />),
      getItem('Yêu Cầu', '/document/request', <AppstoreAddOutlined />),
    ]),
    getItem('Độc Giả', '/reader', <UsergroupAddOutlined />, [
      getItem('Tìm Kiếm', '/reader/search', <UserSwitchOutlined />),
      getItem('Thêm - Sửa', '/reader/create', <UserAddOutlined />),
    ]),

    getItem('Phiếu mượn', '/borrow', <FileProtectOutlined />, [
      getItem('Tìm Kiếm', '/borrow/search', <FileSearchOutlined />),
      getItem('Thêm Mới', '/borrow/create', <FileAddOutlined />),
    ]),
    getItem('Phiếu Trả', '/return', <FileDoneOutlined />, [
      getItem('Tìm Kiếm', '/return/search', <FileSearchOutlined />),
      getItem('Thêm Mới', '/return/create', <FileAddOutlined />),
    ]),
    getItem('Phiếu Nhắc Nhở', '/remind', <FileExclamationOutlined />, [
      getItem('Tìm Kiếm', '/remind/search', <FileSearchOutlined />),
      getItem('Thêm Mới', '/remind/create', <FileAddOutlined />),
    ]),
    getItem('Phiếu Phạt', '/penalty', <FileExcelOutlined />, [
      getItem('Tìm Kiếm', '/penalty/search', <FileSearchOutlined />),
      getItem('Thêm - Sửa', '/penalty/create', <FileAddOutlined />),
    ]),
    getItem('Tác Giả', '/author', <UsergroupAddOutlined />, [
      getItem('Tìm Kiếm', '/author/search', <UserSwitchOutlined />),
      getItem('Thêm - Sửa', '/author/create', <UserAddOutlined />),
    ]),
    getItem('Nhà Xuất Bản', '/publisher', <UsergroupAddOutlined />, [
      getItem('Tìm Kiếm', '/publisher/search', <UserSwitchOutlined />),
      getItem('Thêm - Sửa', '/publisher/create', <UserAddOutlined />),
    ]),
  ];

  const onOpenChange = (e) => {
    const keys = e.slice(-3);
    setOpenKeys(keys);
  };

  const openNotification = (type, description) => {
    api[type]({
      message: `${type.toLocaleUpperCase()} Notification`,
      description: description,
      duration: 6,
      key: description,
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
      else return openNotification('error', arg.error);
    });
  };

  const listenOnce = async (key, callback) => {
    window.electron.ipcRenderer.once('ipc-database', async (arg) => {
      if (arg && arg.key === key) await callback(arg);
      if (arg.key === key && (!arg || arg.error)) return openNotification('error', arg.error);
    });
  };

  const dropdownItems = [
    {
      key: '1',
      label: 'Thông tin cơ bản',
    },
    {
      key: '2',
      danger: true,
      label: 'Đăng xuất',
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key === '1') {
      return setOpenModal(true);
    }
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc là muốn đăng xuất?',
      onOk() {
        localStorage.clear();
        navigate('/login');
      },
    });
  };
  const handleStatusModal = () => {
    setOpenModal(!openModal);
  };
  const descriptionItems = [
    {
      key: '1',
      label: 'Id',
      children: getUser().id,
    },
    {
      key: '2',
      label: 'Username',
      children: getUser().username,
    },
    {
      key: '3',
      label: 'Họ và tên',
      children: getUser().fullName,
    },
    {
      key: '4',
      label: 'Chức Vụ',
      children: getUser().position,
    },
    {
      key: '5',
      label: 'Số điện thoại',
      children: getUser().phoneNumber,
    },
    {
      key: '6',
      label: 'Email',
      children: getUser().email,
    },
  ];

  return localStorage.getItem('TOKEN_KEY') ? (
    <>
      {/* <img className="logo-login" src={backgroundUrl} style={{ width: '100%', position: 'absolute' }} alt="icon"></img> */}
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
              textAlign: 'right',
              alignItems: 'center',
            }}
          >
            <Dropdown
              menu={{
                items: dropdownItems,
                onClick: handleMenuClick,
              }}
            >
              <a style={{ color: 'white' }} onClick={(e) => e.preventDefault()}>
                <Space>
                  {getUser().fullName} - {getUser().position}
                  <CaretDownFilled />
                </Space>
              </a>
            </Dropdown>
          </Header>
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
              <Modal title="Thông tin người dùng" open={openModal} onOk={handleStatusModal} maskClosable={false} onCancel={handleStatusModal} width={'70%'}>
                <Descriptions title="" items={descriptionItems} />
              </Modal>
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
          <Footer style={{ textAlign: 'center' }}>{`Created by T ©${new Date().getFullYear()}`}</Footer>
        </Layout>
      </Layout>
    </>
  ) : (
    <Navigate to={'/login'} />
  );
};

export default PrivateLayout;
