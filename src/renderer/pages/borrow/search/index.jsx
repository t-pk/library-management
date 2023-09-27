import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { Button, Input, Select, Space, Dropdown, Table, Form, Radio } from 'antd';
import { DownOutlined, SearchOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { formatDateTime, formatDateMinutes, objectToQueryString, parseDataSelect } from '../../../utils/helper';

const BorrowSearchPage = (props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [inputState, setinputState] = useState({ fullName: '', id: 0, studentId: '' });
  const [borrows, setBorrows] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const readerTypeId = Form.useWatch('readerTypeId', form);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20; // Number of items per page

  const groupByBorrow = (borrow, index) => {
    const reIndex = currentPage >= 2 ? currentPage * pageSize - pageSize + index : index;
    let boolean = false;
    if (reIndex === 0) {
      boolean = true;
    } else if (borrow.borrowId !== borrows[reIndex - 1].borrowId) {
      boolean = true;
    } else {
      boolean = borrow.countBorrowId - borrow.rest !== borrows[reIndex - 1].countBorrowId - borrows[reIndex - 1].rest;
      let count = 0;
      if (reIndex % 10 === 0) {
        for (let i = 0; i < reIndex; i++) {
          count += borrows[i].countBorrowId;
        }
      }
    }
    return {
      rowSpan: boolean ? borrow.countBorrowId - borrow.rest : 0,
    };
  };

  const columns = [
    {
      title: 'Mã Phiếu Mượn',
      dataIndex: ['borrow', 'id'],
      render: (id) => id,
      align: 'center',
      onCell: groupByBorrow,
    },
    {
      title: 'Mã Độc Giả',
      dataIndex: ['borrow', 'reader', 'id'],
      render: (id) => id,
      align: 'center',
      onCell: groupByBorrow,
    },
    {
      title: 'Tên Độc Giả',
      dataIndex: ['borrow', 'reader', 'fullName'],
      render: (fullName) => fullName,
      align: 'center',
      onCell: groupByBorrow,
    },
    {
      title: 'Tên Tài Liệu',
      align: 'center',
      dataIndex: ['document', 'name'],
    },
    {
      title: 'Đã Trả',
      dataIndex: 'returnDetail',
      align: 'center',
      render: (isReturn) => isReturn && <CheckCircleOutlined style={{ fontSize: 20, color: 'green' }} />,
    },
    {
      title: 'Mã Sinh Viên',
      dataIndex: ['borrow', 'reader', 'studentId'],
      render: (studentId) => studentId,
      align: 'center',
      onCell: groupByBorrow,
    },
    {
      title: 'Mã Nhân Viên - Cán Bộ',
      dataIndex: ['borrow', 'reader', 'civilServantId'],
      render: (civilServantId) => civilServantId,
      align: 'center',
      onCell: groupByBorrow,
    },
    {
      title: 'Ngày Mượn',
      dataIndex: 'createdAt',
      align: 'center',
      render: (dateTime) => {
        return formatDateTime(dateTime);
      },
      onCell: groupByBorrow,
    },
    {
      title: 'Hạn Trả',
      dataIndex: 'createdAt',
      align: 'center',
      render: (dateTime) => {
        return formatDateMinutes(dateTime);
      },
      onCell: groupByBorrow,
    },
    {
      title: 'Ngày Trả',
      dataIndex: ['returnDetail', 'createdAt'],
      align: 'center',
      render: (dateTime) => {
        return dateTime && formatDateTime(dateTime);
      },
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 150,
      onCell: groupByBorrow,
      render: (_, record) => {
        const showCreateReturn = showDropDrown(record);
        let items = [];
        if (showCreateReturn) {
          items.push({
            label: <a onClick={createReturn(1, record)}>Tạo Phiếu Trả</a>,
            key: '1',
          });
        }
        items.push({
          label: <a onClick={createReturn(2, record)}>Tạo Phiếu Nhắc Nhở</a>,
          key: '2',
        });
        items.push({
          label: <a onClick={createReturn(3, record)}>Tạo Phiếu Phạt</a>,
          key: '3',
        });
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

  const handleDebounceFn = (reState) => {
    props.callDatabase({ key: 'borrow-search', data: reState });
    props.listenOnce((arg) => {
      setLoading(false);
      setBorrows(arg.data || []);
    });
  };

  const debounceFc = useCallback(debounce(handleDebounceFn, 200), []);

  const showDropDrown = (record) => {
    return borrows.filter((borrow) => borrow.borrowId === record.borrowId).some((borrow) => !borrow.returnDetail);
  };

  const createReturn = (key, record) => () => {
    const data = {
      borrowId: record.borrowId,
      readerId: record.borrow.reader.id,
      readerName: record.borrow.reader.fullName,
      citizenIdentify: record.borrow.reader.citizenIdentify,
      civilServantId: record.borrow.reader.civilServantId,
      studentId: record.borrow.reader.studentId,
      readerTypeId: record.borrow.reader.readerTypeId,
    };
    const queryString = objectToQueryString(data);
    if (key === 1) {
      return navigate(`/return/create?${queryString}`);
    }
    if (key === 2) {
      return navigate(`/remind/create?${queryString}`);
    }
    if (key === 3) {
      return navigate(`/penalty/create?${queryString}`);
    }
  };

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
    }
  }, [readerTypeId]);

  const getInitData = () => {
    props.callDatabase({ key: 'readerType-search' });
    props.callDatabase({ key: 'borrow-search' });
    props.callDatabase({ key: 'document-search' });

    props.listenOn(async (arg) => {
      if (arg && arg.data) {
        if (arg.key === 'readerType-search') {
          const resReaders = arg.data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          resReaders.push({ id: undefined, label: 'Skip' });
          setReaderTypes(resReaders);
        }
        if (arg.key === 'borrow-search') setBorrows(arg.data);
        if (arg.key === 'document-search') setDocuments(parseDataSelect(arg.data));
      }
    });
  };

  const onChange = (e) => {
    setLoading(true);
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

    props.callDatabase({ key: 'document-search', data });
    props.listenOnce('document-search', (arg) => {
      setDocuments(
        arg.data.map((item) => ({
          id: item.id,
          value: `${item.id} - ${item.name}`,
        }))
      );
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
        dataSource={borrows}
        bordered={true}
        loading={loading}
        rowKey={'id'}
        tableLayout={'fixed'}
        size="small"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: borrows.length,
          onChange: handlePageChange,
        }}
        scroll={{ x: 1400, y: 450 }}
      />
    </>
  );
};
export default BorrowSearchPage;
