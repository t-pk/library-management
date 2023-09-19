import React, { useState, useEffect } from 'react';
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  message,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { internalCall, getUserId, delay } from '../../../actions';


const reStyle = {
  minWidth: "32%"
};

const formItemLayout = { labelCol: { xs: { span: 30 }, sm: { span: 30 } }, wrapperCol: { xs: { span: 40 }, sm: { span: 23 } } };
const tailFormItemLayout = { wrapperCol: { xs: { span: 40, offset: 0 }, sm: { span: 30, offset: 0 } }, };

const DocumentCreatePage = () => {
  const [form] = Form.useForm();
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [checkPublisher, setCheckPublisher] = useState(false);

  const key = 'updatable';

  useEffect(() => { 
    getInitData(); 
    form.validateFields(['publisher']);
    console.log("asdasd");
  }, 
    [checkPublisher, form]);

  const getInitData = () => {
    internalCall({ key: 'publisher-search', data: {} });
    window.electron.ipcRenderer.once('ipc-database', async (arg) => {
      if (arg && arg.data) {
        setPublishers(arg.data.map((item) => ({ id: item.id, value: item.name })));
      }
    });
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
    console.log("values", values);
    setCheckPublisher(true);
    
    setLoading(true);
    showMessage('loading', 'loading...')
    internalCall({ key: 'document-create', data: values });

    window.electron.ipcRenderer.once('ipc-database', async (arg) => {

      await delay(1000);
      setLoading(false);
      messageApi.destroy(key);
      if (arg.data) {
        showMessage('success', 'Created Publisher');
      }
      else showMessage('error', arg.error);
      await delay(2000);
      messageApi.destroy(key);
    });
  };


  return (
    <> {contextHolder}
      <Form {...formItemLayout} form={form} layout="vertical" name="dynamic_rule" onFinish={onFinish} initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }}
        style={{ display: 'flex', flexWrap: 'wrap' }}
        scrollToFirstError>

        <Form.Item name="Id" label="Mã Tài Liệu" style={reStyle}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="type" label="Loại Tài Liệu" style={reStyle} rules={[{ required: true, message: 'Please input your type!', whitespace: true, }]}>
          <Input />
        </Form.Item>

        <Form.Item name="quatity" label="Số Lượng" style={reStyle} rules={[{ required: true, message: 'Please input your quantity!' }, { type: 'number', min: 1, message: 'min >= 1' }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="author" label="Tác Giả" style={reStyle} rules={[{ required: true, message: 'Please select author!' },]} >
          <Input style={{ width: '100%', }} />
        </Form.Item>

        <Form.Item name="publisher" label="Nhà Xuất Bản" style={reStyle}
          rules={[{ required: true, message: 'Please input publisher!' }, { required: checkPublisher, message: 'Please select publisher!' }]} >
          <AutoComplete
            options={publishers}
            placeholder=""
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          />
        </Form.Item>

        <Form.Item name="name" label="Tên Tài Liệu" style={reStyle} rules={[{ required: true, message: 'Please input name', },]} >
          <Input.TextArea rows={5} showCount maxLength={200} />
        </Form.Item>

        <Form.Item name="special" valuePropName="checked" style={{ ...reStyle }} {...tailFormItemLayout} >
          <Checkbox>  Là Tài Liệu Đặc Biệt </Checkbox>
        </Form.Item>

        <Form.Item {...tailFormItemLayout} style={{ ...reStyle, textAlign: 'center' }}>
          <Button loading={loading} style={{ minWidth: '50%' }} type="primary" htmlType="submit" icon={<SaveOutlined />}> Submit </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default DocumentCreatePage;