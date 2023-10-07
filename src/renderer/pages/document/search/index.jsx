import debounce from 'lodash.debounce';
import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Input, Select, Table, Form, Tag, InputNumber, Radio, Space, Dropdown } from 'antd';
import { Author, Document, DocumentType, Publisher } from '../../../constants';
import { objectToQueryString, queryStringToObject, parseDataSelect } from '../../../utils/helper';

const DocumentSearchPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [inputState, setinputState] = useState({ name: '', id: '', type: '' });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publishers, setPublishers] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [documentTypes, setDocumentTypes] = useState([]);
  const pageSize = 20; // Number of items per page

  const redirectCreate = (record) => () => {
    const data = {
      id: record.id,
      name: record.name,
      documentType: record.documentType.name,
      quantity: record.quantity,
      author: record.author.name,
      publisher: record.publisher.name,
      publishYear: record.publishYear,
      special: record.special,
    };
    const queryString = objectToQueryString(data);
    return navigate(`/document/create?${queryString}`);
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      width: '5%',
      align: 'center',
    },
    {
      title: 'Tên Tài Liệu',
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: 'Thể Loại',
      align: 'center',
      dataIndex: ['documentType', 'name'],
    },
    {
      title: 'Nhà Xuất Bản',
      dataIndex: ['publisher', 'name'],
    },
    {
      title: 'Năm Xuất Bản',
      align: 'center',
      dataIndex: 'publishYear',
    },
    {
      title: 'Tác Giả',
      dataIndex: ['author', 'name'],
    },
    {
      title: 'Tài Liệu Đặc Biệt',
      dataIndex: 'special',
      align: 'center',
      render: (text) => <Tag color={text ? 'green' : 'orange'}>{text ? 'Yes' : 'No'}</Tag>,
    },
    {
      title: 'Số Lượng',
      align: 'center',
      dataIndex: 'quantity',
    },
    {
      title: 'Có Sẵn',
      align: 'center',
      dataIndex: 'availableQuantity',
    },
    {
      title: 'Người Tạo',
      align: 'center',
      dataIndex: ['createdInfo', 'fullName'],
    },
    {
      title: 'Người Cập Nhật',
      align: 'center',
      dataIndex: ['updatedInfo', 'fullName'],
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
                  label: <a onClick={redirectCreate(record)}>Chỉnh sửa</a>,
                  key: '1',
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
    props.callDatabase({ key: Document.search, data: reState });
    props.listenOnce(Document.search, async (arg) => {
      setLoading(false);
      setDocuments(arg.data || []);
    });
  };
  const debounceFc = useCallback(debounce(handleDebounceFn, 200), []);

  useEffect(() => {
    let documentQuery = { ...inputState };
    let documentInfo = queryStringToObject(location.search);

    if (documentInfo && Object.keys(documentInfo).length) {
      documentQuery.id = +documentInfo.id;
      form.setFieldValue('id', documentInfo.id);
    }

    getInitData(), debounceFc(documentQuery);
  }, []);

  const getInitData = async () => {
    const publisher = await props.invoke({ key: Publisher.search });
    const author = await props.invoke({ key: Author.search });
    const documentType = await props.invoke({ key: DocumentType.search });

    setPublishers(parseDataSelect(publisher.data));
    setAuthors(parseDataSelect(author.data));
    setDocumentTypes(parseDataSelect(documentType.data));
  };

  const onChange = (e) => {
    setLoading(true);
    let reState = {};
    setCurrentPage(1);
    if (e.target.id === 'documentTypes') {
      const ids = documentTypes.filter((documentType) => e.target.value.includes(documentType.value)).map((documentType) => documentType.id);
      reState = { ...inputState, [e.target.id]: ids };
    } else if (e.target.id === 'publishers') {
      const ids = publishers.filter((publisher) => e.target.value.includes(publisher.value)).map((publisher) => publisher.id);
      reState = { ...inputState, [e.target.id]: ids };
    } else if (e.target.id === 'authors') {
      const ids = authors.filter((author) => e.target.value.includes(author.value)).map((author) => author.id);
      reState = { ...inputState, [e.target.id]: ids };
    } else if (e.target.name === 'special') {
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

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
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
        initialValues={{ special: undefined }}
      >
        <Form.Item style={props.widthStyle} name="id" label="Mã Tài Liệu">
          <Input type="number" placeholder="" value={inputState.id} id="id" onChange={onChange} maxLength={8} />
        </Form.Item>
        <Form.Item style={props.widthStyle} label="Tên Tài Liệu">
          <Input placeholder="" value={inputState.name} id="name" onChange={onChange} />
        </Form.Item>

        <Form.Item name="special" label={'Tài Liệu Đặc Biệt'} style={{ ...props.widthStyle }}>
          <Radio.Group name="special" onChange={onChange} buttonStyle="solid">
            <Radio.Button value={true}>Yes</Radio.Button>
            <Radio.Button value={false}>No</Radio.Button>
            <Radio.Button value={undefined}>Skip</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="documentTypes" label="Loại Tài Liệu" style={props.widthStyle}>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            onChange={(value) => onChange({ target: { id: 'documentTypes', value } })}
            tokenSeparators={[',']}
            options={documentTypes}
          />
        </Form.Item>

        <Form.Item name="publishers" label="Nhà Xuất Bản" style={props.widthStyle}>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            onChange={(value) => onChange({ target: { id: 'publishers', value } })}
            tokenSeparators={[',']}
            options={publishers}
          />
        </Form.Item>

        <Form.Item name="authors" label="Tên Tác Giả" style={props.widthStyle}>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            onChange={(value) => onChange({ target: { id: 'authors', value } })}
            tokenSeparators={[',']}
            options={authors}
          />
        </Form.Item>

        <Form.Item name="publishYear" label="Năm Xuất Bản" style={props.widthStyle}>
          <InputNumber id={'publishYear'} onChange={(value) => onChange({ target: { id: 'publishYear', value } })} min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item style={props.widthStyle} label=" ">
          <Button onClick={onClick} type="primary" icon={<SearchOutlined />}>
            Search
          </Button>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={documents}
        loading={loading}
        rowKey={'id'}
        tableLayout={'fixed'}
        scroll={{ x: 1400, y: 550 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: documents.length,
          onChange: handlePageChange,
        }}
      />
    </>
  );
};
export default DocumentSearchPage;
