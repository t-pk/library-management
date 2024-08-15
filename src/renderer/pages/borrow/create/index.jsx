import { useState, useEffect, useCallback } from 'react';
import { Button, Form, Input, Select, Radio, Alert, Space } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { delay, objectToQueryString } from '../../../utils/helper';
import { queryStringToObject, parseDataSelect } from '../../../utils/helper';
import debounce from 'lodash.debounce';
import { Borrow, Document, ReaderType } from '../../../constants';

const BorrowCreatePage = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [hiddenForm, setHiddenForm] = useState(false);
  const [borrow, setBorrow] = useState({});
  const location = useLocation();

  useEffect(() => {
    let readerInfo = queryStringToObject(location.search);
    setHiddenForm(!Object.keys(readerInfo).length);

    if (Object.keys(readerInfo).length) {
      getInitData();
      form.setFieldsValue(readerInfo);
    }
  }, [location]);

  const getInitData = async () => {
    const readerType = await props.invoke({ key: ReaderType.search });
    const documentSearch = await props.invoke({ key: Document.search, data: { availableQuantity: 1 } });

    setDocuments(parseDataSelect(documentSearch.data || []));
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
        props.openNotification('success', 'Đã Tạo Phiếu Mượn.');
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
          initialValues={{ quantity: 1, special: false, timeBorrow: 14 }}
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
            hasFeedback
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

          <Form.Item
            name="timeBorrow"
            label="Thời Gian Mượn (Đơn Vị: Ngày)"
            style={props.widthStyle}
            hasFeedback
          >
            <Select
              options={[{ id: 7, value: 7 }, { id: 14, value: 14 }, { id: 30, value: 30 }]}
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
