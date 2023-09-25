import React, { useState, useEffect } from 'react';
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Row,
  Select,
  message,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { internalCall, getUserId, delay } from '../../../actions';

const reStyle = { minWidth: "32%" };

const formItemLayout = { labelCol: { xs: { span: 30 }, sm: { span: 30 } }, wrapperCol: { xs: { span: 40 }, sm: { span: 23 } } };
const tailFormItemLayout = { wrapperCol: { xs: { span: 40, offset: 0 }, sm: { span: 30, offset: 0 } }, };

const DocumentCreatePage = () => {
  const [form] = Form.useForm();
  const [publishers, setPublishers] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const key = 'updatable';

  useEffect(() => { getInitData() }, []);

  const getInitData = () => {

    internalCall({ key: 'publisher-search'});
    internalCall({ key: 'author-search'});
    internalCall({ key: 'documentType-search'});

    const getData = async (arg) => {
      if (arg && arg.data) {
        if (arg.key === 'publisher-search')
          setPublishers(arg.data.map((item) => ({ id: item.id, value: item.name })));
        if (arg.key === 'author-search')
          setAuthors(arg.data.map((item) => ({ id: item.id, value: item.name })));
        if (arg.key === 'documentType-search')
          setDocumentTypes(arg.data.map((item) => ({ id: item.id, value: item.name })));
      }
    };
    window.electron.ipcRenderer.on('ipc-database', getData);
  }

  const showMessage = (type, content) => {
    messageApi.open({
      key, type: type, content: content, duration: 5, className: 'custom-class',
      style: {
        textAlign: 'right',
        paddingRight: 20,
        marginTop: '47%',
      },
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    showMessage('loading', 'loading...')
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
      special: values.special
    }
    internalCall({ key: 'document-create', data });

    window.electron.ipcRenderer.once('ipc-database', async (arg) => {
      if (arg.data) {
        await delay(1000);
        setLoading(false);
        messageApi.destroy(key);
        if (arg.data) showMessage('success', 'Created Publisher');

        else showMessage('error', arg.error);
        await delay(2000);
        messageApi.destroy(key);
      }
    });
  };

  return (
    <> {contextHolder}
      <Form {...formItemLayout} form={form} layout="vertical" name="dynamic_rule" onFinish={onFinish} initialValues={{ quantity: 1, special: false }}
        style={{ display: 'flex', flexWrap: 'wrap' }}
        scrollToFirstError>

        <Form.Item name="id" label="Mã Tài Liệu" style={reStyle}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="name" label="Tên Tài Liệu" style={reStyle} rules={[{ required: true, message: 'Please input name', }]} >
          <Input.TextArea rows={1} showCount maxLength={200} />
        </Form.Item>

        <Form.Item name="documentType" label="Loại Tài Liệu" style={reStyle} rules={[
          { required: true, message: 'Required!', },
          {
            validator: async (_, name) => {
              const pub = documentTypes.find((publisher) => publisher.value === name);
              if (!pub || !name) return Promise.reject(new Error('Please select item on List!'));
            }
          }]} >
          <AutoComplete
            options={documentTypes}
            placeholder=""
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          />
        </Form.Item>

        <Form.Item name="quantity" label="Số Lượng" style={reStyle} rules={[{ required: true, message: 'Please input your quantity!' }, { type: 'number', min: 1, max: 9999, message: 'min >= 1 and max <= 9999' }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="author" label="Tác Giả" style={reStyle} rules={[
          { required: true, message: 'Required!', },
          {
            validator: async (_, name) => {
              const pub = authors.find((publisher) => publisher.value === name);
              if (!pub || !name) return Promise.reject(new Error('Please select item on List!'));
            }
          }]} >
          <AutoComplete
            options={authors}
            placeholder=""
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          />
        </Form.Item>

        <Form.Item name="publisher" label="Nhà Xuất Bản" style={reStyle}
          rules={[
            { required: true, message: 'Required!', },
            {
              validator: async (_, name) => {
                const pub = publishers.find((publisher) => publisher.value === name);
                if (!pub || !name) return Promise.reject(new Error('Please select item on List!'));
              }
            }]} >
          <AutoComplete
            options={publishers}
            placeholder=""
            className='custom-autocomplete'
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          />
        </Form.Item>

        <Form.Item name="publishYear" label="Năm Xuất Bản" style={reStyle} rules={[{ required: true, message: 'Please input your publish Year!' }, { type: 'number', max: new Date().getFullYear(), min: 1, message: `min >= 1 and max <= ${new Date().getFullYear()}` }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="special" label={" "} valuePropName="checked" style={{ ...reStyle }} {...tailFormItemLayout} >
          <Checkbox> Là Tài Liệu Đặc Biệt </Checkbox>
        </Form.Item>

        <Form.Item label={" "} {...tailFormItemLayout} style={{ ...reStyle, textAlign: 'center' }}>
          <Button loading={loading} style={{ minWidth: '50%' }} type="primary" htmlType="submit" icon={<SaveOutlined />}> Submit </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default DocumentCreatePage;