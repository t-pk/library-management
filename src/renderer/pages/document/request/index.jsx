import { useState, useEffect } from 'react';
import { Button, Input, Table, Form, Tag, InputNumber } from 'antd';
import { FormOutlined,SaveOutlined } from '@ant-design/icons';
import { DocumentRequest } from '../../../constants';
import { delay, formatDateTime } from '../../../utils/helper';

const DocumentRequestPage = (props) => {
  const [inputState, setinputState] = useState({ name: '', id: '' });
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [documentRequests, setDocumentRequests] = useState([]);
  const mappingStatus ={
    'awaitingReview': 'Đang Xem Xét',
    'approved': 'Đã Phê Duyệt',
    'rejected': 'Đã Từ Chối'
  }
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
      render: (status) => <Tag color={status === 'awaitingReview' ? 'orange' : status === 'approved' ? 'green': 'red'}>{mappingStatus[status]}</Tag>,

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
      dataIndex: 'createdBy',
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
      dataIndex: 'approvedBy',
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
      dataIndex: 'rejectedBy',
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
    props.callDatabase({ key: DocumentRequest.create, data: {...values, status: 'awaitingReview'} });

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
        setDocumentRequests(arg.data);
      }
      setLoading(false);
    });
  }

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

        <Form.Item name="publisher" label="Nhà Xuất Bản" style={props.widthStyle} rules={[{ required: true, message: 'Please select publisher!' }]}>
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="author" label="Tác Giả" style={props.widthStyle} rules={[{ required: true, message: 'Please select author!' }]}>
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Số Lượng"
          style={props.widthStyle}
          rules={[
            { type: 'number', min: 1, max:999, message: 'min >= 1, max <= 999' },
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label=" " {...props.tailFormItemLayout} style={{ ...props.widthStyle }}>
          <Button style={{ minWidth: '47%' }} type="primary" htmlType="submit" icon={<SaveOutlined />}>
            {' '}
            Tạo{' '}
          </Button>
          <Button style={{ marginLeft: 8, minWidth: '47%' }} type="primary" icon={<FormOutlined />}>
            {' '}
            Phê Duyệt{' '}
          </Button>
        </Form.Item>
      </Form>
      <Table
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
