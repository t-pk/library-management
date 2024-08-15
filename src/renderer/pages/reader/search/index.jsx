import { useState, useCallback, useEffect } from 'react';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Dropdown, Table, Form, Tag, Radio } from 'antd';
import debounce from 'lodash.debounce';
import { useLocation, useNavigate } from 'react-router-dom';
import { objectToQueryString, queryStringToObject, formatDateTime } from '../../../utils/helper';
import { Borrow, Reader, ReaderType } from '../../../constants';

const ReaderSearchPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [inputState, setinputState] = useState({ name: '', id: '', type: '' });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const redirectCreateBorrow = (record) => () => {
    const data = {
      readerId: record.id,
      fullName: record.fullName,
    };
    const queryString = objectToQueryString(data);
    return navigate(`/borrow/create?${queryString}`);
  };

  const editReader = (record) => () => {
    const data = {
      id: record.id,
      fullName: record.fullName,
      phoneNumber: record.phoneNumber || '',
      email: record.email || '',
      directFrom: Borrow.search,
    };
    const queryString = objectToQueryString(data);
    return navigate(`/reader/create?${queryString}`);
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
      title: 'Số Điện Thoại',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Người Tạo',
      dataIndex: ['createdInfo', 'fullName'],
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createdAt',
      render: (dateTime) => {
        return formatDateTime(dateTime);
      },
    },
    {
      title: 'Người Cập Nhật',
      dataIndex: ['updatedInfo', 'fullName'],
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'updatedAt',
      render: (dateTime) => {
        return formatDateTime(dateTime);
      },
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
                  label: <a onClick={editReader(record)}>Chỉnh sửa</a>,
                  key: '1',
                },
                {
                  label: <a onClick={redirectCreateBorrow(record)}>Tạo Phiếu Mượn</a>,
                  key: '2',
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
    props.callDatabase({ key: Reader.search, data: reState });
    props.listenOnce(Reader.search, (arg) => {
      setLoading(false);
      setDocuments(arg.data || []);
    });
  };

  const debounceFc = useCallback(debounce(handleDebounceFn, 200), []);

  useEffect(() => {
    let query = inputState;
    let readerInfo = queryStringToObject(location.search);
    if (readerInfo && Object.keys(readerInfo).length) {
      query.id = +readerInfo.readerId;
      form.setFieldValue('id', readerInfo.readerId);
    }
    debounceFc(query);

    getInitData();
  }, []);

  const getInitData = () => {
    props.callDatabase({ key: ReaderType.search });

    props.listenOnce(ReaderType.search, (arg) => {
      const resReaders = (arg.data || []).map((item) => ({
        value: item.id,
        label: item.name,
      }));
      resReaders.push({ id: undefined, label: 'Skip' });
    });
  };

  const onChange = (e) => {
    setLoading(true);
    let reState = {};
    reState = { ...inputState, [e.target.id]: e.target.value };

    setinputState(reState);
    debounceFc(reState);
  };

  const onClick = () => {
    setLoading(true);
    debounceFc(inputState);
  };

  return (
    <>
      <Form
        {...props.formItemLayout}
        form={form}
        layout="vertical"
        name="dynamic_rule"
        style={{ display: 'flex', flexWrap: 'wrap' }}
        scrollToFirstError
      >
        <Form.Item name="id" label="Mã Độc Giả" style={props.widthStyle}>
          <Input type="number" id="id" onChange={onChange} />
        </Form.Item>

        <Form.Item label="Tên Độc Giả" style={props.widthStyle}>
          <Input id="fullName" onChange={onChange} />
        </Form.Item>

        <Form.Item label="Số Điện Thoại" style={props.widthStyle}>
          <Input id="phoneNumber" onChange={onChange} />
        </Form.Item>

        <Form.Item label="Email" style={props.widthStyle}>
          <Input id="email" onChange={onChange} />
        </Form.Item>

        <Form.Item style={props.widthStyle} label=" ">
          <Button onClick={onClick} type="primary" icon={<SearchOutlined />}>
            Search
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={documents} loading={loading} rowKey={'id'} tableLayout={'fixed'} scroll={{ x: 1400, y: 550 }} />
    </>
  );
};

export default ReaderSearchPage;
