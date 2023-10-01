import { useState, useEffect, useCallback } from 'react';
import { Button, Form, Input, Select, Radio, Alert, Space } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { delay, objectToQueryString } from '../../../utils/helper';
import { queryStringToObject, parseDataSelect } from '../../../utils/helper';
import debounce from 'lodash.debounce';
import { Borrow, Document, ReaderType } from 'renderer/constants';

const BorrowCreatePage = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [hiddenForm, setHiddenForm] = useState(false);
  const [borrow, setBorrow] = useState({});

  const readerTypeId = Form.useWatch('readerTypeId', form);
  const location = useLocation();

  useEffect(() => {
    getInitData();

    let readerInfo = queryStringToObject(location.search);
    setHiddenForm(!Object.keys(readerInfo).length);
    readerInfo.readerTypeId = +readerInfo.readerTypeId;
    form.setFieldsValue(readerInfo);

    if (readerTypeId === 1) form.setFieldsValue({ civilServantId: undefined });
    if (readerTypeId === 2) form.setFieldsValue({ studentId: undefined });
  }, [readerTypeId, location]);

  const getInitData = () => {
    props.callDatabase({ key: ReaderType.search });
    props.callDatabase({ key: Document.search, data: { availableQuantity: 1 } });

    props.listenOn(async (arg) => {
      if (arg && arg.data) {
        if (arg.key === ReaderType.search) setReaderTypes(arg.data.map((item) => ({ value: item.id, label: item.name })));
        if (arg.key === Document.search) setDocuments(parseDataSelect(arg.data));
      }
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    const data = { ...values };
    const documentIds = values.documentIds.map((document) => +document.split('-')[0].trim());
    data.documentIds = documentIds;
    props.callDatabase({ key: Borrow.create, data });

    props.listenOnce(Borrow.create, async (arg) => {
      await delay(300);
      if (arg.data) {
        form.resetFields();
        console.log(arg.data);
        props.openNotification('success', 'Tạo thành công Phiếu Mượn.');
        setBorrow(arg.data);
      }

      setLoading(false);
    });
  };

  const debounceDocument = async (value) => {
    props.callDatabase({ key: Document.search, data: { name: value } });

    props.listenOnce((arg) => {
      setDocuments(parseDataSelect(arg.data));
    });
  };

  const debounceFc = useCallback(debounce(debounceDocument, 400), []);

  const findDocuments = (value) => {
    debounceFc(value);
  };

  const linkToBorrowSearch = () => {
    const data = {
      borrowId: borrow.id,
      directFrom: Borrow.create,
    };
    const queryString = objectToQueryString(data);
    return navigate(`/borrow/search?${queryString}`);
  };

  return (
    <>
      {hiddenForm ? (
        <Space hidden={true} direction="vertical" style={{ width: '100%', textAlign: 'center', fontWeight: 600 }}>
          <Alert message="Bạn nên tạo Phiếu Mượn từ tab Độc Giả -> Tìm Kiếm -> nhấn vào More Action -> chọn Tạo Phiếu Mượn" banner />
          <Button size="large" icon={<ArrowLeftOutlined />} onClick={() => navigate('/reader/search')}>
            Trở Về Trang Tìm Kiếm Độc Giả
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
          <Form.Item name="readerId" label="Mã Độc Giả" style={props.widthStyle}>
            <Input disabled={true} />
          </Form.Item>

          <Form.Item name="fullName" label="Tên Độc Giả" style={props.widthStyle} rules={[{ required: true, message: 'Please input name' }]}>
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
            label="Tài Liệu Cần Mượn"
            style={props.widthStyle}
            rules={[
              {
                validator: async (_, values = []) => {
                  const doc = values.every((id) => documents.map((document) => document.value).includes(id));
                  if (!doc || !values.length) return Promise.reject(new Error('Please select item on List!'));
                },
              },
            ]}
          >
            <Select
              mode="multiple"
              options={documents}
              onSearch={findDocuments}
              placeholder=""
              className="custom-autocomplete"
              filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            />
          </Form.Item>

          <Form.Item label={' '} {...props.tailFormItemLayout} style={{ ...props.widthStyle }}>
            <Button
              disabled={Object.keys(borrow).length}
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
              disabled={!Object.keys(borrow).length}
              style={{ minWidth: '47%', marginLeft: 10 }}
              onClick={linkToBorrowSearch}
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

export default BorrowCreatePage;
