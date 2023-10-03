import { useState, useEffect } from 'react';
import { Button, Input, Table, Form, Tag, InputNumber } from 'antd';
import { CloseOutlined, SaveOutlined, CheckOutlined } from '@ant-design/icons';
import { DocumentRequest, TOKEN_KEY } from '../../../constants';
import { delay, formatDateTime } from '../../../utils/helper';

const DocumentRequestPage = (props) => {
  const [inputState, setinputState] = useState({ name: '', id: '' });
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [documentRequests, setDocumentRequests] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const mappingStatus = {
    awaitingReview: 'Đang Xem Xét',
    approved: 'Đã Phê Duyệt',
    rejected: 'Đã Từ Chối',
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
    },
    {
      title: 'Trạng Thái',
      align: 'center',
      dataIndex: 'status',
      render: (status) => <Tag color={status === 'awaitingReview' ? 'orange' : status === 'approved' ? 'green' : 'red'}>{mappingStatus[status]}</Tag>,
    },
    {
      title: 'Nhà Xuất Bản',
      dataIndex: 'publisher',
    },
    {
      title: 'Tác Giả',
      align: 'center',
      dataIndex: 'author',
    },
    {
      title: 'Người Tạo',
      align: 'center',
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
      title: 'Phê Duyệt Bởi',
      align: 'center',
      dataIndex: ['approvedInfo', 'fullName'],
    },
    {
      title: 'Ngày Phê Duyệt',
      dataIndex: 'approvedAt',
      align: 'center',
      render: (dateTime) => {
        return formatDateTime(dateTime);
      },
    },
    {
      title: 'Từ Chối Bởi',
      align: 'center',
      dataIndex: ['rejectedInfo', 'fullName'],
    },
    {
      title: 'Ngày Từ Chối',
      dataIndex: 'rejectedAt',
      align: 'center',
      render: (dateTime) => {
        return formatDateTime(dateTime);
      },
    },
  ];
  useEffect(() => {
    getDocumentRequest();
  }, []);

  const onFinish = (values) => {
    setLoading(true);
    props.callDatabase({ key: DocumentRequest.create, data: { ...values, status: 'awaitingReview' } });

    props.listenOnce(DocumentRequest.create, async (arg) => {
      await delay(300);
      if (arg.data) {
        props.openNotification('success', 'Đã Thêm Yêu Cầu Tài Liệu');
        form.resetFields();
        getDocumentRequest();
      }
      setLoading(false);
    });
  };

  const getDocumentRequest = () => {
    setLoading(true);
    props.callDatabase({ key: DocumentRequest.search });

    props.listenOnce(DocumentRequest.search, async (arg) => {
      await delay(300);
      if (arg.data) {
        console.log(arg);
        setDocumentRequests(arg.data);
      }
      setLoading(false);
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.status !== 'awaitingReview',
      name: record.name,
    }),
  };

  const updateDocumentStatus = (key) => () => {
    props.callDatabase({ key: DocumentRequest.create, data: { key, ids: selectedRowKeys } });
    props.listenOnce(DocumentRequest.create, async (arg) => {
      await delay(300);
      if (arg.data) {
        props.openNotification('success', 'Đã cập nhật');
        form.resetFields();
        getDocumentRequest();
      }
      setSelectedRowKeys([]);
      setLoading(false);
    });
  };

  const getPosition = () => {
    const user = localStorage.getItem(TOKEN_KEY);
    return JSON.parse(user).position;
  };

  return (
    <>
      <Form
        {...props.formItemLayout}
        form={form}
        layout="vertical"
        name="register"
        onFinish={onFinish}
        initialValues={{
          residence: ['zhejiang', 'hangzhou', 'xihu'],
          prefix: '86',
        }}
        style={{ display: 'flex', flexWrap: 'wrap' }}
        scrollToFirstError
      >
        <Form.Item name="name" label="Tên Tài Liệu" style={props.widthStyle} rules={[{ required: true, message: 'Please input name' }]}>
          <Input.TextArea rows={1} showCount maxLength={200} />
        </Form.Item>

        <Form.Item name="publisher" label="Nhà Xuất Bản" style={props.widthStyle} rules={[{ required: true, message: 'Please input publisher!' }]}>
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="author" label="Tác Giả" style={props.widthStyle} rules={[{ required: true, message: 'Please input author!' }]}>
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="quantity" label="Số Lượng" style={props.widthStyle} rules={[{ type: 'number', min: 1, max: 999, message: 'min >= 1, max <= 999' }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label=" " {...props.tailFormItemLayout} style={{ ...props.widthStyle }}>
          <Button style={{ minWidth: '47%' }} type="primary" htmlType="submit" icon={<SaveOutlined />}>
            {' '}
            Tạo{' '}
          </Button>
        </Form.Item>
        <Form.Item label=" " {...props.tailFormItemLayout} style={{ ...props.widthStyle }} hidden={!(selectedRowKeys.length && getPosition() === 'ADMIN')}>
          <Button onClick={updateDocumentStatus('approved')} style={{ minWidth: '47%' }} type="primary" icon={<CheckOutlined />}>
            {' '}
            Phê Duyệt{' '}
          </Button>
          <Button onClick={updateDocumentStatus('rejected')} style={{ marginLeft: 8, minWidth: '47%' }} type="dashed" danger icon={<CloseOutlined />}>
            {' '}
            Từ Chối{' '}
          </Button>
        </Form.Item>
      </Form>
      <Table
        rowSelection={
          getPosition() === 'ADMIN' && {
            type: 'checkbox',
            ...rowSelection,
          }
        }
        columns={columns}
        dataSource={documentRequests}
        loading={loading}
        rowKey={'id'}
        tableLayout={'fixed'}
        scroll={{ x: 1400, y: 450 }}
      />
    </>
  );
};

export default DocumentRequestPage;
