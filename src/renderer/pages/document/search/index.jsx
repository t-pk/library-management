import React, { useState, useCallback } from 'react';
import { SettingOutlined, DownOutlined, CaretDownOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Cascader, Input, Select, Space, Row, Dropdown, Checkbox, Table, Form } from 'antd';
import debounce from 'lodash.debounce';
import { internalCall } from '../../../../renderer/actions';
import FCSearch from '../../../components/search';
const { Option } = Select;


const columns = [
  {
    title: 'Code',
    dataIndex: 'code',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Type',
    dataIndex: 'type',
  },
];
const DocumentSearchPage = () => {
  let initData = {
    name: '',
    id: '',
    type: ''
  };
  return <FCSearch
    columns={columns}
    fetchKey={'document-search'}
    initData={initData}
  />
}

export  default DocumentSearchPage;