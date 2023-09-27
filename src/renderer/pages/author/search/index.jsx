import React, { useState, useCallback, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Table, Form, Tag } from 'antd';
import debounce from 'lodash.debounce';
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
    render: (status) => <Tag color={status ? 'green' : 'red'}>{status ? 'Active' : 'Deactived'}</Tag>,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
];

const style = { minWidth: '28%', marginRight: '10px' };

const AuthorSearchPage = (props) => {
  const [inputState, setinputState] = useState({ name: '', id: '', type: '' });
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    debounceFc(inputState);
  }, []);

  const handleDebounceFn = (reState) => {
    props.callDatabase({ key: 'author-search', data: reState });
    props.listenOnce('author-search', async (arg) => {
      setLoading(false);
      if (arg && arg.data) {
        setAuthors(arg.data);
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

  return (
    <>
      <Form style={{ display: 'flex' }} layout="vertical">
        <Form.Item style={style} label="Mã Tác Giả">
          <Input placeholder="" value={inputState.id} style={style} id="id" onChange={onChange} maxLength={8} />
        </Form.Item>
        <Form.Item style={style} label="Tên Tác Giả">
          <Input placeholder="" value={inputState.name} style={style} id="name" onChange={onChange} />
        </Form.Item>
        <Form.Item style={style} label=" ">
          <Button onClick={onClick} type="primary" icon={<SearchOutlined />}>
            Search
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={authors} loading={loading} rowKey={'id'} tableLayout={'fixed'} />
    </>
  );
};
export default AuthorSearchPage;
