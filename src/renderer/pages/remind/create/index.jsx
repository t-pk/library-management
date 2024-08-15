import { useState, useEffect } from 'react';
import { Button, Form, Input, Radio, Space, Alert } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { delay } from '../../../utils/helper';
import { queryStringToObject, objectToQueryString } from '../../../utils/helper';
import { ReaderType, Remind } from '../../../constants';

const RemindCreatePage = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hiddenForm, setHiddenForm] = useState(false);
  const [remind, setRemind] = useState({});
  const location = useLocation();

  useEffect(() => {
    let returnInfo = queryStringToObject(location.search);
    setHiddenForm(!Object.keys(returnInfo).length);
    if (Object.keys(returnInfo).length) {
      form.setFieldsValue(returnInfo);
      getInitData();
    }

  }, [location]);

  const getInitData = () => {
    props.callDatabase({ key: ReaderType.search });
  };

  const onFinish = async (values) => {
    setLoading(true);
    const data = { ...values };
    props.callDatabase({ key: Remind.create, data });
    props.listenOnce(Remind.create, async (arg) => {
      await delay(300);

      if (arg.data) {
        form.resetFields();
        props.openNotification('success', 'Đã Tạo Phiếu Nhắc Nhở');
        setRemind(arg.data);
      }
      setLoading(false);
    });
  };

  const linkToRemindSearch = () => {
    const data = {
      directFrom: Remind.create,
      fullName: remind.readerName || '',
      readerId: remind.readerId,
    };

    const queryString = objectToQueryString(data);
    return navigate(`/remind/search?${queryString}`);
  };

  return (
    <>
      {hiddenForm ? (
        <Space hidden={true} direction="vertical" style={{ width: '100%', textAlign: 'center', fontWeight: 600 }}>
          <Alert message="Bạn nên tạo Phiếu Nhắc Nhở từ tab Phiếu Trả -> Tìm Kiếm -> nhấn vào More Action -> chọn Tạo Phiếu Nhắc Nhở" banner />
          <Button size="large" icon={<ArrowLeftOutlined />} onClick={() => navigate('/return/search')}>
            Trở Về Trang Tìm Kiếm Phiếu Trả
          </Button>
        </Space>
      ) : (
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
          <Form.Item name="returnId" label="Mã Phiếu Trả" style={props.widthStyle}>
            <Input disabled={true} />
          </Form.Item>

          <Form.Item name="readerId" label="Mã Độc Giả" style={props.widthStyle}>
            <Input disabled={true} />
          </Form.Item>

          <Form.Item name="readerName" label="Tên Độc Giả" style={props.widthStyle} rules={[{ required: true, message: 'Please input name' }]}>
            <Input disabled={true} />
          </Form.Item>

          <Form.Item name="description" label="Mô Tả" style={props.widthStyle}>
            <Input.TextArea rows={5} showCount maxLength={200} />
          </Form.Item>

          <Form.Item label={' '} {...props.tailFormItemLayout} style={{ ...props.widthStyle }}>
            <Button
              disabled={Object.keys(remind).length}
              loading={loading}
              style={{ minWidth: '47%' }}
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
            >
              {' '}
              Submit{' '}
            </Button>
            <Button
              type="primary"
              disabled={!Object.keys(remind).length}
              style={{ minWidth: '47%', marginLeft: 10 }}
              onClick={linkToRemindSearch}
              icon={<EyeOutlined />}
            >
              {' '}
              Xem{' '}
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default RemindCreatePage;
