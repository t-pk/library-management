import React, { useState, useCallback, useEffect } from 'react';
import { SettingOutlined, DownOutlined, CaretDownOutlined, SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Cascader, Input, Select, Space, Row, Dropdown, Checkbox, Table, Form, Tag, InputNumber, Radio } from 'antd';
import debounce from 'lodash.debounce';
import { internalCall } from '../../../../renderer/actions';
import { formatDMY_HMS } from '../../../utils/index';
const { Option } = Select;

import './ui.scss';

const formItemLayout = { labelCol: { xs: { span: 30 }, sm: { span: 30 } }, wrapperCol: { xs: { span: 40 }, sm: { span: 23 } } };
const reStyle = { minWidth: "32%" };


const BorrowerSearchPage = () => {
  const [form] = Form.useForm();
  const [inputState, setinputState] = useState({ name: '', id: '', type: '' });
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const readerTypeId = Form.useWatch('readerTypeId', form);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 20; // Number of items per page

  const handleDebounceFn = reState => { }
  const debounceFc = useCallback(debounce(handleDebounceFn, 200), []);
  const groupByBorrower = (borrower, index) => {
    const reIndex = currentPage >= 2 ? (currentPage * pageSize - pageSize) + index : index;
    let boolean = false;
    if (reIndex === 0) {
      boolean = true;
    }
    else {
      boolean = (borrower.countBorrowerId - borrower.rest) !== (borrowers[reIndex - 1].countBorrowerId - borrowers[reIndex - 1].rest);
      let count = 0;
      if (reIndex % 10 === 0) {
        for (let i = 0; i < reIndex; i++) {
          count += borrowers[i].countBorrowerId;
        }
      }
    };
    return {
      rowSpan: boolean ? (borrower.countBorrowerId - borrower.rest) : 0
    }
  }
  const columns = [
    {
      title: 'Mã Phiếu Mượn',
      dataIndex: 'borrowerId',
      align: 'center',
      render: (_, record) => { return record.borrowerId },
      onCell: groupByBorrower
    },
    {
      title: 'Tên Độc Giả',
      dataIndex: ['borrower', 'reader', 'fullName'],
      render: (fullName) => fullName,
      onCell: groupByBorrower
    },
    {
      title: 'Tên Tai Lieu',
      dataIndex: ['document', 'name'],
    },
    {
      title: 'Ngày Mượn',
      dataIndex: 'createdAt',
      render: (dateTime) => {
        return formatDMY_HMS(dateTime)
      },
      onCell: groupByBorrower
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

    internalCall({ key: 'readerType-search', data: {} });
    internalCall({ key: 'borrower-search', data: {} });

    const getData = async (arg) => {
      if (arg && arg.data) {
        if (arg.key === 'readerType-search') {
          const resReaders = arg.data.map((item) => ({ value: item.id, label: item.name }));
          resReaders.push({ id: undefined, label: 'Skip' });
          setReaderTypes(resReaders);
        }

        if (arg.key === 'borrower-search') {
          setBorrowers(arg.data);
        }
      }
    };
    window.electron.ipcRenderer.on('ipc-database', getData);
  }


  const onChange = (e) => {
    setLoading(true);
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

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
    },
  };

  const debounceDocument = async (value) => {
    const [id, name] = value.split('-');
    let data = {};
    if (id && !isNaN(id)) data.id = id.trim();
    if (name) data.name = name.trim();

    internalCall({ key: 'document-search', data });

    window.electron.ipcRenderer.once('ipc-database', (arg) => {
      setBorrowers(arg.data.map((item) => ({ id: item.id, value: `${item.id} - ${item.name}` })));
    });
  }

  const documentFc = useCallback(debounce(debounceDocument, 400), []);

  const findborrowers = (value) => {
    documentFc(value);
  }

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Form  {...formItemLayout} form={form} layout="vertical" name="dynamic_rule" style={{ display: 'flex', flexWrap: 'wrap' }} scrollToFirstError initialValues={{ readerTypeId: undefined }}>
        <Form.Item label="Mã Phiếu Mượn" style={reStyle}>
          <Input id="id" onChange={onChange} />
        </Form.Item>

        <Form.Item label="Mã Độc Giả" style={reStyle}>
          <Input id="readerId" onChange={onChange} />
        </Form.Item>

        <Form.Item name="documentIds" label="Tài Liệu" style={reStyle}>
          <Select
            mode='multiple'
            options={borrowers}
            onSearch={findborrowers}
            placeholder=""
            className='custom-autocomplete'
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
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={borrowers}
        bordered={true}
        loading={loading}
        rowKey={'id'}
        tableLayout={'fixed'}
        size='small'
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: borrowers.length,
          onChange: handlePageChange,
        }}
        scroll={{y:450}}
      />
    </>
  )
};
export default BorrowerSearchPage;