import React, { useState, useCallback, useEffect } from 'react';
import { SettingOutlined, DownOutlined, CaretDownOutlined, CheckSquareOutlined, CheckOutlined, SearchOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Cascader, Input, Select, Space, Row, Dropdown, Checkbox, Table, Form, Tag, InputNumber, Radio } from 'antd';
import debounce from 'lodash.debounce';
import { internalCall } from '../../../../renderer/actions';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { formatDMY_HMS, formatDMY, objectToQueryString } from '../../../utils/index';
const { Option } = Select;

import './ui.scss';

const formItemLayout = { labelCol: { xs: { span: 30 }, sm: { span: 30 } }, wrapperCol: { xs: { span: 40 }, sm: { span: 23 } } };
const reStyle = { minWidth: "32%" };

const PenaltySearchPage = (props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [inputState, setinputState] = useState({ fullName: '', id: 0, studentId: '' });
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const readerTypeId = Form.useWatch('readerTypeId', form);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 20; // Number of items per page

  const handleDebounceFn = (reState) => {
    props.callDatabase({ key: 'penalty-search', data: reState });
    props.listenOnce('penalty-search', (arg) => {
      console.log('penarg', arg);
      setLoading(false);
      setPenalties(arg.data || []);
    });
  }

  const debounceFc = useCallback(debounce(handleDebounceFn, 200), []);

  const columns = [
    {
      title: 'Mã Phiếu Phạt',
      dataIndex:  'id',
      render: (id) => id,
      align: 'center',
    },
    {
      title: 'Mã Độc Giả',
      dataIndex:  ['return', 'borrow', 'reader', 'id'],
      render: (id) => id,
      align: 'center',
    },
    {
      title: 'Tên Độc Giả',
      dataIndex:  ['return', 'borrow', 'reader', 'fullName'],
      render: (fullName) => fullName,
      align: 'center',
    },
    {
      title: 'Số  Tiền Phạt',
      dataIndex: 'totalAmount',
      align: 'center',
      render: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')+ ' vnđ'
    },
    {
      title: 'Đã Đóng Phạt',
      dataIndex: 'compensation',
      render: (compensation) => compensation && <CheckCircleOutlined style={{ fontSize: 20, color: 'green' }} />,
      align: 'center',
    },
    {
      title: 'Mô Tả',
      dataIndex: 'description',
      align: 'center',
    },
    {
      title: 'Ngày Tạo Phiếu Phạt',
      dataIndex: 'createdAt',
      align: 'center',
      render: (dateTime) => {
        return formatDMY_HMS(dateTime)
      },
    },
    {
      title: 'Mã Sinh Viên',
      dataIndex: 'studentId',
      dataIndex:  ['return', 'borrow', 'reader', 'studentId'],
      align: 'center',
    },
    {
      title: 'Mã N.Viên - C.Bộ',
      dataIndex: 'civilServantId',
      dataIndex:  ['return', 'borrow', 'reader', 'civilServantId'],
      align: 'center',
    },
  ];

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
    };

  }, [readerTypeId]);

  const getInitData = () => {

    internalCall({ key: 'readerType-search' });

    const getData = async (arg) => {
      if (arg && arg.data) {
        if (arg.key === 'readerType-search') {
          const resReaders = arg.data.map((item) => ({ value: item.id, label: item.name }));
          resReaders.push({ id: undefined, label: 'Skip' });
          setReaderTypes(resReaders);
        }
      }
    };
    window.electron.ipcRenderer.on('ipc-database', getData);
  }

  const onChange = (e) => {
    setLoading(true);
    setCurrentPage(1);
    let reState = {};
    if (e.target.name === 'readerTypeId') {
      reState = { ...inputState, [e.target.name]: e.target.value };
    }
    else {
      reState = { ...inputState, [e.target.id]: e.target.value };
    }

    setinputState(reState);
    debounceFc(reState);
  };

  const onClick = () => {
    setLoading(true);
    debounceFc(inputState);
  }

  const debouncePenalty = async (value) => {
    const [id, name] = value.split('-');
    let data = {};
    if (id && !isNaN(id)) data.id = id.trim();
    if (name) data.name = name.trim();
    if (!name && isNaN(id)) data.name = value.trim();

    internalCall({ key: 'penalty-search', data });

    window.electron.ipcRenderer.once('ipc-database', (arg) => {
      setPenalties(arg.data);
    });
  }

  const documentFc = useCallback(debounce(debouncePenalty, 400), []);

  const findpenalties = (value) => {
    documentFc(value);
  }

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Form  {...formItemLayout} form={form}
        layout="vertical" name="dynamic_rule"
        style={{ display: 'flex', flexWrap: 'wrap' }}
        scrollToFirstError initialValues={{ readerTypeId: undefined }}>

        <Form.Item label="Mã Độc Giả" style={reStyle}>
          <Input id="readerId" onChange={onChange} />
        </Form.Item>

        <Form.Item label="Tên Độc Giả" style={reStyle}  >
          <Input id="fullName" onChange={onChange} />
        </Form.Item>

        <Form.Item name="studentId" label="Mã Sinh Viên" style={reStyle} >
          <Input disabled={readerTypeId && readerTypeId !== 1} id="studentId" onChange={onChange} />
        </Form.Item>

        <Form.Item name="civilServantId" label="Mã Cán Bộ - Nhân Viên" style={reStyle} >
          <Input disabled={readerTypeId && readerTypeId !== 2} id="civilServantId" onChange={onChange} />
        </Form.Item>

        <Form.Item name="readerTypeId" label="Loại Độc Giả" style={reStyle}>
          <Radio.Group name="readerTypeId" onChange={onChange} options={readerTypes} optionType="button" buttonStyle="solid" />
        </Form.Item>

        <Form.Item style={reStyle} label=" ">
          <Button onClick={onClick} type='primary' icon={<SearchOutlined />}>Search</Button>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={penalties}
        bordered={true}
        loading={loading}
        rowKey={'id'}
        tableLayout={'fixed'}
        size='small'
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: penalties.length,
          onChange: handlePageChange,
        }}
        scroll={{ x: 1400, y: 450 }}
      />
    </>
  )
};
export default PenaltySearchPage;