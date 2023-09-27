import { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Radio } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { delay } from '../../../utils/helper';
import { queryStringToObject } from '../../../utils/helper';

const ReturnCreatePage = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const [borrowedDocuments, setBorrowedDocuments] = useState([]);

  const readerTypeId = Form.useWatch('readerTypeId', form);
  const location = useLocation();

  useEffect(() => {
    let borrowInfo = queryStringToObject(location.search);
    borrowInfo.readerTypeId = +borrowInfo.readerTypeId;
    form.setFieldsValue(borrowInfo);

    getInitData(borrowInfo);
    if (readerTypeId === 1) {
      form.setFieldsValue({ civilServantId: undefined });
    }
    if (readerTypeId === 2) {
      form.setFieldsValue({ studentId: undefined });
    }
  }, [readerTypeId, location]);

  const getInitData = (borrowInfo) => {
    props.callDatabase({ key: 'readerType-search' });

    if (borrowInfo && borrowInfo.borrowId) {
      const requestBorrowDetail = { borrowId: borrowInfo.borrowId };
      props.callDatabase({ key: 'borrowDetail-search', data: requestBorrowDetail });
    }
    props.listenOn((arg) => {
      if (arg && arg.data) {
        if (arg.key === 'readerType-search') setReaderTypes(arg.data.map((item) => ({ value: item.id, label: item.name })));
        if (arg.key === 'borrowDetail-search') {
          console.log('arg', arg);
          setBorrowedDocuments(arg.data.map((item) => ({ value: item.id, label: item.name })));
        }
      }
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    const data = { ...values };
    props.callDatabase({ key: 'return-create', data });

    props.listenOnce('return-create', async (arg) => {
      await delay(1000);

      if (arg.data) {
        form.resetFields(['documentIds']);
        getInitData({ borrowId: form.getFieldValue('borrowId') });
        props.openNotification('success', 'Tạo thành công Phiếu Trả.');
      }
      setLoading(false);
    });
  };

  return (
    <>
      {' '}
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
        <Form.Item name="borrowId" label="Mã Phiếu Mượn" style={props.widthStyle}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="readerId" label="Mã Độc Giả" style={props.widthStyle}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="readerName" label="Tên Độc Giả" style={props.widthStyle} rules={[{ required: true, message: 'Please input name' }]}>
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
          name="documentIds"
          label="Tài Liệu Mang Trả"
          style={props.widthStyle}
          rules={[
            {
              validator: async (_, values = []) => {
                const doc = values.every((id) => borrowedDocuments.map((document) => document.value).includes(id));
                if (!doc || !values.length) return Promise.reject(new Error('Please select item on List!'));
              },
            },
          ]}
        >
          <Select
            mode="multiple"
            options={borrowedDocuments}
            // onSearch={findDocuments}
            placeholder=""
            className="custom-autocomplete"
            filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          />
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

export default ReturnCreatePage;
