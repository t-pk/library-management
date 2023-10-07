import { useState, useEffect } from 'react';
import { Layout, Menu, Spin, theme, notification, Dropdown, Space, Modal, Descriptions, Button, Form, Input } from 'antd';
import {
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
  DesktopOutlined,
  AreaChartOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { User } from '../constants';
import { getUser, delay } from '../utils/helper';
import logo from '../assets/logo.png';
import './ui.scss';

const { Header, Content, Sider, Footer } = Layout;

const PrivateLayout = ({ element: Component }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState(['/']);
  const [spinning, setSpinning] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [animate, setAnimate] = useState('/document/search');
  const widthStyle = { minWidth: '32%' };
  const [openModal, setOpenModal] = useState('0');
  const [form] = Form.useForm();
  const [modal, contextModal] = Modal.useModal();

  const formItemLayout = {
    labelCol: { xs: { span: 30 }, sm: { span: 30 } },
    wrapperCol: { xs: { span: 40 }, sm: { span: 23 } },
  };

  const tailFormItemLayout = { wrapperCol: { xs: { span: 40, offset: 0 }, sm: { span: 30, offset: 0 } } };

  useEffect(() => {
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
    getUser().position === 'ADMIN' &&
      getItem('Quản Trị', '/administrator', <DesktopOutlined />, [
        getItem('Tìm Kiếm', '/administrator/search', <UserSwitchOutlined />),
        getItem('Thêm - Sửa', '/administrator/create', <UserAddOutlined />),
      ]),
    getItem('Thống Kê', '/report', <AreaChartOutlined />, [
      getItem('Phiếu', '/report/note', <CalendarOutlined />),

      getItem('Tài Liệu', '/report/document', <FileSearchOutlined />),
      getUser().position === 'ADMIN' && getItem('Nhân Viên', '/report/staff', <UsergroupAddOutlined />),
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
      key: JSON.stringify(description),
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
      label: 'Đổi mật khẩu',
    },
    {
      key: '3',
      danger: true,
      label: 'Đăng xuất',
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key === '1') {
      return setOpenModal(e.key);
    }
    if (e.key === '2') {
      return setOpenModal(e.key);
    }
    modal.confirm({
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

  const handleChangePassword = (values) => {
    const data = {
      ...values,
      id: getUser().id || 0,
    };
    callDatabase({ key: User.changePwd, data });

    listenOnce(User.changePwd, async (arg) => {
      await delay(300);
      if (arg.data) {
        form.resetFields();
        openNotification('success', 'Đã cập nhật mật khẩu. Vui lòng đăng nhập lại.');
        await delay(3000);
        setOpenModal(false);
        localStorage.clear();
        navigate('/login');
      }
    });
  };

  const invoke = async (data) => {
    const result = await window.electron.ipcRenderer.invoke('invoke-database', data);
    if (result) return result;
    if (result && result.error) return openNotification('error', result.error);
  };

  return localStorage.getItem('TOKEN_KEY') ? (
    <>
      <Layout>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div className="logo-icon">
            <img src={logo} style={{ textAlign: 'center', height: '50px' }}></img>
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
            <div className="global-header">
              <h3 style={{ color: 'white', margin: '0px' }}>Library Management</h3>
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
            </div>
          </Header>
          <Spin spinning={spinning} wrapperClassName={`${animate == location.pathname ? 'my-animation' : ''}`}>
            {contextHolder} {contextModal}
            <Content
              style={{
                padding: 15,
                margin: 15,
                minHeight: 850,
                background: colorBgContainer,
              }}
            >
              <Modal
                title="Thông tin người dùng"
                open={openModal === '1'}
                maskClosable={false}
                onCancel={handleStatusModal}
                width={'70%'}
                okButtonProps={{ style: { display: 'none' } }}
              >
                <Descriptions title="" items={descriptionItems} />
              </Modal>
              <Modal title="Đổi Mật Khẩu" open={openModal === '2'} onOk={handleStatusModal} footer={[]} maskClosable={false} onCancel={handleStatusModal}>
                <Form form={form} name="change_password" layout="vertical" onFinish={handleChangePassword}>
                  <Form.Item
                    label="Nhập mật khẩu hiện tại"
                    name="password"
                    rules={[{ required: true, min: 6, max: 12, message: '6 <= password length <= 12 ' }]}
                  >
                    <Input.Password autoComplete="false" />
                  </Form.Item>

                  <Form.Item
                    label="Nhập mật khẩu mới"
                    name="newPassword"
                    rules={[{ required: true, min: 6, max: 24, message: '6 <= new password length <= 24 ' }]}
                    hasFeedback
                  >
                    <Input.Password autoComplete="false" />
                  </Form.Item>

                  <Form.Item
                    dependencies={['password']}
                    label="Xác nhận"
                    name="reNewPassword"
                    hasFeedback
                    rules={[
                      { required: true, min: 6, max: 24, message: '6 <= confirm password length <= 24 ' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('không khớp với mật khẩu mới!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password autoComplete="false" />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" key="ok" htmlType="submit">
                      Submit
                    </Button>
                    <Button style={{ marginLeft: 5 }} onClick={handleStatusModal} key="cancel">
                      cancel
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
              <Component
                widthStyle={widthStyle}
                formItemLayout={formItemLayout}
                tailFormItemLayout={tailFormItemLayout}
                listenOn={listenOn}
                callDatabase={callDatabase}
                listenOnce={listenOnce}
                openNotification={openNotification}
                invoke={invoke}
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
