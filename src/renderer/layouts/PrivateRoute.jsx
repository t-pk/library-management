import React, { useState, useEffect } from 'react';
import { Button, Layout, Menu, Spin, theme } from 'antd';
import {
  AppstoreOutlined,
  MailOutlined,
} from '@ant-design/icons';

import { Navigate, useNavigate, useLocation } from 'react-router-dom';
const { Header, Content, Sider } = Layout;
import './css.css';

const PrivateRoute = ({
  element: Component,
}) => {
  const [animate, setAnimate] = useState('/');
  const [openKeys, setOpenKeys] = useState(['/']);
  const [spinning, setSpinning] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(location.pathname);
    const keyPath = '/' + location.pathname.split('/')[1];
    const keyAdmin = openKeys.find((key) => key === keyPath);
    console.log({keyAdmin});
    if (!keyAdmin) {
      const keys = openKeys.map((key)=> key).concat(keyPath);
      setOpenKeys(keys);
    }
    console.log(openKeys);
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false)
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
    getItem('Độc Giả', '/reader', <AppstoreOutlined />,
      [
        getItem('Tìm Kiếm', '/reader/search'),
        getItem('Thêm Mới', '/reader/create'),
      ]),
    getItem('Phiếu', '/note', <AppstoreOutlined />,
      [
        getItem('Phiếu mượn', '/note/borrower', <AppstoreOutlined />,
          [
            getItem('Tìm Kiếm', '/note/borrower/search'),
            getItem('Thêm Mới', '/note/borrower/create')
          ]),
        getItem('Phiếu trả', '/note/create'),
        getItem('Phiếu phạt', '/note/request'),
      ]),
    getItem('Tác Giả', '/author', <AppstoreOutlined />,
      [
        getItem('Tìm Kiếm', '/author/search'),
        getItem('Thêm Mới', '/author/create'),
      ]),
    getItem('Nhà Xuất Bản', '/publisher', <AppstoreOutlined />,
      [
        getItem('Tìm Kiếm', '/publisher/search'),
        getItem('Thêm Mới', '/publisher/create'),
      ]),
  ];

  const onOpenChange = (e) => {
    setOpenKeys(e);
  }

  return localStorage.getItem('TOKEN_KEY') ? (
    <Layout   >
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >

        <div className="demo-logo" >
          <Button></Button>
        </div>
      </Header>

      <Layout
        style={{
          padding: '0 24px 24px',
        }}
      >
        <Sider
          breakpoint='xs'
          // width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['/document/search']}
            defaultOpenKeys={['/']}
            items={items}
            openKeys={openKeys}
            selectedKeys={animate}
            onOpenChange={onOpenChange}
            onClick={({ key }) => {
              navigate(key)
            }}
          />
        </Sider>
        <Layout
          style={{
            padding: '0px 24px 0px 24px',
          }}
        >
          <Spin spinning={spinning} wrapperClassName={`${animate == location.pathname ? 'my-animation' : ''}`}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 365,
                background: colorBgContainer,
              }}
            >
              <Component />
            </Content>
          </Spin>
        </Layout>
      </Layout>
    </Layout>
  ) : (
    <Navigate
      to={'/login'}
    />
  );
};

// PrivateRoute.propTypes = {
//   element: PropTypes.elementType.isRequired,
//   layout: PropTypes.elementType.isRequired,
//   exact: PropTypes.bool.isRequired,
//   path: PropTypes.string.isRequired,
// };

export default PrivateRoute;
