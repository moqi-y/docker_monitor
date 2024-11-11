import { Link, Outlet } from 'umi';
import './index.less';
import React, { useState } from 'react';
import { Breadcrumb, Layout, Menu, theme,ConfigProvider  } from 'antd';
import { history } from 'umi';
import {
    AppstoreOutlined,
    ContainerOutlined,
    DesktopOutlined,
    PieChartOutlined,
    DockerOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd'

const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: '概览', path: '/' },
    { key: '2', icon: <ContainerOutlined />, label: '主机管理', path: '/host' },
    { key: '3', icon: <DesktopOutlined />, label: '镜像管理', path: '/images' },
    {
        key: '4', icon: <DockerOutlined />, label: '容器管理',
        children: [
            { key: '4-1', icon: <AppstoreOutlined />, label: '容器列表', path: '/container' }
        ]
    }
];

const onSelect = (key: object) => {
    history.push(key.item.props.path)
}


export default function App(props: any) {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <ConfigProvider theme={{ cssVar: true }}>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div className="logo-vertical">
                        <img src="./logo.svg" alt="logo" className='logo' />
                        容器管理系统
                    </div>
                    <Menu onSelect={onSelect} theme="dark" mode="inline" items={items} />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: '#001529' }}>
                        logo
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        容器管理系统 ©{new Date().getFullYear()} Created by gqh & yz
                    </Footer>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}
