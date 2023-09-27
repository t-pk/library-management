import React, { useState, useCallback, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select, Table, Form, Tag, InputNumber, Radio } from 'antd';
import debounce from 'lodash.debounce';

import './ui.scss';

// const tailFormItemLayout = { wrapperCol: { xs: { span: 40, offset: 0 }, sm: { span: 30, offset: 0 } }, };

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
    dataIndex: 'document-type.name',
  },
  {
    title: 'Nhà Xuất Bản',
    dataIndex: 'publisher.name',
  },
  {
    title: 'Năm Xuất Bản',
    align: 'center',
    dataIndex: 'publishYear',
  },
  {
    title: 'Tác Giả',
    dataIndex: 'author.name',
  },
  {
    title: 'Tài Liệu Đặc Biệt',
    dataIndex: 'special',
    align: 'center',
    render: (text, record) => <Tag color={text ? 'green' : 'orange'}>{text ? 'Yes' : 'No'}</Tag>,
  },
];

const DocumentSearchPage = (props) => {
  const [form] = Form.useForm();
  const [inputState, setinputState] = useState({
    name: '',
    id: '',
    type: '',
  });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publishers, setPublishers] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);

  const handleDebounceFn = (reState) => {
    props.callDatabase({ key: 'document-search', data: reState });
    props.listenOnce('document-search', async (arg) => {
      setLoading(false);
      setDocuments(arg.data || []);
    });
  };
  const debounceFc = useCallback(debounce(handleDebounceFn, 200), []);

  useEffect(() => {
    getInitData(), debounceFc(inputState);
  }, []);

  const getInitData = () => {
    props.callDatabase({ key: 'publisher-search' });
    props.callDatabase({ key: 'author-search' });
    props.callDatabase({ key: 'documentType-search' });

    props.listenOn(async (arg) => {
      if (arg && arg.data) {
        if (arg.key === 'publisher-search')
          setPublishers(
            arg.data.map((item) => ({
              id: item.id,
              value: `${item.id} - ${item.name}`,
            }))
          );
        if (arg.key === 'author-search')
          setAuthors(
            arg.data.map((item) => ({
              id: item.id,
              value: `${item.id} - ${item.name}`,
            }))
          );
        if (arg.key === 'documentType-search')
          setDocumentTypes(
            arg.data.map((item) => ({
              id: item.id,
              value: `${item.id} - ${item.name}`,
            }))
          );
      }
    });
  };

  const onChange = (e) => {
    setLoading(true);
    let reState = {};
    if (e.target.id === 'documentTypes') {
      const ids = documentTypes
        .filter((documentType) => e.target.value.includes(documentType.value))
        .map((documentType) => documentType.id);
      reState = { ...inputState, [e.target.id]: ids };
    } else if (e.target.id === 'publishers') {
      const ids = publishers
        .filter((publisher) => e.target.value.includes(publisher.value))
        .map((publisher) => publisher.id);
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
        <Form.Item style={props.widthStyle} label="Mã Tài Liệu">
          <Input placeholder="" value={inputState.id} id="id" onChange={onChange} maxLength={8} />
        </Form.Item>
        <Form.Item style={props.widthStyle} label="Tên Tài Liệu">
          <Input placeholder="" value={inputState.name} id="name" onChange={onChange} />
        </Form.Item>

        <Form.Item name="special" label={'Tài Liệu Đặc Biệt'} style={{ ...reStyle }}>
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
          <InputNumber
            id={'publishYear'}
            onChange={(value) => onChange({ target: { id: 'publishYear', value } })}
            min={1}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item style={props.widthStyle} label=" ">
          <Button onClick={onClick} type="primary" icon={<SearchOutlined />}>
            Search
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={documents} loading={loading} rowKey={'id'} tableLayout={'fixed'} />
    </>
  );
};
export default DocumentSearchPage;
