import { useState, useEffect, useCallback } from 'react';
import { Button, Input, Table, Form, Tag, InputNumber, Select, Checkbox } from 'antd';
import { CloseOutlined, SaveOutlined, CheckOutlined, EyeOutlined } from '@ant-design/icons';
import { DocumentRequest, TOKEN_KEY, User } from '../../../constants';
import debounce from 'lodash.debounce';
import { delay, formatDateTime, queryStringToObject, objectToQueryString } from '../../../utils/helper';
import { useLocation, useNavigate } from 'react-router-dom';

const AdministratorCreatePage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [disableUpdate, setDisableUpdate] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    let userInfo = queryStringToObject(location.search);
    if (userInfo && Object.keys(userInfo).length) {
      userInfo.status = userInfo.status === 'true' ? true : false;
      form.setFieldsValue(userInfo);
      setDisableUpdate(true);
      location.search = {};
    }
  }, []);

  const onFinish = (values) => {
    console.log(values);
    setLoading(true);
    props.callDatabase({ key: User.create, data: values });

    props.listenOnce(User.create, async (arg) => {
      await delay(300);
      if (arg.data) {
        setUser(arg.data);
        console.log('arg', arg);
        if (values.id) props.openNotification('success', 'Đã Cập Nhật');
        else props.openNotification('success', 'Đã Tạo Tài Khoản');
        form.resetFields();
      }
      setLoading(false);
    });
  };

  const linkToUserSearch = () => {
    const data = {
      id: user.id,
      status: user.status,
      directFrom: User.create,
    };
    const queryString = objectToQueryString(data);
    return navigate(`/administrator/search?${queryString}`);
  };

  return (
    <>
      <Form
        {...props.formItemLayout}
        form={form}
        layout="vertical"
        name="register"
        onFinish={onFinish}
        initialValues={{ status: true }}
        style={{ display: 'flex', flexWrap: 'wrap' }}
        scrollToFirstError
      >
        <Form.Item name="id" label="Id" style={props.widthStyle}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item
          name="fullName"
          label="Họ Và Tên"
          style={props.widthStyle}
          rules={[{ required: true, min: 4, max: 64, message: 'Please input fullName, 4 <= fullName <=64' }]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="username"
          label="Tên Đăng Nhập"
          style={props.widthStyle}
          rules={[{ required: true, min: 4, max: 12, message: 'Please input username, 4 <= username <=12' }]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật Khẩu"
          style={props.widthStyle}
          rules={!disableUpdate && [{ required: true, min: 6, max: 24, message: 'Please input password,  6 <= password <=24' }]}
          hasFeedback
        >
          <Input.Password disabled={disableUpdate} />
        </Form.Item>

        <Form.Item name="position" label="Chức Vụ" style={props.widthStyle} rules={[{ required: true, message: 'Please input position!' }]} hasFeedback>
          <Select
            options={[
              { value: 'ADMIN', label: 'Quản Trị' },
              { value: 'STAFF', label: 'Nhân Viên' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Số Điện Thoại"
          style={props.widthStyle}
          rules={[{ required: true, min: 10, max: 16, message: 'Please input phoneNumber, 10 <= phoneNumber <= 16' }]}
          hasFeedback
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="status" label={'Trạng Thái'} valuePropName="checked" style={{ ...props.widthStyle }} {...props.tailFormItemLayout}>
          <Checkbox> Hoạt Động </Checkbox>
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          style={props.widthStyle}
          rules={[
            { required: true, min: 10, max: 32, message: 'Please input email, 10 <= email <= 32' },
            {
              type: 'email',
              message: 'Invalid email format!',
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item label=" " {...props.tailFormItemLayout} style={{ ...props.widthStyle }}>
          <Button disabled={Object.keys(user).length} style={{ minWidth: '47%' }} type="primary" htmlType="submit" icon={<SaveOutlined />}>
            {' '}
            Submit{' '}
          </Button>
          <Button
            type="primary"
            disabled={!Object.keys(user).length}
            style={{ minWidth: '47%', marginLeft: 10 }}
            onClick={linkToUserSearch}
            icon={<EyeOutlined />}
          >
            {' '}
            Xem{' '}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AdministratorCreatePage;
