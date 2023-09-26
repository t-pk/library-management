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

const ReturnSearchPage = (props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [inputState, setinputState] = useState({ fullName: '', id: 0, studentId: '' });
  const [returns, setReturns] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const readerTypeId = Form.useWatch('readerTypeId', form);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 20; // Number of items per page

  const handleDebounceFn = (reState) => {
    props.callDatabase({ key: 'return-search', data: reState });
    const test = (arg) => {
      setLoading(false);
      setReturns(arg.data);
    }
    props.listenOnce('return-search', test);
    // internalCall({ key: 'return-search', data: reState });
    // window.electron.ipcRenderer.once('ipc-database', async (arg) => {
    //   setLoading(false);
    //   if (arg && arg.data) {
    //     setReturns(arg.data);
    //   }
    // });
  }
  const createReturns = (record) => () => {
    console.log("key", record);
    const data = {
      returnId: record.returnId, readerId: record.return.reader.id,
      readerName: record.return.reader.fullName,
      citizenIdentify: record.return.reader.citizenIdentify,
      civilServantId: record.return.reader.civilServantId,
      studentId: record.return.reader.studentId,
      readerTypeId: record.return.reader.readerTypeId,
    };
    const queryString = objectToQueryString(data);
    return navigate(`/penalty/create?${queryString}`);
  };


  const debounceFc = useCallback(debounce(handleDebounceFn, 200), []);
  const groupByReturns = (iReturn, index) => {
    const reIndex = currentPage >= 2 ? (currentPage * pageSize - pageSize) + index : index;
    let boolean = false;
    if (reIndex === 0) {
      boolean = true;
    }
    else if (iReturn.returnId !== (returns[reIndex - 1].returnId)) {
      boolean = true;
    }
    else {
      boolean = (iReturn.countReturnId - iReturn.rest) !== (returns[reIndex - 1].countReturnId - returns[reIndex - 1].rest);
      let count = 0;
      if (reIndex % 10 === 0) {
        for (let i = 0; i < reIndex; i++) {
          count += returns[i].countReturnId;
        }
      }
    };
    return {
      rowSpan: boolean ? (iReturn.countReturnId - iReturn.rest) : 0
    }
  };

  const showDropDrown = (record) => {
    return returns.filter((iReturn) => iReturn.iReturnId === record.iReturnId).some((iReturn) => !iReturn.returnDetail);
  }

  const columns = [
    {
      title: 'Mã Phieu Tra',
      dataIndex: ['return', 'id'],
      render: (id) => id,
      align: 'center',
      onCell: groupByReturns
    },
    {
      title: 'Mã Độc Giả',
      dataIndex: ['return', 'reader', 'id'],
      render: (id) => id,
      align: 'center',
      onCell: groupByReturns
    },
    {
      title: 'Tên Độc Giả',
      dataIndex: ['return', 'reader', 'fullName'],
      render: (fullName) => fullName,
      align: 'center',
      onCell: groupByReturns
    },
    {
      title: 'Tên Tài Liệu',
      align: 'center',
      dataIndex: ['borrowDetail', 'document', 'name'],
    },
    // {
    //   title: 'Đã Trả',
    //   dataIndex: 'returnDetail',
    //   align: 'center',
    //   render: (isReturn) => isReturn && <CheckCircleOutlined style={{ fontSize: 20, color: 'green' }} />
    // },
    {
      title: 'Ngày Trả',
      dataIndex: 'createdAt',
      align: 'center',
      render: (dateTime) => {
        return dateTime && formatDMY_HMS(dateTime)
      },
    },
    {
      title: 'Mã Sinh Viên',
      dataIndex: ['return', 'reader', 'studentId'],
      render: (studentId) => studentId,
      align: 'center',
      onCell: groupByReturns
    },
    {
      title: 'Mã N.Viên - C.Bộ',
      dataIndex: ['return', 'reader', 'civilServantId'],
      render: (civilServantId) => civilServantId,
      align: 'center',
      onCell: groupByReturns
    },
    // {
    //   title: 'Ngày Mượn',
    //   dataIndex: 'createdAt',
    //   align: 'center',
    //   render: (dateTime) => {
    //     return formatDMY_HMS(dateTime)
    //   },
    //   onCell: groupByReturns
    // },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 150,
      onCell: groupByReturns,
      render: (_, record) => {
        let items = [{
          label: <a onClick={createReturns(record)}>Tạo Phiếu Phạt</a>,
          key: '1',
        }];
        return <Space size="middle">
          <Dropdown menu={{
            items
          }}>
            <a>
              More Action <DownOutlined />
            </a>
          </Dropdown>
        </Space>

      }
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
    // internalCall({ key: 'iReturn-search' });
    internalCall({ key: 'document-search' });

    const getData = async (arg) => {
      if (arg && arg.data) {
        if (arg.key === 'readerType-search') {
          const resReaders = arg.data.map((item) => ({ value: item.id, label: item.name }));
          resReaders.push({ id: undefined, label: 'Skip' });
          setReaderTypes(resReaders);
        }

        // if (arg.key === 'return-search') {
        //   setReturns(arg.data);
        // }
        if (arg.key === 'document-search') {
          setDocuments(arg.data.map((item) => ({ id: item.id, value: `${item.id} - ${item.name}` })));
        }
      }
    };
    window.electron.ipcRenderer.on('ipc-database', getData);
  }


  const onChange = (e) => {
    setLoading(true);
    setCurrentPage(1);
    let reState = {};
    if (e.target.id === 'documents') {
      const documentIds = e.target.value.map((item) => item.split('-')[0].trim());
      reState = { ...inputState, documentIds: documentIds };
    }
    else if (e.target.name === 'readerTypeId') {
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

  const debounceDocument = async (value) => {
    const [id, name] = value.split('-');
    let data = {};
    if (id && !isNaN(id)) data.id = id.trim();
    if (name) data.name = name.trim();
    if (!name && isNaN(id)) data.name = value.trim();

    internalCall({ key: 'document-search', data });

    window.electron.ipcRenderer.once('ipc-database', (arg) => {
      setDocuments(arg.data.map((item) => ({ id: item.id, value: `${item.id} - ${item.name}` })));
    });
  }

  const documentFc = useCallback(debounce(debounceDocument, 400), []);

  const findDocuments = (value) => {
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

        <Form.Item name="documents" label="Tài Liệu" style={reStyle}>
          <Select
            onSearch={findDocuments}
            mode='multiple'
            options={documents}
            placeholder=""
            className='custom-autocomplete'
            onChange={(value) => onChange({ target: { id: 'documents', value } })}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          />
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
        dataSource={returns}
        bordered={true}
        loading={loading}
        rowKey={'id'}
        tableLayout={'fixed'}
        size='small'
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: returns.length,
          onChange: handlePageChange,
        }}
        scroll={{ x: 1400, y: 450 }}
      />
    </>
  )
};
export default ReturnSearchPage;