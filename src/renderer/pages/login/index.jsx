import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import icon from '../../assets/icon.jpeg';
import backgroundUrl from '../../assets/background.svg';

const NOTI_LOGIN_FAIL = 'Tên Đăng Nhập hoặc Mật Khẩu không đúng. Vui lòng kiểm tra lại.';

const LoginPage = (props) => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState('primary');

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const [loading, setLoading] = useState(false);

  const onFinishFailed = () => {
    setLoading(false);
    props.openNotification('error', NOTI_LOGIN_FAIL);
  };

  const onFinish = async (user) => {
    setLoading(true);
    setSuccess('default');
    props.callDatabase({ key: 'user-login', data: user });
    props.listenOnce('user-login', async (arg) => {
      await sleep(300);
      setLoading(false);
      if (arg && arg.data) {
        localStorage.setItem('TOKEN_KEY', JSON.stringify(arg.data));
        navigate('/');
      }
      if (arg && !arg.error && !arg.data) {
        props.openNotification('error', NOTI_LOGIN_FAIL);
      }
      setSuccess('primary');
    });
  };

  return (
    <div id="login-content">
      <img className="logo-login" src={backgroundUrl} style={{ width: '100%', position: 'absolute' }} alt="icon"></img>
      <Form name="basic" initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} className="login-wrap">
        <img className="logo-login" src={icon} alt="icon" />
        <h3 className="logo-name"> Library Management </h3>
        <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password autoComplete="false" />
        </Form.Item>

        <Form.Item>
          <Button className="login-button" type={success} htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
