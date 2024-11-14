import { Link, Outlet } from 'umi';
import './index.less';
import React, { useState } from 'react';
import { DownOutlined, LoginOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, ConfigProvider, Avatar, Dropdown, Space } from 'antd';
import { history } from 'umi';
import {
    AppstoreOutlined,
    ContainerOutlined,
    DesktopOutlined,
    PieChartOutlined,
    DockerOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd'
import AiReboot from '@/components/AiReboot';

const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: '概览', path: '/' },
    { key: '2', icon: <ContainerOutlined />, label: '主机管理', 
        children:[
            { key: '2-1', icon: <AppstoreOutlined />, label: '本地主机', path: '/host' },
            { key: '2-2', icon: <AppstoreOutlined />, label: '远程主机', path: '/remoteContainer' },
        ]
     },
    { key: '3', icon: <DesktopOutlined />, label: '镜像管理', path: '/images' },
    {
        key: '4', icon: <DockerOutlined />, label: '容器管理',path: '/container'
    },
    {
        key: '5', icon: <AppstoreOutlined />, label: '运维工具',
        children:[
            { key: '5-1', icon: <AppstoreOutlined />, label: '三方工具', path: '/tools' },
            { key: '5-2', icon: <AppstoreOutlined />, label: '镜像源', path: '/source' },
        ]
    }
];

const onSelect = (key: any) => {
    history.push(key.item.props.path)
}

const loginOut = () => {
    localStorage.clear()
    history.push('/login')
}

export default function App(props: any) {
    const [collapsed, setCollapsed] = useState(false);
    const DropdownList: MenuProps['items'] = [
        {
            key: '1',
            icon: <LoginOutlined />,
            label: (
                <a target="_blank" rel="noopener noreferrer" onClick={loginOut}>
                    退出登录
                </a>
            ),
        },]
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
                    <Header style={{ padding: 0, background: '#001529', color: '#fff', display: 'flex', justifyContent: 'flex-end' }}>
                        <div className='userinfo'>
                            <Dropdown menu={{ items:DropdownList }}>
                                <Space>
                                    <Avatar src="https://tse3-mm.cn.bing.net/th/id/OIP-C.bUW2KSLDmuJtIbm7aLB1TwAAAA?rs=1&pid=ImgDetMain" />
                                    <span>{JSON.parse(localStorage.getItem('userinfo') as string).name}</span>
                                    <DownOutlined />
                                </Space>
                            </Dropdown>
                        </div>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Outlet />
                        <AiReboot></AiReboot>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        容器管理系统 ©{new Date().getFullYear()} Created by gqh & yz
                    </Footer>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}
