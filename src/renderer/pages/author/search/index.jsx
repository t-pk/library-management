import React, { useState, useCallback, useEffect } from 'react';
import {
  SettingOutlined,
  DownOutlined,
  CaretDownOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
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
} from 'antd';
import debounce from 'lodash.debounce';
import { internalCall } from '../../../../renderer/actions';
const { Option } = Select;
import './ui.scss';

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => (
      <Tag color={text ? 'green' : 'red'}>{text ? 'Active' : 'Deactived'}</Tag>
    ),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
];

const style = { minWidth: '28%', marginRight: '10px' };

const AuthorSearchPage = () => {
  const [inputState, setinputState] = useState({
    name: '',
    id: '',
    type: '',
  });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    debounceFc(inputState);
  }, []);
  const handleDebounceFn = (reState) => {
    internalCall({ key: 'author-search', data: reState });
    window.electron.ipcRenderer.once('ipc-database', async (arg) => {
      setLoading(false);
      if (arg && arg.data) {
        console.log(arg.data);
        setDocuments(arg.data);
      }
    });
  };
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
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };

  return (
    <>
      <Form style={{ display: 'flex' }} layout="vertical">
        <Form.Item style={style} label="Mã Tác Giả">
          <Input
            placeholder=""
            value={inputState.id}
            style={style}
            id="id"
            onChange={onChange}
            maxLength={8}
          />
        </Form.Item>
        <Form.Item style={style} label="Tên Tác Giả">
          <Input
            placeholder=""
            value={inputState.name}
            style={style}
            id="name"
            onChange={onChange}
          />
        </Form.Item>
        <Form.Item style={style} label=" ">
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
      />
    </>
  );
};
export default AuthorSearchPage;
