import { useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const AuthorCreatePage = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const key = 'updatable';

  const showMessage = (type, content) => {
    messageApi.open({
      key,
      type: type,
      content: content,
      duration: 5,
      className: 'custom-class',
      style: {
        textAlign: 'right',
        paddingRight: 20,
        marginTop: '47%',
      },
    });
  };

  const onFinish = (values) => {
    setLoading(true);
    showMessage('loading', 'loading...');
    props.callDatabase({ key: 'author-create', data: values });

    props.listenOnce('return-search', async (arg) => {
      await delay(1000);
      setLoading(false);
      messageApi.destroy(key);
      if (arg.data) {
        showMessage('success', 'Created Author');
      } else showMessage('error', arg.error);
      await delay(2000);
      messageApi.destroy(key);
    });
  };

  return (
    <>
      {contextHolder}
      <Form
        {...props.formItemLayout}
        form={form}
        layout="vertical"
        name="register"
        onFinish={onFinish}
        initialValues={{ status: true, description: '' }}
        style={{ display: 'flex', flexWrap: 'wrap' }}
        scrollToFirstError
      >
        <Form.Item name="Id" label="Mã Tác Giả" style={props.widthStyle}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="name" label="Tên Tác Giả" style={props.widthStyle} rules={[{ required: true, message: 'Please input name!' }]}>
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label={' '} {...props.tailFormItemLayout} style={{ ...props.widthStyle, textAlign: 'center' }}>
          <Button loading={loading} style={{ minWidth: '30%' }} type="primary" htmlType="submit" icon={<SaveOutlined />}>
            {' '}
            Submit{' '}
          </Button>
          <Button style={{ minWidth: '30%', marginLeft: 10 }} type="primary" icon={<SaveOutlined />}>
            {' '}
            Tìm Kiếm Tác Giả{' '}
          </Button>
        </Form.Item>

        <Form.Item name="description" label="Mô Tả" style={props.widthStyle}>
          <Input.TextArea rows={5} showCount maxLength={200} />
        </Form.Item>

        <Form.Item label="Trạng Thái" name="status" valuePropName="checked" style={{ ...props.widthStyle }} {...props.tailFormItemLayout}>
          <Checkbox> Hoạt Động </Checkbox>
        </Form.Item>
      </Form>
    </>
  );
};
export default AuthorCreatePage;
