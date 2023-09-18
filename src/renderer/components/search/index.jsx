import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Table, Form } from 'antd';
import './ui.scss';

const style = { minWidth: '28%', marginRight: '10px' };

const SearchFC = ({ columns, onClick, onChange, inputState, documents, loading, rowSelection, validates }) => {

  const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word) {
      return word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  const ExportComponent = () => {
    console.log("12321");
    return Object.keys(validates).map((item) =>
      <Form.Item style={style} key={item} >
        <Input
          placeholder={camelize(item)}
          value={inputState[item]}
          style={style}
          id={item}
          onChange={onChange}
          maxLength={validates[item].max}
        />
      </Form.Item>
    )
  }

  return (
    <>
      <Form style={{ display: 'flex' }}>
        <ExportComponent />
        <Form.Item style={style}>
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
      />
    </>
  )
};
export default SearchFC;