import React, { useState, useCallback, useEffect } from 'react';
import { SettingOutlined, DownOutlined, CaretDownOutlined, SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Cascader, Input, Select, Space, Row, Dropdown, Checkbox, Table, Form, Tag, InputNumber, Radio } from 'antd';
import debounce from 'lodash.debounce';
import { internalCall } from '../../../../renderer/actions';
const { Option } = Select;
import './ui.scss';

const formItemLayout = { labelCol: { xs: { span: 30 }, sm: { span: 30 } }, wrapperCol: { xs: { span: 40 }, sm: { span: 23 } } };
// const tailFormItemLayout = { wrapperCol: { xs: { span: 40, offset: 0 }, sm: { span: 30, offset: 0 } }, };
const reStyle = { minWidth: "32%" };


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
    width: '25%'
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

const DocumentSearchPage = () => {
  const [form] = Form.useForm();
  const [inputState, setinputState] = useState({
    name: '',
    id: '',
    type: ''
  });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publishers, setPublishers] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);

  const handleDebounceFn = reState => {
    internalCall({ key: 'document-search', data: reState });
    window.electron.ipcRenderer.once('ipc-database', async (arg) => {
      setLoading(false);
      if (arg && arg.data) {
        setDocuments(arg.data);
      }
    });
  }
  const debounceFc = useCallback(debounce(handleDebounceFn, 200), []);

  useEffect(() => { getInitData(), debounceFc(inputState) }, []);

  const getInitData = () => {

    internalCall({ key: 'publisher-search', data: {} });
    internalCall({ key: 'author-search', data: {} });
    internalCall({ key: 'documentType-search', data: {} });

    const getData = async (arg) => {
      if (arg && arg.data) {
        if (arg.key === 'publisher-search')
          setPublishers(arg.data.map((item) => ({ id: item.id, value: `${item.id} - ${item.name}`  })));
        if (arg.key === 'author-search')
          setAuthors(arg.data.map((item) => ({ id: item.id, value: `${item.id} - ${item.name}` })));
        if (arg.key === 'documentType-search')
          setDocumentTypes(arg.data.map((item) => ({ id: item.id, value: `${item.id} - ${item.name}`  })));
      }
    };
    window.electron.ipcRenderer.on('ipc-database', getData);
  }


  const onChange = (e) => {
    setLoading(true);
    let reState = {};
    if (e.target.id === 'documentTypes') {
      const ids = documentTypes.filter((documentType) => e.target.value.includes(documentType.value)).map((documentType) => documentType.id);
      reState = { ...inputState, [e.target.id]: ids };
    }
    else if (e.target.id === 'publishers') {
      const ids = publishers.filter((publisher) => e.target.value.includes(publisher.value)).map((publisher) => publisher.id);
      reState = { ...inputState, [e.target.id]: ids };
    }
    else if (e.target.id === 'authors') {
      const ids = authors.filter((author) => e.target.value.includes(author.value)).map((author) => author.id);
      reState = { ...inputState, [e.target.id]: ids };
    }
    else if (e.target.name === 'special') {
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

  return (
    <>
      <Form  {...formItemLayout} form={form} layout="vertical" name="dynamic_rule" style={{ display: 'flex', flexWrap: 'wrap' }} scrollToFirstError initialValues={{ special: undefined }}>
        <Form.Item style={reStyle} label="Mã Tài Liệu" >
          <Input
            placeholder=""
            value={inputState.id}
            id="id"
            onChange={onChange}
            maxLength={8}
          />
        </Form.Item>
        <Form.Item style={reStyle} label="Tên Tài Liệu">
          <Input
            placeholder=""
            value={inputState.name}
            id="name"
            onChange={onChange}
          />
        </Form.Item>

        <Form.Item name="documentTypes" label="Loại Tài Liệu" style={reStyle} >
          <Select
            mode="tags"
            style={{ width: '100%' }}
            onChange={(value) => onChange({ target: { id: 'documentTypes', value } })}
            tokenSeparators={[',']}
            options={documentTypes}
          />
        </Form.Item>

        <Form.Item name="publishers" label="Nhà Xuất Bản" style={reStyle} >
          <Select
            mode="tags"
            style={{ width: '100%' }}
            onChange={(value) => onChange({ target: { id: 'publishers', value } })}
            tokenSeparators={[',']}
            options={publishers}
          />
        </Form.Item>

        <Form.Item name="authors" label="Tên Tác Giả" style={reStyle} >
          <Select
            mode="tags"
            style={{ width: '100%' }}
            onChange={(value) => onChange({ target: { id: 'authors', value } })}
            tokenSeparators={[',']}
            options={authors}
          />
        </Form.Item>

        <Form.Item name="special" label={"Tài Liệu Đặc Biệt"} style={{ ...reStyle }} >
          <Radio.Group name='special' onChange={onChange} buttonStyle="solid">
            <Radio.Button value={true}>Yes</Radio.Button>
            <Radio.Button value={false}>No</Radio.Button>
            <Radio.Button value={undefined}>Skip</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="publishYear" label="Năm Xuất Bản" style={reStyle}>
          <InputNumber id={"publishYear"} onChange={(value) => onChange({ target: { id: 'publishYear', value } })} min={1} style={{ width: '100%' }} />
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
        dataSource={documents}
        loading={loading}
        rowKey={'id'}
        tableLayout={'fixed'}
      />
    </>
  )
};
export default DocumentSearchPage;