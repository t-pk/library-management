import React, { useState, useCallback, useEffect } from 'react';
import {
  SettingOutlined,
  DownOutlined,
  CaretDownOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  AutoComplete,
  Button,
  Cascader,
  Input,
  Select,
  Space,
  Row,
  Dropdown,
  Checkbox,
  Table,
  Form,
  Tag,
  InputNumber,
  Radio,
} from 'antd';
import debounce from 'lodash.debounce';
import { internalCall } from '../../../../renderer/actions';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { objectToQueryString } from '../../../utils/index';

const { Option } = Select;
import './ui.scss';

const formItemLayout = {
  labelCol: { xs: { span: 30 }, sm: { span: 30 } },
  wrapperCol: { xs: { span: 40 }, sm: { span: 23 } },
};
const reStyle = { minWidth: '32%' };

const ReaderSearchPage = () => {
  const [form] = Form.useForm();
  const [inputState, setinputState] = useState({ name: '', id: '', type: '' });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const readerTypeId = Form.useWatch('readerTypeId', form);
  const navigate = useNavigate();

  const redirectCreateBorrow = (record) => () => {
    console.log('record', record);
    const data = {
      readerId: record.id,
      citizenIdentify: record.citizenIdentify,
      fullName: record.fullName,
      readerTypeId: record.readerTypeId,
      studentId: record.studentId,
      civilServantId: record.civilServantId || '',
    };
    const queryString = objectToQueryString(data);
    return navigate(`/borrow/create?${queryString}`);
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: 'Tên Độc giả',
      dataIndex: 'fullName',
    },
    {
      title: 'Loại Độc Giả',
      dataIndex: ['readerType', 'name'],
      render: (text, record) => (
        <Tag color={text === 'Sinh Viên' ? 'green' : 'orange'}>{text}</Tag>
      ),
    },
    {
      title: 'Mã Sinh Viên',
      dataIndex: 'studentId',
    },
    {
      title: 'Mã Cán Bộ - Nhân Viên',
      dataIndex: 'civilServantId',
    },
    {
      title: 'Căn Cước Công Dân',
      dataIndex: 'citizenIdentify',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Địa Chỉ Email',
      dataIndex: 'email',
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items: [
                {
                  label: (
                    <a onClick={redirectCreateBorrow(record)}>Tạo Phiếu Mượn</a>
                  ),
                  key: '0',
                },
              ],
            }}
          >
            <a>
              More Action <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const handleDebounceFn = (reState) => {
    internalCall({ key: 'reader-search', data: reState });
    window.electron.ipcRenderer.once('ipc-database', async (arg) => {
      setLoading(false);
      if (arg && arg.data) {
        console.log(arg.data);
        setDocuments(arg.data);
      }
    });
  };
  const debounceFc = useCallback(debounce(handleDebounceFn, 200), []);

  useEffect(() => {
    debounceFc(inputState);
    getInitData();
    if (readerTypeId === 1) {
      form.setFieldsValue({ civilServantId: undefined });
    }
    if (readerTypeId === 2) {
      form.setFieldsValue({ studentId: undefined });
    }
    if (readerTypeId === undefined) {
      form.setFieldsValue({ studentId: undefined });
      form.setFieldsValue({ civilServantId: undefined });
    }
  }, [readerTypeId]);

  const getInitData = () => {
    internalCall({ key: 'readerType-search' });

    const getData = async (arg) => {
      if (arg && arg.data) {
        const resReaders = arg.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        resReaders.push({ id: undefined, label: 'Skip' });
        setReaderTypes(resReaders);
      }
    };
    window.electron.ipcRenderer.once('ipc-database', getData);
  };

  const onChange = (e) => {
    setLoading(true);
    let reState = {};
    if (e.target.name === 'readerTypeId') {
      reState = { ...inputState, [e.target.name]: e.target.value };
    } else {
      reState = { ...inputState, [e.target.id]: e.target.value };
    }

    setinputState(reState);
    debounceFc(reState);
  };

  const onClick = () => {
    setLoading(true);
    debounceFc(inputState);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        layout="vertical"
        name="dynamic_rule"
        style={{ display: 'flex', flexWrap: 'wrap' }}
        scrollToFirstError
        initialValues={{ readerTypeId: undefined }}
      >
        <Form.Item label="Mã Độc Giả" style={reStyle}>
          <Input id="id" onChange={onChange} />
        </Form.Item>

        <Form.Item label="Tên Độc Giả" style={reStyle}>
          <Input id="fullName" onChange={onChange} />
        </Form.Item>

        <Form.Item label="Căn Cước Công Dân" style={reStyle}>
          <Input id="citizenIdentify" onChange={onChange} />
        </Form.Item>

        <Form.Item name="studentId" label="Mã Sinh Viên" style={reStyle}>
          <Input
            disabled={readerTypeId && readerTypeId !== 1}
            id="studentId"
            onChange={onChange}
          />
        </Form.Item>

        <Form.Item
          name="civilServantId"
          label="Mã Cán Bộ - Nhân Viên"
          style={reStyle}
        >
          <Input
            disabled={readerTypeId && readerTypeId !== 2}
            id="civilServantId"
            onChange={onChange}
          />
        </Form.Item>

        <Form.Item label="Số Điện Thoại" style={reStyle}>
          <Input id="phoneNumber" onChange={onChange} />
        </Form.Item>

        <Form.Item label="Địa Chỉ Email" style={reStyle}>
          <Input id="email" onChange={onChange} />
        </Form.Item>

        <Form.Item name="readerTypeId" label="Loại Độc Giả" style={reStyle}>
          <Radio.Group
            name="readerTypeId"
            onChange={onChange}
            options={readerTypes}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>

        <Form.Item style={reStyle} label=" ">
          <Button onClick={onClick} type="primary" icon={<SearchOutlined />}>
            Search
          </Button>
        </Form.Item>
      </Form>
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={documents}
        loading={loading}
        rowKey={'id'}
        tableLayout={'fixed'}
        scroll={{ x: 1500 }}
      />
    </>
  );
};

export default ReaderSearchPage;
