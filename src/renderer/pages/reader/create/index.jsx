import { useState, useEffect } from 'react';
import { Button, Form, Input, Radio } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { SaveOutlined, EyeOutlined } from '@ant-design/icons';
import { delay, queryStringToObject, objectToQueryString } from '../../../utils/helper';
import { Reader, ReaderType } from 'renderer/constants';

const ReaderCreatePage = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const readerTypeId = Form.useWatch('readerTypeId', form);
  const [reader, setReader] = useState({});
  const [disableUpdate, setDisableUpdate] = useState(false);

  useEffect(() => {
    let borrowInfo = queryStringToObject(location.search);
    if (borrowInfo && Object.keys(borrowInfo).length) {
      setDisableUpdate(true);
      borrowInfo.id = +borrowInfo.id;
      borrowInfo.readerTypeId = +borrowInfo.readerTypeId;
      form.setFieldsValue(borrowInfo);
      location.search = {};
    }

    getInitData();
    if (readerTypeId === 1) {
      form.setFieldsValue({ civilServantId: undefined });
    }
    if (readerTypeId === 2) {
      form.setFieldsValue({ studentId: undefined });
    }
  }, [readerTypeId]);

  const getInitData = () => {
    props.callDatabase({ key: ReaderType.search });

    props.listenOnce(ReaderType.search, (arg) => {
      setReaderTypes((arg.data || []).map((item) => ({ value: item.id, label: item.name })));
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    const data = { ...values };

    props.callDatabase({ key: Reader.create, data });
    props.listenOnce(Reader.create, async (arg) => {
      await delay(300);
      if (arg.data) {
        props.openNotification('success', 'Tạo - Cập Nhật thành công Độc Giả.');
        form.resetFields();
        setReader(arg.data);
      }
      setLoading(false);
    });
  };

  const linkToReaderSearch = () => {
    const data = {
      readerId: reader.id,
      directFrom: Reader.create,
    };
    const queryString = objectToQueryString(data);
    return navigate(`/reader/search?${queryString}`);
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
        <Form.Item name="id" label="Mã Độc Giả" style={props.widthStyle}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="fullName" label="Tên Độc Giả" style={props.widthStyle} rules={[{ required: true, message: 'Please input name' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="readerTypeId" label="Loại Độc Giả" style={props.widthStyle} rules={[{ required: true, message: 'Please input civil servant!' }]}>
          <Radio.Group disabled={disableUpdate} options={readerTypes} optionType="button" buttonStyle="solid" />
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
          <Button disabled={Object.keys(reader).length} loading={loading} style={{ minWidth: '47%' }} type="primary" htmlType="submit" icon={<SaveOutlined />}>
            {' '}
            Submit{' '}
          </Button>
          <Button
            type="primary"
            disabled={!Object.keys(reader).length}
            style={{ minWidth: '47%', marginLeft: 10 }}
            onClick={linkToReaderSearch}
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

export default ReaderCreatePage;
