import React from 'react';
import { Button, Layout, Menu, theme } from 'antd';
import {
  AppstoreOutlined,
  MailOutlined,
} from '@ant-design/icons';

import { Navigate, useNavigate } from 'react-router-dom';
const { Header, Content, Sider } = Layout;


const PrivateRoute = ({
  element: Component,
}) => {
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
    <Layout>
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
