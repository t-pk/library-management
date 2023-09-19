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
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
const { Option } = Select;

const reStyle = {
  minWidth: "32%"
};

const formItemLayout = { labelCol: { xs: { span: 30 }, sm: { span: 30 } }, wrapperCol: { xs: { span: 40 }, sm: { span: 23 } } };
const tailFormItemLayout = { wrapperCol: { xs: { span: 40, offset: 0 }, sm: { span: 30, offset: 0 } }, };

const ReaderRequestPage = () => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <Form {...formItemLayout} form={form} layout="vertical" name="register" onFinish={onFinish} initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }}
      style={{ display: 'flex', flexWrap: 'wrap' }}
      scrollToFirstError>
      <Form.Item name="name" label="Tên Tài Liệu" style={reStyle} rules={[{ required: true, message: 'Please input name', },]} >
        <Input.TextArea rows={1} showCount maxLength={200} />
      </Form.Item>

      <Form.Item name="publisher" label="Nhà Xuất Bản" style={reStyle} rules={[{ required: true, message: 'Please select publisher!', },]} >
        <Input style={{ width: '100%', }} />
      </Form.Item>

      <Form.Item label=" " {...tailFormItemLayout} style={{ ...reStyle, textAlign: 'center' }}>
        <Button style={{ minWidth: '50%' }} type="primary" htmlType="submit" icon={<SaveOutlined />}> Submit </Button>
      </Form.Item>

      <Form.Item name="quatity" label="Số Lượng" style={reStyle} rules={[{ required: true, message: 'Please input your quantity!' }, { type: 'number', min: 999, message: 'min >= 1'}]}>
        <InputNumber min={1} style={{ width: '100%', }} />
      </Form.Item>

    </Form>
  );
};

export default ReaderRequestPage;