import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { withRouter } from 'react-router';

import './SideBar.scss';
import logo from '../../images/logo.png';
const { Sider } = Layout;
const { SubMenu } = Menu;

class SideBar extends Component {
  state = {
    collapsed: false,
    selectedKey: ''
  };

  componentDidMount() {
    const path = this.props.match.path;
    const indexKey = 'purchase_order';
    const menuActive = [
      { path: '/purchase-order', key: 'purchase_order' },
      { path: '/contract', key: 'contract' },
      { path: '/report', key: 'report' },
      { path: '/setting-school', key: 'setting_school' },
      { path: '/setting-staff', key: 'setting_staff' },
      { path: '/setting-payment', key: 'setting_payment' },
      { path: '/setting-budget', key: 'setting_budget' }
    ];
    if (path === '/') {
      this.setState({
        selectedKey: indexKey
      });
    } else {
      for (let i = 0; i < menuActive.length; i++) {
        if (path.indexOf(menuActive[i].path) > -1) {
          this.setState({
            selectedKey: menuActive[i].key
          });
        }
      }
    }
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  onOpenSelected = data => {
    const { history } = this.props;

    switch (data.key) {
      case 'purchase_order':
        history.push('/');
        break;
      case 'contract':
        history.push('/contract');
        break;
      case 'report':
        history.push('/report');
        break;
      case 'setting':
        history.push('/setting-school');
        break;
      case 'setting_school':
        history.push('/setting-school');
        break;
      case 'setting_staff':
        history.push('/setting-staff');
        break;
      case 'setting_payment':
        history.push('/setting-payment');
        break;
      case 'setting_budget':
        history.push('/setting-budget');
        break;

      default:
        break;
    }
  };

  onTitleClick = key => {
    console.log(key);
  };

  render() {
    return (
      <Sider
        breakpoint="lg"
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
        className="custom-sidebar"
      >
        <div className="logo-icon">
          <img src={logo} alt="Saigon South International School" />
        </div>
        <Menu
          onClick={this.onOpenSelected}
          theme="dark"
          selectedKeys={[this.state.selectedKey]}
          defaultOpenKeys={['setting']}
          mode="inline"
          // onSelect={this.onOpenSelected}
        >
          <Menu.Item key="purchase_order">
            <Icon type="credit-card" />
            <span>Purchase Order</span>
          </Menu.Item>
          <Menu.Item key="contract">
            <Icon type="unordered-list" />
            <span>Contract</span>
          </Menu.Item>
          <Menu.Item key="report">
            <Icon type="bar-chart" />
            <span>Report</span>
          </Menu.Item>
          <SubMenu
            key="setting"
            title={
              <span>
                <Icon type="setting" />
                <span>Setting</span>
              </span>
            }
            onTitleClick={this.onTitleClick}
          >
            <Menu.Item key="setting_school">School</Menu.Item>
            <Menu.Item key="setting_staff">Staff</Menu.Item>
            <Menu.Item key="setting_payment">Payment</Menu.Item>
            <Menu.Item key="setting_budget">Budget</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    );
  }
}

export default withRouter(SideBar);
