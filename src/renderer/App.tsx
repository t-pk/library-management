import { Button, Spin } from 'antd';
import React, { Suspense } from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { ConfigProvider } from 'antd';
import routes from './routers';
const color = '#174e94';

const App = () => {
  const adminRoutes = routes.map((route) =>
    <Route
      path={route.path}
      element={
        <Suspense
          fallback={
            <Spin>
              <div className="is-spining-full" />
            </Spin>
          }
        >
          <route.layout element={route.main} />
        </Suspense>
      }
    />
  )
  return (
    <ConfigProvider theme={{
      components: {
        Layout: {
          headerBg: color
        },
        Button: {
          colorPrimary: color,
        },
        Input: {
          hoverBorderColor: '#cdc2c2',
          activeBorderColor: '#cdc2c2',
          activeShadow: '#cdc2c2'
        }
      }, token: {
        fontFamily: '"Open Sans", sans-serif',
        fontSize: 14
      },
    }}>

      <Router>
        <Suspense
          fallback={
            <Spin>
              <div className="is-spining-full" />
            </Spin>
          }
        >
          <Routes>
            {...adminRoutes}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ConfigProvider>
  );
};

export default App;
