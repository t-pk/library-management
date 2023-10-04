import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import icon from '../../assets/icon.jpeg';
import backgroundUrl from '../../assets/background.svg';
import { TOKEN_KEY, User } from '../../constants';
import { delay } from 'renderer/utils/helper';
const NOTI_LOGIN_FAIL = 'Tên Đăng Nhập hoặc Mật Khẩu không đúng. Vui lòng kiểm tra lại.';

const LoginPage = (props) => {
  const navigate = useNavigate();
  const [btnType, setBtnType] = useState('primary');
  const [loading, setLoading] = useState(false);

  const onFinish = async (user) => {
    setLoading(true);
    setBtnType('default');
    props.callDatabase({ key: User.login, data: user });
    props.listenOnce(User.login, async (arg) => {
      await delay(300);
      setLoading(false);
      if (arg && arg.data) {
        localStorage.setItem(TOKEN_KEY, JSON.stringify(arg.data));
        navigate('/');
      }
      if (arg && !arg.error && !arg.data) {
        props.openNotification('error', NOTI_LOGIN_FAIL);
      }
      setBtnType('primary');
    });
  };

  return (
    <div id="login-content">
      <img className="logo-login" src={backgroundUrl} style={{ width: '100%', position: 'absolute' }} alt="icon"></img>
      <Form name="dynamic_rule" onFinish={onFinish} className="login-wrap">
        <img className="logo-login" src={icon} alt="icon" />
        <h3 className="logo-name"> Library Management </h3>
        <Form.Item name="username" rules={[{ required: true, min: 4, max: 12, message: '4 <= username length <= 12 ' }]} hasFeedback>
          <Input />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, min: 6, max: 24, message: '6 <= password length <= 24 ' }]} hasFeedback>
          <Input.Password autoComplete="false" />
        </Form.Item>

        <Form.Item>
          <Button className="login-button" type={btnType} htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
