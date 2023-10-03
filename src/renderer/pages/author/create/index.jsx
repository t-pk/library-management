import { useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { delay } from '../../../utils/helper';
import { Author } from '../../../constants';

const AuthorCreatePage = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);

    props.callDatabase({ key: Author.create, data: values });

    props.listenOnce(Author.create, async (arg) => {
      await delay(300);
      if (arg.data) props.openNotification('success', 'Đã Tạo Tác Giả');
      setLoading(false);
    });
  };

  return (
    <>
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
        <Form.Item name="Id" label="Id" style={props.widthStyle}>
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
