import React, { useState } from 'react';
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  message,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { internalCall, getUserId, delay } from '../../../actions';

const reStyle = {
  minWidth: "32%"
};

const formItemLayout = { labelCol: { xs: { span: 30 }, sm: { span: 30 } }, wrapperCol: { xs: { span: 40 }, sm: { span: 23 } } };
const tailFormItemLayout = { wrapperCol: { xs: { span: 40, offset: 0 }, sm: { span: 30, offset: 0 } }, };

const AuthorCreatePage = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const key = 'updatable';

  const showMessage = (type, content) => {
    messageApi.open({
      key, type: type, content: content, duration: 5, className: 'custom-class',
      style: {
        textAlign: 'right',
        paddingRight: 20,
        marginTop: '47%',
      },
    });
  };

  const onFinish = (values) => {
    setLoading(true);
    showMessage('loading', 'loading...')
    internalCall({ key: 'author-create', data: values });

    window.electron.ipcRenderer.once('ipc-database', async (arg) => {

      await delay(1000);
      setLoading(false);
      messageApi.destroy(key);
      if (arg.data) {
        showMessage('success', 'Created Author');
      }
      else showMessage('error', arg.error);
      await delay(2000);
      messageApi.destroy(key);
    });
  };

  return (<>
    {contextHolder}
    <Form {...formItemLayout} form={form} layout="vertical" name="register" onFinish={onFinish} initialValues={{ status: true, description: '' }}
      style={{ display: 'flex', flexWrap: 'wrap' }}
      scrollToFirstError>

      <Form.Item name="Id" label="Mã Tác Giả" style={reStyle}>
        <Input disabled={true} />
      </Form.Item>


      <Form.Item name="name" label="Tên Tác Giả" style={reStyle} rules={[{ required: true, message: 'Please input name!', },]} >
        <Input style={{ width: '100%', }} />
      </Form.Item>

      <Form.Item label={" "} {...tailFormItemLayout} style={{ ...reStyle, textAlign: 'center' }}>
        <Button loading={loading} style={{ minWidth: '30%' }} type="primary" htmlType="submit" icon={<SaveOutlined />}> Submit </Button>
        <Button style={{ minWidth: '30%', marginLeft: 10 }} type="primary" icon={<SaveOutlined />}> Tìm Kiếm Tác Giả </Button>
      </Form.Item>

      <Form.Item name="description" label="Mô Tả" style={reStyle}  >
        <Input.TextArea rows={5} showCount maxLength={200} />
      </Form.Item>

      <Form.Item label="Trạng Thái" name="status" valuePropName="checked" style={{ ...reStyle }} {...tailFormItemLayout} >
        <Checkbox>  Hoạt Động </Checkbox>
      </Form.Item>
    </Form>
  </>
  );
};
export default AuthorCreatePage;