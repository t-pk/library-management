import { useState, useCallback, useEffect } from 'react';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select, Space, Dropdown, Table, Form, Radio } from 'antd';
import debounce from 'lodash.debounce';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDateTime, objectToQueryString, parseDataSelect, queryStringToObject } from '../../../utils/helper';
import { Return, ReaderType, Document } from 'renderer/constants';

const ReturnSearchPage = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [inputState, setinputState] = useState({ fullName: '', id: 0, studentId: '' });
  const [returns, setReturns] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const readerTypeId = Form.useWatch('readerTypeId', form);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20; // Number of items per page

  const groupByReturns = (iReturn, index) => {
    const reIndex = currentPage >= 2 ? currentPage * pageSize - pageSize + index : index;
    let boolean = false;
    if (reIndex === 0) {
      boolean = true;
    } else if (iReturn.returnId !== returns[reIndex - 1].returnId) {
      boolean = true;
    } else {
      boolean = iReturn.countReturnId - iReturn.rest !== returns[reIndex - 1].countReturnId - returns[reIndex - 1].rest;
      let count = 0;
      if (reIndex % 10 === 0) {
        for (let i = 0; i < reIndex; i++) {
          count += returns[i].countReturnId;
        }
      }
    }
    return {
      rowSpan: boolean ? iReturn.countReturnId - iReturn.rest : 0,
    };
  };

  const columns = [
    {
      title: 'Mã Phieu Tra',
      dataIndex: ['return', 'id'],
      render: (id) => id,
      align: 'center',
      onCell: groupByReturns,
    },
    {
      title: 'Mã Độc Giả',
      dataIndex: ['return', 'reader', 'id'],
      render: (id) => id,
      align: 'center',
      onCell: groupByReturns,
    },
    {
      title: 'Tên Độc Giả',
      dataIndex: ['return', 'reader', 'fullName'],
      render: (fullName) => fullName,
      align: 'center',
      onCell: groupByReturns,
    },
    {
      title: 'Tên Tài Liệu',
      align: 'center',
      dataIndex: ['borrowDetail', 'document', 'name'],
    },
    {
      title: 'Ngày Trả',
      dataIndex: 'createdAt',
      align: 'center',
      render: (dateTime) => {
        return dateTime && formatDateTime(dateTime);
      },
    },
    {
      title: 'Mã Sinh Viên',
      dataIndex: ['return', 'reader', 'studentId'],
      render: (studentId) => studentId,
      align: 'center',
      onCell: groupByReturns,
    },
    {
      title: 'Mã N.Viên - C.Bộ',
      dataIndex: ['return', 'reader', 'civilServantId'],
      render: (civilServantId) => civilServantId,
      align: 'center',
      onCell: groupByReturns,
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 150,
      onCell: groupByReturns,
      render: (_, record) => {
        let items = [
          {
            label: <a onClick={createReturns(1, record)}>Tạo Phiếu Nhắc Nhở</a>,
            key: '1',
          },
          {
            label: <a onClick={createReturns(2, record)}>Tạo Phiếu Phạt</a>,
            key: '2',
          },
        ];
        return (
          <Space size="middle">
            <Dropdown
              menu={{
                items,
              }}
            >
              <a>
                More Action <DownOutlined />
              </a>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    let returnQuery = { ...inputState };
    let returnInfo = queryStringToObject(location.search);
    if (returnInfo && Object.keys(returnInfo).length) {
      returnQuery.id = +returnInfo.id;
      form.setFieldValue('id', returnInfo.id);
    }
    debounceFc(returnQuery);
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
    }
  }, [readerTypeId]);

  const handleDebounceFn = (reState) => {
    props.callDatabase({ key: Return.search, data: reState });
    props.listenOnce(Return.search, (arg) => {
      setLoading(false);
      setReturns(arg.data);
    });
  };
  const createReturns = (key, record) => () => {
    console.log(record);
    const data = {
      returnId: record.returnId,
      readerId: record.return.reader.id,
      readerName: record.return.reader.fullName,
      citizenIdentify: record.return.reader.citizenIdentify,
      civilServantId: record.return.reader.civilServantId,
      studentId: record.return.reader.studentId,
      readerTypeId: record.return.reader.readerTypeId,
    };
    const queryString = objectToQueryString(data);
    if (key === 1) return navigate(`/remind/create?${queryString}`);

    if (key === 2) return navigate(`/penalty/create?${queryString}`);
  };

  const debounceFc = useCallback(debounce(handleDebounceFn, 200), []);

  const getInitData = () => {
    props.callDatabase({ key: ReaderType.search });
    props.callDatabase({ key: Document.search });

    props.listenOn(async (arg) => {
      if (arg && arg.data) {
        if (arg.key === ReaderType.search) {
          const resReaders = arg.data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          resReaders.push({ id: undefined, label: 'Skip' });
          setReaderTypes(resReaders);
        }
        if (arg.key === Document.search) {
          setDocuments(parseDataSelect(arg.data));
        }
      }
    });
  };

  const onChange = (e) => {
    setLoading(true);
    setCurrentPage(1);
    let reState = {};
    if (e.target.id === 'documents') {
      const documentIds = e.target.value.map((item) => item.split('-')[0].trim());
      reState = { ...inputState, documentIds: documentIds };
    } else if (e.target.name === 'readerTypeId') {
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

  const debounceDocument = async (value) => {
    const [id, name] = value.split('-');
    let data = {};
    if (id && !isNaN(id)) data.id = id.trim();
    if (name) data.name = name.trim();
    if (!name && isNaN(id)) data.name = value.trim();

    props.callDatabase({ key: Document.search, data });

    props.listenOnce(Document.search, (arg) => {
      setDocuments(parseDataSelect(arg.data));
    });
  };

  const documentFc = useCallback(debounce(debounceDocument, 400), []);

  const findDocuments = (value) => {
    documentFc(value);
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
        initialValues={{ readerTypeId: undefined }}
      >
        <Form.Item name="id" label="Mã Phiếu Trả" style={props.widthStyle}>
          <Input id="id" onChange={onChange} />
        </Form.Item>
        <Form.Item label="Mã Độc Giả" style={props.widthStyle}>
          <Input id="readerId" onChange={onChange} />
        </Form.Item>

        <Form.Item name="documents" label="Tài Liệu" style={props.widthStyle}>
          <Select
            onSearch={findDocuments}
            mode="multiple"
            options={documents}
            placeholder=""
            className="custom-autocomplete"
            onChange={(value) => onChange({ target: { id: 'documents', value } })}
            filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          />
        </Form.Item>

        <Form.Item label="Tên Độc Giả" style={props.widthStyle}>
          <Input id="fullName" onChange={onChange} />
        </Form.Item>

        <Form.Item name="studentId" label="Mã Sinh Viên" style={props.widthStyle}>
          <Input disabled={readerTypeId && readerTypeId !== 1} id="studentId" onChange={onChange} />
        </Form.Item>

        <Form.Item name="civilServantId" label="Mã Cán Bộ - Nhân Viên" style={props.widthStyle}>
          <Input disabled={readerTypeId && readerTypeId !== 2} id="civilServantId" onChange={onChange} />
        </Form.Item>

        <Form.Item name="readerTypeId" label="Loại Độc Giả" style={props.widthStyle}>
          <Radio.Group name="readerTypeId" onChange={onChange} options={readerTypes} optionType="button" buttonStyle="solid" />
        </Form.Item>

        <Form.Item style={props.widthStyle} label=" ">
          <Button onClick={onClick} type="primary" icon={<SearchOutlined />}>
            Search
          </Button>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={returns}
        bordered={true}
        loading={loading}
        rowKey={'id'}
        tableLayout={'fixed'}
        size="small"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: returns.length,
          onChange: handlePageChange,
        }}
        scroll={{ x: 1400, y: 450 }}
      />
    </>
  );
};

export default ReturnSearchPage;
