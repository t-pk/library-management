import React, { useState, useEffect } from 'react';
import { Button, Layout, Menu, theme } from 'antd';
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
  const location = useLocation();

  useEffect(() => {
    // This code will run whenever the route changes (location changes)
    console.log('Location has changed:', location.pathname);
  setAnimate(location.pathname);
    // You can perform other actions here based on the location change
  }, [location]);

  // useEffect(() => {

  
  //   // Delay the application of the animation class after a short delay (e.g., 100ms)
  //   const animationTimeout = setTimeout(() => {
  //     setAnimate(location);
  //   }, 1000);

  //   // Cleanup the timeout to avoid memory leaks
  //   return () => clearTimeout(animationTimeout);
  // }, [animate]);


  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
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
      getItem('Thêm Tài Liệu Mới', '/document/create'),
      getItem('Yêu Cầu Tài Liệu', '/document/request'),
    ]),
    getItem('Độc Giả', '/reader', <AppstoreOutlined />,
      [
        getItem('Tìm Kiếm', '/reader/search'),
        getItem('Thêm Độc Giả', '/reader/create'),
        getItem('Yêu Cầu Độc Giả', '/reader/request'),
      ])
  ];

  return localStorage.getItem('TOKEN_KEY') ? (
    <Layout className={`${animate ==location.pathname ? 'my-animation' : ''}`}   {...console.log(location.pathname, animate)}>
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
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['/document/search']}
            defaultOpenKeys={['/']}
            items={items}
            onClick={({ key }) => {
              navigate(key)
            }}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Component />
          </Content>
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
