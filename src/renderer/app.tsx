import { Spin } from 'antd';
import { Suspense } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import routes from './routers';
const primaryColor = '#cdc2c2';

const App = () => {
  const adminRoutes = routes.map((route) => (
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
  ));
  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: { borderRadius: 0, colorBgBase: '#FFF' },
          Table: { headerBg: '#c1e1ff', fontWeightStrong: 530 },
          Layout: {
            colorFillContentHover: primaryColor,
            headerBg: '#112c5ef2',
          },
          Button: {
            colorPrimary: '#174e94',
          },
          Input: {
            hoverBorderColor: primaryColor,
            activeBorderColor: primaryColor,
            activeShadow: primaryColor,
          },
          InputNumber: {
            hoverBorderColor: primaryColor,
            activeBorderColor: primaryColor,
            activeShadow: primaryColor,
          },
        },
        token: {
          fontFamily: '"Open Sans", sans-serif',
          fontSize: 14,
        },
      }}
    >
      <Router>
        <Routes>
          {...adminRoutes}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
