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
  const [animate, setAnimate] = useState('/document/search');
  const [openKeys, setOpenKeys] = useState(['/']);
  const [spinning, setSpinning] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(location.pathname === '/' ? '/document/search' : location.pathname);
    console.log("location.pathname", location.pathname);
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

    getItem('Phiếu mượn', '/borrower', <AppstoreOutlined />,
      [
        getItem('Tìm Kiếm', '/borrower/search'),
        getItem('Thêm Mới', '/borrower/create')
      ]),
    getItem('Phiếu Trả', '/returner', <AppstoreOutlined />,
      [
        getItem('Tìm Kiếm', '/returner/search'),
        getItem('Thêm Mới', '/returner/create')
      ]),
    getItem('Phiếu phạt', 'phat/request'),
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
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="demo-logo" >
          <Button style={{ width: '200px' }}></Button>
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
            navigate(key)
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
          <Content
            style={{
              padding: 15,
              margin: 15,
              minHeight: 365,
              background: colorBgContainer,
            }}
          >
            <Component />
          </Content>
        </Spin>
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
