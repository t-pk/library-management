import React, { useState } from 'react';
import { Button, Form, Input, InputNumber } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const reStyle = {
  minWidth: '32%',
};

const DocumentRequestPage = (props) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {};

  return (
    <Form
      {...props.formItemLayout}
      form={form}
      layout="vertical"
      name="register"
      onFinish={onFinish}
      initialValues={{
        residence: ['zhejiang', 'hangzhou', 'xihu'],
        prefix: '86',
      }}
      style={{ display: 'flex', flexWrap: 'wrap' }}
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label="Tên Tài Liệu"
        style={props.widthStyle}
        rules={[{ required: true, message: 'Please input name' }]}
      >
        <Input.TextArea rows={1} showCount maxLength={200} />
      </Form.Item>

      <Form.Item
        name="publisher"
        label="Nhà Xuất Bản"
        style={props.widthStyle}
        rules={[{ required: true, message: 'Please select publisher!' }]}
      >
        <Input style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label=" " {...props.tailFormItemLayout} style={{ ...reStyle, textAlign: 'center' }}>
        <Button style={{ minWidth: '50%' }} type="primary" htmlType="submit" icon={<SaveOutlined />}>
          {' '}
          Submit{' '}
        </Button>
      </Form.Item>

      <Form.Item
        name="quatity"
        label="Số Lượng"
        style={props.widthStyle}
        rules={[
          { required: true, message: 'Please input your quantity!' },
          { type: 'number', min: 999, message: 'min >= 1' },
        ]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  );
};

export default DocumentRequestPage;
