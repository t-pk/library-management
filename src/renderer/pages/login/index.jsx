import { Form, Input, Button, message } from 'antd';
import React, { useState } from 'react';
import { useNavigate, Redirect } from 'react-router-dom';
import { internalCall } from 'renderer/actions';
import icon from '../../assets/icon.jpeg';
import './ui.css';

const MESSAGE_LOGIN_FAIL =
  'username or password is incorrect. Please try again !';


const LoginPage = () => {
  const navigate = useNavigate();

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const [loading, setLoading] = useState(false);

  const onFinishFailed = () => {
    setLoading(false);
    message.error({
      content: MESSAGE_LOGIN_FAIL,
      className: 'custom-class',
      style: {
        textAlign: "right"
      },
    });
  };

  const onFinish = async (user) => {
    setLoading(true);

    internalCall({ key: 'user-login', data: user });
    window.electron.ipcRenderer.once('ipc-database', async (arg) => {
      if (arg && arg.data) {
        setLoading(false);
        await sleep(1200);
        localStorage.setItem('TOKEN_KEY', arg.data);
        navigate('/');
      }
    });
  };

  return (
    <div id="login-content">
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="login-wrap"
      >
        <img className="logo-login" src={icon} alt="icon" />
        <h3 className="logo-name"> ElectronJS - React - Ant </h3>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password autoComplete="false" />
        </Form.Item>

        <Form.Item>
          <Button
            className="login-button"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
