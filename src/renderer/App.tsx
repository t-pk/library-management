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

export const Rec = () => {
  const nav = useNavigate();

  const button1 = (page: string) => () => {
    nav(page);
  };

  return (
    <div>
      <Button onClick={button1('/page2')}>page 2</Button>
      <Button onClick={button1('/readers')}>page 3</Button>
      <Button onClick={button1('/')}>page 1</Button>
      <Button onClick={button1('/login')}>Login</Button>
    </div>
  );
};
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
          <Rec />
        </Suspense>
      }
    />
  )
  return (
    <ConfigProvider theme={{
      components: {
        Layout: {
          headerBg: '#8524ad'
        },
      }, token: { colorPrimary: '#8524ad' }
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
