import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Radio, InputNumber, Checkbox } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { delay } from '../../../utils/index';
import { queryStringToObject } from '../../../utils/index';

const PenaltyCreatePage = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();
  const readerTypeId = Form.useWatch('readerTypeId', form);
  const location = useLocation();
  const key = 'updatable';

  useEffect(() => {
    let returnInfo = queryStringToObject(location.search);
    returnInfo.readerTypeId = +returnInfo.readerTypeId;
    form.setFieldsValue(returnInfo);

    getInitData();
    if (readerTypeId === 1) {
      form.setFieldsValue({ civilServantId: undefined });
    }
    if (readerTypeId === 2) {
      form.setFieldsValue({ studentId: undefined });
    }
  }, [readerTypeId, location]);

  const getInitData = () => {
    props.callDatabase({ key: 'readerType-search' });

    props.listenOnce('readerType-search', (arg) => {
      setReaderTypes(arg.data.map((item) => ({ value: item.id, label: item.name })));
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
    props.callDatabase({ key: 'penalty-create', data });

    props.listenOnce('penalty-create', async (arg) => {
      if (arg.data) {
        await delay(1000);
        form.resetFields();
        messageApi.destroy(key);
        if (arg.data) showMessage('success', 'Created Penalty.');
        else showMessage('error', arg.error);
        await delay(2000);
        messageApi.destroy(key);
      } else {
        setLoading(false);
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
        <Form.Item name="returnId" label="Mã Phiếu Trả" style={props.widthStyle}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="readerId" label="Mã Độc Giả" style={props.widthStyle}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item
          name="readerName"
          label="Tên Độc Giả"
          style={props.widthStyle}
          rules={[{ required: true, message: 'Please input name' }]}
        >
          <Input disabled={true} />
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
          <Input disabled={true} />
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
          <Input disabled={true} />
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
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="readerTypeId" label="Loại Độc Giả" style={props.widthStyle}>
          <Radio.Group options={readerTypes} optionType="button" buttonStyle="solid" disabled={true} />
        </Form.Item>

        <Form.Item
          name="totalAmount"
          label="Số Tiền Phạt"
          style={props.widthStyle}
          rules={[
            { required: true, message: 'Please input your totalAmount!' },
            {
              type: 'number',
              min: 1000,
              max: 100000000,
              message: 'min >= 1,000 and max <= 100,000,000',
            },
          ]}
        >
          <InputNumber
            min={1}
            style={{ width: '100%' }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
          />
        </Form.Item>

        <Form.Item
          name="compensation"
          label=" "
          valuePropName="checked"
          style={{ ...reStyle }}
          {...props.tailFormItemLayout}
        >
          <Checkbox> Đã Đóng Phạt </Checkbox>
        </Form.Item>

        <Form.Item name="description" label="Mô Tả" style={props.widthStyle}>
          <Input.TextArea rows={5} showCount maxLength={200} />
        </Form.Item>

        <Form.Item label={' '} {...props.tailFormItemLayout} style={{ ...reStyle }}>
          <Button
            loading={loading}
            style={{ minWidth: '96%' }}
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
          >
            {' '}
            Submit{' '}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default PenaltyCreatePage;
