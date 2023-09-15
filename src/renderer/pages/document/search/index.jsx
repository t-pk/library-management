import React, { useState } from 'react';
import { SettingOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Cascader, Input, Select, Space, Row, Dropdown, Checkbox } from 'antd';
const { Option } = Select;
import './ui.scss';

const items = [
  { key: 'Name', label: (<Checkbox value="Name">Name</Checkbox>) },
  { key: 'Code', label: (<Checkbox value="Code">Code</Checkbox>) },
  { key: 'Type', label: (<Checkbox value="Type">Type</Checkbox>) },
];

const DocumentSearchPage = () => {
  const [open, setOpen] = useState(false);
  const handleMenuClick = (e) => {
    if (e.key === '3') {
      setOpen(false);
    }
  };
  const handleOpenChange = (flag) => {
    setOpen(flag);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Input
        placeholder="Name"
        style={{ width: '100%', paddingRight: 10 }}
        addonAfter={<Dropdown
          menu={{ items }}
          trigger={['click']}
          className='search-options' onOpenChange={handleOpenChange}
          open={open}
        >
          <Space >
            Seach options
            <DownOutlined />
          </Space>
        </Dropdown>} defaultValue="" />
      <Button type='primary'>Create Document</Button>
    </div>

  )
};
export default DocumentSearchPage;