import React, { useState, useCallback } from 'react';
import { SettingOutlined, DownOutlined, CaretDownOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Cascader, Input, Select, Space, Row, Dropdown, Checkbox, Table, Form } from 'antd';
import debounce from 'lodash.debounce';
import { internalCall } from '../../actions/index';
const { Option } = Select;
import './ui.scss';

const style = { minWidth: '28%', marginRight: '10px' };

const FCSearch = ({
  columns, fetchKey, initData
}) => {
  const [inputState, setinputState] = useState(initData);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDebounceFn = reState => {
    console.log("resta", reState, fetchKey);
    internalCall({ key: fetchKey, data: reState });
    console.log("window.electron.ipcRenderer.once", window.electron.ipcRenderer.once);
    window.electron.ipcRenderer.once('ipc-database', async (arg) => {
      setLoading(false);
      if (arg && arg.data) {
        console.log(arg.data);
        setDocuments(arg.data);
      }
    });
  }
  const debounceFc = useCallback(debounce(handleDebounceFn, 300), []);

  const onChange = (e) => {
    setLoading(true);
    const reState = { ...inputState, [e.target.id]: e.target.value };
    setinputState(reState);
    debounceFc(reState);
  };

  const onClick = () => {
    setLoading(true);
    debounceFc(inputState);
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };

  const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word) {
      return word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  /**
   * 
   * @param {*} schema  {key: values}
   */
  const ExportComponent = () => {
    return Object.keys(inputState).map((item) =>
      <Form.Item style={style} key={item} >
        <Input
          placeholder={camelize(item)}
          value={inputState.id}
          style={style}
          id={item}
          onChange={onChange}
          // maxLength={initData[item].max}
        />
      </Form.Item>
    )
  }

  return (
    <>
      <Form style={{ display: 'flex' }}>
        <ExportComponent/>
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
export default FCSearch;