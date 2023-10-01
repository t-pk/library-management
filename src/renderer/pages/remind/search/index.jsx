import { useState, useCallback, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Table, Form, Radio, Space } from 'antd';
import debounce from 'lodash.debounce';
import { ReaderType, Remind, RemindDetail } from 'renderer/constants';
import { useLocation } from 'react-router-dom';
import { queryStringToObject, formatDateTime, delay } from '../../../utils/helper';

import './ui.scss';

const RemindSearchPage = (props) => {
  const location = useLocation();
  const [form] = Form.useForm();
  const [inputState, setinputState] = useState({ fullName: '', id: 0, studentId: '' });
  const [reminds, setReminds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const readerTypeId = Form.useWatch('readerTypeId', form);
  const [currentPage, setCurrentPage] = useState(1);
  const [remindDetail, setRemindDetail] = useState([]);
  const pageSize = 20; // Number of items per page

  const columns = [
    {
      title: 'Mã Độc Giả',
      dataIndex: 'id',
      render: (id) => id,
      align: 'center',
    },
    {
      title: 'Tên Độc Giả',
      dataIndex: 'fullName',
      render: (fullName) => fullName,
      align: 'center',
    },
    {
      title: 'Số Lần Nhắc Nhở',
      dataIndex: 'total',
      align: 'center',
    },
    {
      title: 'Mã Sinh Viên',
      dataIndex: 'studentId',
      render: (studentId) => studentId,
      align: 'center',
    },
    {
      title: 'Mã N.Viên - C.Bộ',
      dataIndex: 'civilServantId',
      render: (civilServantId) => civilServantId,
      align: 'center',
    },
  ];

  useEffect(() => {
    let remindQuery = { ...inputState };
    let remindInfo = queryStringToObject(location.search);
    if (remindInfo && Object.keys(remindInfo).length) {
      remindInfo.readerTypeId = +remindInfo.readerTypeId;
      remindQuery = { ...remindQuery, ...remindInfo };
      console.log('remindInfo', remindInfo);
      form.setFieldsValue(remindInfo);
    }

    debounceFc(remindQuery);
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
  }, []);

  const handleDebounceFn = (reState) => {
    props.callDatabase({ key: Remind.search, data: reState });
    props.listenOnce(Remind.search, (arg) => {
      setLoading(false);
      setReminds(arg.data || []);
    });
  };

  const debounceFc = useCallback(debounce(handleDebounceFn, 200), []);

  const getInitData = () => {
    props.callDatabase({ key: ReaderType.search });
    props.callDatabase({ key: Remind.search });

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
      }
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
  const clickExpand = (isOpen, record) => {
    if (!isOpen) return setRemindDetail([]);
    setLoading(true);
    props.callDatabase({ key: RemindDetail.search, data: record });
    props.listenOnce(RemindDetail.search, async (arg) => {
      await delay(100);
      setLoading(false);
      setRemindDetail(arg.data || []);
    });
  };
  const expandedRowRender = () => {
    const columns = [
      {
        title: 'Mã Phiếu Nhắc Nhở',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: 'Mã Phiếu Trả',
        dataIndex: 'returnId',
        align: 'center',
      },
      {
        title: 'Mô Tả',
        dataIndex: 'description',
        align: 'center',
      },
      {
        title: 'Ngày Tạo',
        dataIndex: 'createdAt',
        align: 'center',
        render: (createdAt) => {
          return formatDateTime(createdAt);
        },
      },
    ];
    return (
      <div className="color-table-children">
        <Table size="small" bordered={true} rowKey={'id'} columns={columns} dataSource={remindDetail} pagination={false} />
      </div>
    );
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
        <Form.Item name="readerId" label="Mã Độc Giả" style={props.widthStyle}>
          <Input id="readerId" onChange={onChange} />
        </Form.Item>

        <Form.Item name="fullName" label="Tên Độc Giả" style={props.widthStyle}>
          <Input id="fullName" onChange={onChange} />
        </Form.Item>

        <Form.Item name="studentId" label="Mã Sinh Viên" style={props.widthStyle}>
          <Input id="studentId" disabled={readerTypeId && readerTypeId !== 1} onChange={onChange} />
        </Form.Item>

        <Form.Item name="civilServantId" label="Mã Cán Bộ - Nhân Viên" style={props.widthStyle}>
          <Input id="civilServantId" disabled={readerTypeId && readerTypeId !== 2} onChange={onChange} />
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
        dataSource={reminds}
        bordered={true}
        loading={loading}
        rowKey={'id'}
        tableLayout={'fixed'}
        size="small"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: reminds.length,
          onChange: handlePageChange,
        }}
        scroll={{ x: 1400, y: 450 }}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ['0'],
          onExpand: clickExpand,
        }}
      />
    </>
  );
};
export default RemindSearchPage;
