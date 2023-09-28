import { useState, useEffect } from 'react';
import { AutoComplete, Button, Checkbox, Form, Input, InputNumber } from 'antd';
import { SaveOutlined, EyeOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { delay, queryStringToObject, objectToQueryString } from '../../../utils/helper';
import { Author, Document, DocumentType, Publisher } from 'renderer/constants';

const DocumentCreatePage = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [publishers, setPublishers] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState({}); 

  useEffect(() => {
    getInitData();
    let documentInfo = queryStringToObject(location.search);
    if (documentInfo && Object.keys(documentInfo).length) {
      documentInfo.id = +documentInfo.id;
      documentInfo.quantity = +documentInfo.quantity;
      documentInfo.publishYear = +documentInfo.publishYear;
      documentInfo.special = documentInfo.special === 'true';
      form.setFieldsValue(documentInfo);
      location.search = {};
    }
    }, []);

  const getInitData = () => {
    props.callDatabase({ key: Publisher.search });
    props.callDatabase({ key: Author.search });
    props.callDatabase({ key: DocumentType.search });

    props.listenOn((arg) => {
      if (arg && arg.data) {
        if (arg.key === Publisher.search) setPublishers(arg.data.map((item) => ({ id: item.id, value: item.name })));
        if (arg.key === Author.search) setAuthors(arg.data.map((item) => ({ id: item.id, value: item.name })));
        if (arg.key === DocumentType.search) setDocumentTypes(arg.data.map((item) => ({ id: item.id, value: item.name })));
      }
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    const documentType = documentTypes.find((documentType) => documentType.value === values.documentType);
    const author = authors.find((author) => author.value === values.author);
    const publisher = publishers.find((publisher) => publisher.value === values.publisher);
    const data = {
      name: values.name,
      documentTypeId: documentType.id,
      authorId: author.id,
      publisherId: publisher.id,
      quantity: values.quantity,
      publishYear: values.publishYear,
      special: values.special,
    };
    props.callDatabase({ key: Document.create, data });

    props.listenOnce(Document.create, async (arg) => {
      await delay(300);
      if (arg.data) {
        setDocument(arg.data);
        props.openNotification('success', 'Thêm - Cập Nhật thành công Tài Liệu');
        form.resetFields();
      }
      setLoading(false);
    });
  };

  const linkToDocumentSearch = () => {
    const data = {
      id: document.id,
      directFrom: Document.create,
    };
    const queryString = objectToQueryString(data);
    return navigate(`/document/search?${queryString}`);
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
        <Form.Item name="id" label="Mã Tài Liệu" style={props.widthStyle}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="name" label="Tên Tài Liệu" style={props.widthStyle} rules={[{ required: true, message: 'Please input name' }]}>
          <Input.TextArea rows={1} showCount maxLength={200} />
        </Form.Item>

        <Form.Item
          name="documentType"
          label="Loại Tài Liệu"
          style={props.widthStyle}
          rules={[
            { required: true, message: 'Required!' },
            {
              validator: async (_, name) => {
                const pub = documentTypes.find((publisher) => publisher.value === name);
                if (!pub || !name) return Promise.reject(new Error('Please select item on List!'));
              },
            },
          ]}
        >
          <AutoComplete
            options={documentTypes}
            placeholder=""
            filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Số Lượng"
          style={props.widthStyle}
          rules={[
            { required: true, message: 'Please input your quantity!' },
            {
              type: 'number',
              min: 1,
              max: 9999,
              message: 'min >= 1 and max <= 9999',
            },
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="author"
          label="Tác Giả"
          style={props.widthStyle}
          rules={[
            { required: true, message: 'Required!' },
            {
              validator: async (_, name) => {
                const pub = authors.find((publisher) => publisher.value === name);
                if (!pub || !name) return Promise.reject(new Error('Please select item on List!'));
              },
            },
          ]}
        >
          <AutoComplete
            options={authors}
            placeholder=""
            filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          />
        </Form.Item>

        <Form.Item
          name="publisher"
          label="Nhà Xuất Bản"
          style={props.widthStyle}
          rules={[
            { required: true, message: 'Required!' },
            {
              validator: async (_, name) => {
                const pub = publishers.find((publisher) => publisher.value === name);
                if (!pub || !name) return Promise.reject(new Error('Please select item on List!'));
              },
            },
          ]}
        >
          <AutoComplete
            options={publishers}
            placeholder=""
            className="custom-autocomplete"
            filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          />
        </Form.Item>

        <Form.Item
          name="publishYear"
          label="Năm Xuất Bản"
          style={props.widthStyle}
          rules={[
            { required: true, message: 'Please input your publish Year!' },
            {
              type: 'number',
              max: new Date().getFullYear(),
              min: 1,
              message: `min >= 1 and max <= ${new Date().getFullYear()}`,
            },
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="special" label={' '} valuePropName="checked" style={{ ...props.widthStyle }} {...props.tailFormItemLayout}>
          <Checkbox> Là Tài Liệu Đặc Biệt </Checkbox>
        </Form.Item>

        <Form.Item label={' '} {...props.tailFormItemLayout} style={{ ...props.widthStyle }}>
          <Button  disabled={Object.keys(document).length} loading={loading} style={{ minWidth: '47%' }} type="primary" htmlType="submit" icon={<SaveOutlined />}>
            {' '}
            Submit{' '}
          </Button>
          <Button
              type="primary"
              disabled={!Object.keys(document).length}
              style={{ minWidth: '47%', marginLeft: 10 }}
              onClick={linkToDocumentSearch}
              icon={<EyeOutlined />}
            >
              {' '}
              Xem {' '}
            </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default DocumentCreatePage;
