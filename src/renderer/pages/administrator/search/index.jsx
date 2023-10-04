import { useState, useEffect, useCallback } from 'react';
import { Button, Input, Table, Form, Tag, Checkbox, Select, Space, Dropdown, Modal, Radio } from 'antd';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import { User } from '../../../constants';
import debounce from 'lodash.debounce';
import { delay, formatDateTime, objectToQueryString, queryStringToObject, generateRandomString } from '../../../utils/helper';
import { useLocation, useNavigate } from 'react-router-dom';

const mappingPosition = {
  STAFF: 'Nhân Viên',
  ADMIN: 'Quản Trị',
};

const AdministratorSearchPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [modal, contextHolder] = Modal.useModal();

  const redirectCreate = (record) => () => {
    const data = {
      id: record.id,
      fullName: record.fullName,
      username: record.username,
      phoneNumber: record.phoneNumber,
      email: record.email,
      position: record.position,
      status: record.status,
    };
    const queryString = objectToQueryString(data);
    return navigate(`/administrator/create?${queryString}`);
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      width: '5%',
      align: 'center',
    },
    {
      title: 'Họ Và Tên',
      dataIndex: 'fullName',
    },
    {
      title: 'Username',
      align: 'center',
      dataIndex: 'username',
    },
    {
      title: 'Chức Vụ',
      dataIndex: 'position',
      render: (position) => mappingPosition[position],
    },
    {
      title: 'Trạng Thái',
      align: 'center',
      dataIndex: 'status',
      render: (status) => <Tag color={status ? 'green' : 'red'}>{status ? 'Đang hoạt động' : 'Vô hiệu hóa'}</Tag>,
    },
    {
      title: 'Số Điện Thoại',
      align: 'center',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Email',
      align: 'center',
      dataIndex: 'email',
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
      title: 'Cập Nhật Bởi',
      align: 'center',
      dataIndex: ['updatedInfo', 'fullName'],
    },
    {
      title: 'Ngày Cập Nhật',
      dataIndex: 'updatedAt',
      align: 'center',
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
                  label: <a onClick={redirectCreate(record)}>Chỉnh sửa</a>,
                  key: '1',
                },
                {
                  label: <a onClick={resetPassword(record)}>Đặt Lại Mật Khẩu</a>,
                  key: '2',
                  danger: true
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
  useEffect(() => {
    let userInfo = queryStringToObject(location.search);
    if (userInfo && Object.keys(userInfo).length) {
      userInfo.id = +userInfo.id;
      userInfo.status = userInfo.status === 'true' ? true : false;
      form.setFieldValue('id', userInfo.id);
      form.setFieldValue('status', userInfo.status);
    }
    debounceFc();
  }, []);

  const onFinish = (values) => {
    setLoading(true);
    props.callDatabase({ key: User.create, data: values });

    props.listenOnce(User.create, async (arg) => {
      await delay(300);
      if (arg.data) {
        props.openNotification('success', 'Đã Tạo Tài Khoản');
        form.resetFields();
        getUsers();
      }
      setLoading(false);
    });
  };

  const getUsers = () => {
    setLoading(true);
    props.callDatabase({ key: User });

    props.listenOnce(User.search, async (arg) => {
      await delay(300);
      if (arg.data) {
        setUsers(arg.data);
      }
      setLoading(false);
    });
  };

  const debounceUsers = () => {
    setLoading(true);
    let data = {};
    for (const [key, value] of Object.entries(form.getFieldsValue())) {
      if (value) data[key] = value;
      if (key === 'status' && value !== undefined) data[key] = value;
    }

    props.callDatabase({ key: User.search, data });
    props.listenOnce(User.search, async (arg) => {
      await delay(200);
      if (arg.data) {
        setUsers(arg.data || []);
      }
      setLoading(false);
    });
  };
  const debounceFc = useCallback(debounce(debounceUsers, 200), []);

  const onChange = () => {
    debounceFc();
  };

  const resetPassword = (e) => () => {
    modal.confirm({
      title: 'Xác nhận',
      content: (
        <div>
          <p>Bạn có chắc là muốn đặt lại Mật Khẩu cho tài khoản:  <b>{e.username}</b></p>
        </div>
      ),
      onOk() {
         const password = generateRandomString(8);
        props.callDatabase({ key: User.resetPwd, data: { id: e.id, password: password } });
        props.listenOnce(User.resetPwd, async (arg) => {
          if (arg.data) props.openNotification('success', <> <p>Mật khẩu mới là: <b>{password}</b> </p></>);
        });
      },
    });
  };

  return (
    <>
    {contextHolder}
      <Form
        {...props.formItemLayout}
        form={form}
        layout="vertical"
        name="register"
        onFinish={onFinish}
        initialValues={{ status: undefined, position: undefined }}
        style={{ display: 'flex', flexWrap: 'wrap' }}
        scrollToFirstError
        noValidate={true}
      >
        <Form.Item name="id" label="Id" style={props.widthStyle}>
          <Input type="number" onChange={onChange} />
        </Form.Item>

        <Form.Item name="fullName" label="Họ Và Tên" style={props.widthStyle}>
          <Input onChange={onChange} />
        </Form.Item>

        <Form.Item name="username" label="Tên Đăng Nhập" style={props.widthStyle}>
          <Input onChange={onChange} />
        </Form.Item>

        <Form.Item name="position" label={'Chức Vụ'} style={{ ...props.widthStyle }}>
          <Radio.Group name="position" onChange={onChange} buttonStyle="solid">
            <Radio.Button value={'ADMIN'}>Quản Trị</Radio.Button>
            <Radio.Button value={'STAFF'}>Nhân Viên</Radio.Button>
            <Radio.Button value={undefined}>Skip</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="phoneNumber" label="Số Điện Thoại" style={props.widthStyle}>
          <Input onChange={onChange} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="email" label="Email" style={props.widthStyle}>
          <Input onChange={onChange} />
        </Form.Item>

        <Form.Item name="status" label={'Trạng Thái'} style={{ ...props.widthStyle }}>
          <Radio.Group name="status" onChange={onChange} buttonStyle="solid">
            <Radio.Button value={true}>
              Hoạt Động
            </Radio.Button>
            <Radio.Button value={false}>Vô Hiệu Hóa</Radio.Button>
            <Radio.Button value={undefined}>Skip</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label=" " {...props.tailFormItemLayout} style={{ ...props.widthStyle }}>
          <Button onClick={onChange} style={{ marginLeft: 8, minWidth: '47%' }} type="primary" icon={<SearchOutlined />}>
            {' '}
            Tìm Kiếm{' '}
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={users} loading={loading} rowKey={'id'} tableLayout={'fixed'} scroll={{ x: 1400, y: 450 }} />
    </>
  );
};

export default AdministratorSearchPage;
