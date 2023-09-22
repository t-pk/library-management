import React, { useState, useCallback, useEffect } from 'react';
import { SettingOutlined, DownOutlined, CaretDownOutlined, SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Cascader, Input, Select, Space, Row, Dropdown, Checkbox, Table, Form, Tag, InputNumber, Radio } from 'antd';
import debounce from 'lodash.debounce';
import { internalCall } from '../../../../renderer/actions';
const { Option } = Select;
import './ui.scss';

const formItemLayout = { labelCol: { xs: { span: 30 }, sm: { span: 30 } }, wrapperCol: { xs: { span: 40 }, sm: { span: 23 } } };
const reStyle = { minWidth: "32%" };

const columns = [
  {
    title: 'Id',
    dataIndex: 'borrowerId',
    width: '5%',
    align: 'center',
    render: (_, record) =>  _,
    onCell: (borrower) => ({
      rowSpan: borrower.id
    }),
  },
  // {
  //   title: 'Tên Độc Giả',
  //   dataIndex: ['borrower','reader', 'fullName'],
  //  // render: (text, record) => <Tag color={text === 'Sinh Viên' ? 'green' : 'orange'}>{text}</Tag>,
  // },
  // {
  //   title: 'Mã Phiếu Mượn',
  //   dataIndex: ['document', 'name'],
  // },
  // {
  //   title: 'Mã Sinh Viên',
  //   dataIndex: 'borrowerDetails',
  //   render: (scores) => (
  //     <ul>
  //       {scores.map((score, index) => (
  //         <li key={score.borrowerId}>
  //           {score.borrowerId}: {score.document.name}
  //         </li>
  //       ))}
  //     </ul>
  //   ),
  // },
  // {
  //   title: 'Mã Cán Bộ - Nhân Viên',
  //   dataIndex: 'civilServantId',
  // },
  // {
  //   title: 'Ngày Mượn',
  //   dataIndex: 'createdAt',
  // },
];

const BorrowerSearchPage1 = () => {
  const [form] = Form.useForm();
  const [inputState, setinputState] = useState({ name: '', id: '', type: '' });
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const readerTypeId = Form.useWatch('readerTypeId', form);

  const handleDebounceFn = reState => {}
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

        if (arg.key === 'borrower-search'){
          console.log(arg);
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

    console.log(reState);
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
      console.log(borrowers);
    });
  }

  const documentFc = useCallback(debounce(debounceDocument, 400), []);

  const findborrowers = (value) => {
    documentFc(value);
  }

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
        loading={loading}
        rowKey={'id'}
        tableLayout={'fixed'}
      />
    </>
  )
};
export default BorrowerSearchPage1;