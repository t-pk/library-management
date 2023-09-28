import { useState, useEffect } from 'react';
import { Button, Form, Input, Radio, Space, Alert } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { delay } from '../../../utils/helper';
import { queryStringToObject, objectToQueryString } from '../../../utils/helper';
import { ReaderType, Remind } from 'renderer/constants';

const RemindCreatePage = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const [hiddenForm, setHiddenForm] = useState(false);
  const [remind, setRemind] = useState({});

  const readerTypeId = Form.useWatch('readerTypeId', form);
  const location = useLocation();

  useEffect(() => {
    let returnInfo = queryStringToObject(location.search);
    setHiddenForm(!Object.keys(returnInfo).length);
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
    props.callDatabase({ key: ReaderType.search });

    props.listenOnce(ReaderType.search, (arg) => {
      setReaderTypes((arg.data || []).map((item) => ({ value: item.id, label: item.name })));
    });
  };

  const onFinish = async (values) => {
    console.log(values);
    setLoading(true);
    const data = { ...values };
    props.callDatabase({ key: Remind.create, data });
    props.listenOnce(Remind.create, async (arg) => {
      await delay(300);

      if (arg.data) {
        form.resetFields();
        props.openNotification('success', 'Tạo thành công Phiếu Nhắc Nhở');
        setRemind(arg.data);
      }
      setLoading(false);
    });
  };

  const linkToRemindSearch = () => {
    const data = {
      directFrom: Remind.create,
      citizenIdentify: remind.citizenIdentify || '',
      readerTypeId: remind.readerTypeId || '',
      civilServantId: remind.civilServantId || '',
      fullName: remind.readerName || '',
      studentId: remind.studentId || '',
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
              Xem Kết Quả{' '}
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default RemindCreatePage;
