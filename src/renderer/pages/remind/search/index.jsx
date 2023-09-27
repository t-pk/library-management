import React, { useState, useCallback, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Table, Form, Radio } from 'antd';
import debounce from 'lodash.debounce';

import './ui.scss';

const formItemLayout = {
  labelCol: { xs: { span: 30 }, sm: { span: 30 } },
  wrapperCol: { xs: { span: 40 }, sm: { span: 23 } },
};
const reStyle = { minWidth: '32%' };

const RemindSearchPage = (props) => {
  const [form] = Form.useForm();
  const [inputState, setinputState] = useState({ fullName: '', id: 0, studentId: '' });
  const [reminds, setReminds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readerTypes, setReaderTypes] = useState([]);
  const readerTypeId = Form.useWatch('readerTypeId', form);
  const [currentPage, setCurrentPage] = React.useState(1);
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

  const handleDebounceFn = (reState) => {
    props.callDatabase({ key: 'remind-search', data: reState });
    props.listenOnce('remind-search', (arg) => {
      setLoading(false);
      setReminds(arg.data || []);
    });
  };

  const debounceFc = useCallback(debounce(handleDebounceFn, 200), []);

  const getInitData = () => {
    props.callDatabase({ key: 'readerType-search' });
    props.callDatabase({ key: 'remind-search' });

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

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        layout="vertical"
        name="dynamic_rule"
        style={{ display: 'flex', flexWrap: 'wrap' }}
        scrollToFirstError
        initialValues={{ readerTypeId: undefined }}
      >
        <Form.Item label="Mã Độc Giả" style={reStyle}>
          <Input id="readerId" onChange={onChange} />
        </Form.Item>

        <Form.Item label="Tên Độc Giả" style={reStyle}>
          <Input id="fullName" onChange={onChange} />
        </Form.Item>

        <Form.Item name="studentId" label="Mã Sinh Viên" style={reStyle}>
          <Input disabled={readerTypeId && readerTypeId !== 1} id="studentId" onChange={onChange} />
        </Form.Item>

        <Form.Item name="civilServantId" label="Mã Cán Bộ - Nhân Viên" style={reStyle}>
          <Input disabled={readerTypeId && readerTypeId !== 2} id="civilServantId" onChange={onChange} />
        </Form.Item>

        <Form.Item name="readerTypeId" label="Loại Độc Giả" style={reStyle}>
          <Radio.Group
            name="readerTypeId"
            onChange={onChange}
            options={readerTypes}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>

        <Form.Item style={reStyle} label=" ">
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
      />
    </>
  );
};
export default RemindSearchPage;
