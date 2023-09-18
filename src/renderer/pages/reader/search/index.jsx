import React, { useState, useCallback } from 'react';
import { SettingOutlined, DownOutlined, CaretDownOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Cascader, Input, Select, Space, Row, Dropdown, Checkbox, Table, Form } from 'antd';
import debounce from 'lodash.debounce';
import { internalCall } from '../../../../renderer/actions';
const { Option } = Select;
import './ui.scss';

const columns = [
  {
    title: 'Code',
    dataIndex: 'code',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Type',
    dataIndex: 'type',
  },
];

const style = { minWidth: '28%', marginRight: '10px' };

const ReaderSearchPage = () => {
  const [inputState, setinputState] = useState({
    name: '',
    id: '',
    type: ''
  });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDebounceFn = reState => {
    internalCall({ key: 'document-search', data: reState });
    window.electron.ipcRenderer.once('ipc-database', async (arg) => {
      setLoading(false);
      if (arg && arg.data) {
        console.log(arg.data);
        setDocuments(arg.data);
      }
    });
  }
  const debounceFc = useCallback(debounce(handleDebounceFn, 300), []);

  const onChange = (e) => {
    setLoading(true);
    const reState = { ...inputState, [e.target.id]: e.target.value };
    setinputState(reState);
    debounceFc(reState);
  };

  const onClick = () => {
    setLoading(true);
    debounceFc(inputState);
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };

  return (
    <>
      <Form style={{ display: 'flex' }} layout='vertical'>
        <Form.Item style={style} label="Mã Tài Liệu" >
          <Input
            placeholder=""
            value={inputState.id}
            style={style}
            id="id"
            onChange={onChange}
            maxLength={8}
          />
        </Form.Item>
        <Form.Item style={style} label="Tên Tài Liệu">
          <Input
            placeholder=""
            value={inputState.name}
            style={style}
            id="name"
            onChange={onChange}
          />
        </Form.Item>
        <Form.Item style={style} label="Loại Tài Liệu">
          <Input
            placeholder=""
            value={inputState.type}
            style={style}
            id="type"
            onChange={onChange}
          />
        </Form.Item>
        <Form.Item style={style} label=" ">
          <Button onClick={onClick} type='primary' icon={<SearchOutlined />}>Search</Button>
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
      />
    </>
  )
};
export default ReaderSearchPage;