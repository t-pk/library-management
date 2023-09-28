import { useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { delay } from '../../../utils/helper';
import { Publisher } from 'renderer/constants';

const PublisherCreatePage = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);

    props.callDatabase({ key: Publisher.create, data: values });

    props.listenOnce(Publisher.create, async (arg) => {
      await delay(500);
      if (arg.data) props.openNotification('success', 'Tạo thành công Nhà Xuất Bản');

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
        <Form.Item name="Id" label="Mã Nhà Xuất Bản" style={props.widthStyle}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="name" label="Tên Nhà Xuất Bản" style={props.widthStyle} rules={[{ required: true, message: 'Please input name!' }]}>
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

export default PublisherCreatePage;
