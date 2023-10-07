import { useState, useCallback, useEffect } from 'react';
import { SearchOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Input, Table, Form, Radio } from 'antd';
import debounce from 'lodash.debounce';
import { formatDateTime, queryStringToObject } from '../../../utils/helper';
import { Penalty, ReaderType } from '../../../constants';
import { useLocation } from 'react-router-dom';

const PenaltySearchPage = (props) => {
  const location = useLocation();
  const [form] = Form.useForm();
  const [inputState, setinputState] = useState({ fullName: '', id: 0, studentId: '' });
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const readerTypeId = Form.useWatch('readerTypeId', form);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20; // Number of items per page

  const columns = [
    {
      title: 'Mã Phiếu Phạt',
      dataIndex: 'id',
      render: (id) => id,
      align: 'center',
    },
    {
      title: 'Mã Độc Giả',
      dataIndex: ['return', 'borrow', 'reader', 'id'],
      render: (id) => id,
      align: 'center',
    },
    {
      title: 'Tên Độc Giả',
      dataIndex: ['return', 'borrow', 'reader', 'fullName'],
      render: (fullName) => fullName,
      align: 'center',
    },
    {
      title: 'Số  Tiền Phạt',
      dataIndex: 'totalAmount',
      align: 'center',
      render: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' vnđ',
    },
    {
      title: 'Đã Đóng Phạt',
      dataIndex: 'compensation',
      render: (compensation) => compensation && <CheckCircleOutlined style={{ fontSize: 20, color: 'green' }} />,
      align: 'center',
    },
    {
      title: 'Mô Tả',
      dataIndex: 'description',
      align: 'center',
    },
    {
      title: 'Người Tạo',
      dataIndex: ['createdInfo', 'fullName'],
      align: 'center',
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createdAt',
      align: 'center',
      render: (dateTime) => {
        return formatDateTime(dateTime);
      },
    },
    {
      title: 'Mã Sinh Viên',
      dataIndex: 'studentId',
      dataIndex: ['return', 'borrow', 'reader', 'studentId'],
      align: 'center',
    },
    {
      title: 'Mã N.Viên - C.Bộ',
      dataIndex: 'civilServantId',
      dataIndex: ['return', 'borrow', 'reader', 'civilServantId'],
      align: 'center',
    },
  ];

  useEffect(() => {
    let penaltyQuery = { ...inputState };
    let penaltyInfo = queryStringToObject(location.search);

    if (penaltyInfo && Object.keys(penaltyInfo).length) {
      penaltyQuery.id = +penaltyInfo.id;
      form.setFieldValue('id', penaltyInfo.id);
    }

    debounceFc(penaltyQuery);
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
    props.callDatabase({ key: Penalty.search, data: reState });
    props.listenOnce(Penalty.search, (arg) => {
      setLoading(false);
      setPenalties(arg.data || []);
    });
  };

  const debounceFc = useCallback(debounce(handleDebounceFn, 200), []);

  const getInitData = () => {
    props.callDatabase({ key: ReaderType.search });

    props.listenOnce(ReaderType.search, (arg) => {
      const resReaders = (arg.data || []).map((item) => ({
        value: item.id,
        label: item.name,
      }));
      resReaders.push({ id: undefined, label: 'Skip' });
      setReaderTypes(resReaders);
    });
  };

  const onChange = (e) => {
    setLoading(true);
    setCurrentPage(1);
    let reState = {};
    if (e.target.name === 'readerTypeId') {
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
        initialValues={{ readerTypeId: undefined }}
      >
        <Form.Item name="id" label="Mã Phiếu Phạt" style={props.widthStyle}>
          <Input type="number" id="id" onChange={onChange} />
        </Form.Item>

        <Form.Item label="Mã Độc Giả" style={props.widthStyle}>
          <Input type="number" id="readerId" onChange={onChange} />
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
        dataSource={penalties}
        bordered={true}
        loading={loading}
        rowKey={'id'}
        tableLayout={'fixed'}
        size="small"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: penalties.length,
          onChange: handlePageChange,
        }}
        scroll={{ x: 1400, y: 550 }}
      />
    </>
  );
};
export default PenaltySearchPage;
