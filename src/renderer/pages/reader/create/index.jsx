import { useState, useEffect } from 'react';
import { Button, Form, Input, Radio } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { SaveOutlined, EyeOutlined } from '@ant-design/icons';
import { delay, queryStringToObject, objectToQueryString } from '../../../utils/helper';
import { Reader, ReaderType } from '../../../constants';

const ReaderCreatePage = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [reader, setReader] = useState({});

  useEffect(() => {
    let borrowInfo = queryStringToObject(location.search);
    if (borrowInfo && Object.keys(borrowInfo).length) {
      borrowInfo.id = +borrowInfo.id;
      form.setFieldsValue(borrowInfo);
      location.search = {};
    }

    getInitData();
  }, []);

  const getInitData = () => {
    props.callDatabase({ key: ReaderType.search });

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
        initialValues={{ quantity: 1, special: false }}
        style={{ display: 'flex', flexWrap: 'wrap' }}
        scrollToFirstError
      >
        <Form.Item name="id" label="Mã Độc Giả" style={props.widthStyle}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="fullName" label="Tên Độc Giả" style={props.widthStyle} rules={[{ required: true, message: 'Please input name' }]} hasFeedback>
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
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" style={props.widthStyle} hasFeedback>
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
