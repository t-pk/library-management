import { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Radio, Alert, Space } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { delay, objectToQueryString, queryStringToObject } from '../../../utils/helper';
import { BorrowDetail, ReaderType, Return } from 'renderer/constants';

const ReturnCreatePage = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const [borrowedDocuments, setBorrowedDocuments] = useState([]);
  const [hiddenForm, setHiddenForm] = useState(false);
  const [iReturn, setIReturn] = useState({});
  const readerTypeId = Form.useWatch('readerTypeId', form);
  const location = useLocation();

  useEffect(() => {
    let borrowInfo = queryStringToObject(location.search);
    setHiddenForm(!Object.keys(borrowInfo).length);
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
    props.callDatabase({ key: ReaderType.search });

    if (borrowInfo && borrowInfo.borrowId) {
      const requestBorrowDetail = { borrowId: borrowInfo.borrowId };
      props.callDatabase({ key: BorrowDetail.search, data: requestBorrowDetail });
    }
    props.listenOn((arg) => {
      if (arg && arg.data) {
        if (arg.key === ReaderType.search) setReaderTypes(arg.data.map((item) => ({ value: item.id, label: item.name })));
        if (arg.key === BorrowDetail.search) setBorrowedDocuments(arg.data.map((item) => ({ value: item.id, label: item.name })));
      }
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    const data = { ...values };
    props.callDatabase({ key: 'return-create', data });

    props.listenOnce('return-create', async (arg) => {
      await delay(300);

      if (arg.data) {
        form.resetFields(['documentIds']);
        getInitData({ borrowId: form.getFieldValue('borrowId') });
        props.openNotification('success', 'Đã Tạo Phiếu Trả.');
        setIReturn(arg.data);
      }
      setLoading(false);
    });
  };

  const linkToReturnSearch = () => {
    const data = {
      id: iReturn.id,
      directFrom: Return.create,
    };
    const queryString = objectToQueryString(data);
    return navigate(`/return/search?${queryString}`);
  };

  return (
    <>
      {hiddenForm ? (
        <Space hidden={true} direction="vertical" style={{ width: '100%', textAlign: 'center', fontWeight: 600 }}>
          <Alert message="Bạn nên tạo Phiếu Trả từ tab Phiếu Mượn -> Tìm Kiếm -> nhấn vào More Action -> chọn Tạo Phiếu Trả" banner />
          <Button size="large" icon={<ArrowLeftOutlined />} onClick={() => navigate('/borrow/search')}>
            Trở Về Trang Tìm Kiếm Phiếu Mượn
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
            <Button
              disabled={Object.keys(iReturn).length}
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
              disabled={!Object.keys(iReturn).length}
              style={{ minWidth: '47%', marginLeft: 10 }}
              onClick={linkToReturnSearch}
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

export default ReturnCreatePage;
