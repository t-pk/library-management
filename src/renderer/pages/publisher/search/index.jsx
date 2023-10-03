import { useState, useCallback, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Table, Form, Tag } from 'antd';
import debounce from 'lodash.debounce';
import { Publisher } from '../../../constants';

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
    render: (text) => <Tag color={text ? 'green' : 'red'}>{text ? 'Active' : 'Deactived'}</Tag>,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
];

const style = { minWidth: '28%', marginRight: '10px' };

const PublisherSearchPage = (props) => {
  const [inputState, setinputState] = useState({ name: '', id: '', type: '' });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    debounceFc(inputState);
  }, []);
  const handleDebounceFn = (reState) => {
    props.callDatabase({ key: Publisher.search, data: reState });
    props.listenOnce(Publisher.search, (arg) => {
      setLoading(false);
      if (arg && arg.data) {
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

  return (
    <>
      <Form style={{ display: 'flex' }} layout="vertical">
        <Form.Item style={style} label="Mã Nhà Xuất Bản">
          <Input type="number" placeholder="" value={inputState.id} style={style} id="id" onChange={onChange} maxLength={8} />
        </Form.Item>
        <Form.Item style={style} label="Tên Nhà Xuât Bản">
          <Input placeholder="" value={inputState.name} style={style} id="name" onChange={onChange} />
        </Form.Item>
        <Form.Item style={style} label=" ">
          <Button onClick={onClick} type="primary" icon={<SearchOutlined />}>
            Search
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={documents} loading={loading} rowKey={'id'} tableLayout={'fixed'} />
    </>
  );
};
export default PublisherSearchPage;
