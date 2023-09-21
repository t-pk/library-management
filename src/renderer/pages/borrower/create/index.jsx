import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Form,
  Input,
  message,
  Select,
  Radio,
  AutoComplete
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { internalCall, delay } from '../../../actions';
import { queryStringToObject } from '../../../utils/index';
import debounce from 'lodash.debounce';

const reStyle = { minWidth: "32%" };

const formItemLayout = { labelCol: { xs: { span: 30 }, sm: { span: 30 } }, wrapperCol: { xs: { span: 40 }, sm: { span: 23 } } };
const tailFormItemLayout = { wrapperCol: { xs: { span: 40, offset: 0 }, sm: { span: 30, offset: 0 } }, };

const BorrowerCreatePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const [readers, setReaders] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();
  const readerTypeId = Form.useWatch('readerTypeId', form);
  const location = useLocation();
  const key = 'updatable';

  useEffect(() => {
    let readerInfo = queryStringToObject(location.search);
    readerInfo.readerTypeId = +readerInfo.readerTypeId;
    form.setFieldsValue(readerInfo);
    console.log("readerInfo", readerInfo);

    getInitData();
    if (readerTypeId === 1) {
      form.setFieldsValue({ civilServantId: undefined });
    }
    if (readerTypeId === 2) {
      form.setFieldsValue({ studentId: undefined });
    }
  }, [readerTypeId, location]);

  const getInitData = () => {

    internalCall({ key: 'readerType-search', data: {} });
    internalCall({ key: 'document-search', data: {} });


    const getData = async (arg) => {
      if (arg && arg.data) {
        if (arg.key === 'readerType-search')
          setReaderTypes(arg.data.map((item) => ({ value: item.id, label: item.name })));
        if (arg.key === 'document-search')
          setDocuments(arg.data.map((item) => ({ id: item.id, value: `${item.id} - ${item.name}` })));
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

  const onChange = (e) => {
    console.log(e);
  }

  const onFinish = async (values) => {
    console.log(values);
    setLoading(true);
    showMessage('loading', 'loading...')
    const data = { ...values };

    internalCall({ key: 'borrower-create', data });

    window.electron.ipcRenderer.once('ipc-database', async (arg) => {
      if (arg.data) {
        await delay(1000);
        setLoading(false);
        messageApi.destroy(key);
        if (arg.data) showMessage('success', 'Created Reader.');

        else showMessage('error', arg.error);
        await delay(2000);
        messageApi.destroy(key);
      }
    });
  };

  const getReaders = async (value) => {
    internalCall({ key: 'reader-create', data: { name: value } });
  }

  const debounceDocument = async (value) => {
    internalCall({ key: 'document-search', data: { name: value } });

    window.electron.ipcRenderer.once('ipc-database', (arg) => {
      setDocuments(arg.data.map((item) => ({ id: item.id, value: `${item.id} - ${item.name}` })));
      console.log(documents);
    });
  }
  
  const debounceFc = useCallback(debounce(debounceDocument, 400), []);

  const findDocuments = (value) => {
    debounceFc(value);
  }

  return (
    <> {contextHolder}
      <Form {...formItemLayout} form={form} layout="vertical" name="dynamic_rule" onFinish={onFinish} initialValues={{ quantity: 1, special: false, readerTypeId: 1 }}
        style={{ display: 'flex', flexWrap: 'wrap' }}
        scrollToFirstError>

        <Form.Item name="id" label="Mã Phiếu Mượn" style={reStyle}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="readerId" label="Mã Độc Giả" style={reStyle} >
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="fullName" label="Tên Độc Giả" style={reStyle} rules={[{ required: true, message: 'Please input name', }]} >
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="studentId" label="Mã Sinh Viên" style={reStyle} rules={[{ required: readerTypeId === 1, message: 'Please input student id!' }, { type: 'string', min: 5, max: 12, message: ' 5 <= student id <= 12' }]}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="civilServantId" label="Mã Cán Bộ - Nhân Viên" style={reStyle} rules={[{ required: readerTypeId !== 1, message: 'Please input civil servant!' }, { type: 'string', min: 5, max: 12, message: ' 5 <= civil servant <= 12' }]}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="citizenIdentify" label="Căn Cước Công Dân" style={reStyle} rules={[{ required: true, message: 'Please input citizen identify!' }, { type: 'string', min: 9, max: 15, message: ' 9 <= citizen identify <= 15' }]}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="readerTypeId" label="Loại Độc Giả" style={reStyle}>
          <Radio.Group options={readerTypes} optionType="button" buttonStyle="solid" disabled={true} />
        </Form.Item>

        <Form.Item name="documentIds" label="Tài Liệu Cần Mượn" style={reStyle}
          rules={[{
            validator: async (_, values = []) => {
              const doc = values.every((id) => documents.map((document) => document.value).includes(id));
              if (!doc || !values.length) return Promise.reject(new Error('Please select item on List!'));
            }
          }]} >
          <Select
            mode='multiple'
            options={documents}
            onSearch={findDocuments}
            placeholder=""
            className='custom-autocomplete'
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          />
        </Form.Item>

        <Form.Item label={" "} {...tailFormItemLayout} style={{ ...reStyle }}>
          <Button loading={loading} style={{ minWidth: '96%' }} type="primary" htmlType="submit" icon={<SaveOutlined />}> Submit </Button>
        </Form.Item>

      </Form>
    </>
  );
};

export default BorrowerCreatePage;