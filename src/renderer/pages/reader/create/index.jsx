import { useState, useEffect } from 'react';
import { Button, Form, Input, message, Radio } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { delay } from '../../../utils/index';

const ReaderCreatePage = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const readerTypeId = Form.useWatch('readerTypeId', form);
  const key = 'updatable';

  useEffect(() => {
    getInitData();
    if (readerTypeId === 1) {
      form.setFieldsValue({ civilServantId: undefined });
    }
    if (readerTypeId === 2) {
      form.setFieldsValue({ studentId: undefined });
    }
  }, [readerTypeId]);

  const getInitData = () => {
    props.callDatabase({ key: 'readerType-search' });

    props.listenOnce('readerType-search', (arg) => {
      setReaderTypes((arg.data || []).map((item) => ({ value: item.id, label: item.name })));
    });
  };

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

  const onFinish = async (values) => {
    console.log(values);
    setLoading(true);
    showMessage('loading', 'loading...');
    const data = { ...values };

    props.callDatabase({ key: 'reader-create', data });

    props.listenOnce('reader-create', async (arg) => {
      await delay(1000);
      setLoading(false);
      if (arg.data) {
        messageApi.destroy(key);
        if (arg.data) showMessage('success', 'Created Reader.');
        else showMessage('error', arg.error);
        await delay(2000);
        messageApi.destroy(key);
      }
    });
  };

  return (
    <>
      {' '}
      {contextHolder}
      <Form
        {...props.formItemLayout}
        form={form}
        layout="vertical"
        name="dynamic_rule"
        onFinish={onFinish}
        initialValues={{ quantity: 1, special: false, readerTypeId: 1 }}
        style={{ display: 'flex', flexWrap: 'wrap' }}
        scrollToFirstError
      >
        <Form.Item name="id" label="Mã Độc Giả" style={props.widthStyle}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="fullName" label="Tên Độc Giả" style={props.widthStyle} rules={[{ required: true, message: 'Please input name' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="readerTypeId" label="Loại Độc Giả" style={props.widthStyle} rules={[{ required: true, message: 'Please input civil servant!' }]}>
          <Radio.Group options={readerTypes} optionType="button" buttonStyle="solid" />
        </Form.Item>

        <Form.Item
          name="studentId"
          label="Mã Sinh Viên"
          style={props.widthStyle}
          rules={[
            {
              required: readerTypeId === 1,
              message: 'Please input student id!',
            },
            {
              type: 'string',
              min: 5,
              max: 12,
              message: ' 5 <= student id <= 12',
            },
          ]}
        >
          <Input disabled={readerTypeId !== 1} />
        </Form.Item>

        <Form.Item
          name="civilServantId"
          label="Mã Cán Bộ - Nhân Viên"
          style={props.widthStyle}
          rules={[
            {
              required: readerTypeId !== 1,
              message: 'Please input civil servant!',
            },
            {
              type: 'string',
              min: 5,
              max: 12,
              message: ' 5 <= civil servant <= 12',
            },
          ]}
        >
          <Input disabled={readerTypeId === 1} />
        </Form.Item>

        <Form.Item
          name="citizenIdentify"
          label="Căn Cước Công Dân"
          style={props.widthStyle}
          rules={[
            { required: true, message: 'Please input citizen identify!' },
            {
              type: 'string',
              min: 9,
              max: 15,
              message: ' 9 <= citizen identify <= 15',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Số Điện Thoại"
          style={props.widthStyle}
          rules={[
            { required: true, message: 'Please input phone number!' },
            {
              type: 'string',
              min: 10,
              max: 12,
              message: '10 <= phone number <= 12',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Địa Chỉ Email" style={props.widthStyle}>
          <Input />
        </Form.Item>

        <Form.Item label={' '} {...props.tailFormItemLayout} style={{ ...props.widthStyle }}>
          <Button loading={loading} style={{ minWidth: '96%' }} type="primary" htmlType="submit" icon={<SaveOutlined />}>
            {' '}
            Submit{' '}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ReaderCreatePage;
