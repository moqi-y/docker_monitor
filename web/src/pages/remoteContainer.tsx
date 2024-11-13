import MyTerminal from "@/components/MyTerminal";
import { useState, useEffect } from "react";
import { Button, Col, Drawer, Flex, Form, Input, message, Modal, Popconfirm, Row, Space, Table, } from 'antd';
import { CloudServerOutlined, CodeOutlined, DeleteOutlined, LockOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import type { FormProps, TableProps } from 'antd';
import type { FormInstance } from 'antd/es/form';

import { addRemoteServer, deleteRemoteServer, getRemoteServerList } from "@/api/remoteServer";

function RemoteContainer() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [IsShowAddServer, setIsShowAddServer] = useState(false)
    useEffect(() => {
        getList()
    }, [])
    const getList = () => {
        getRemoteServerList().then((res: any) => {
            setData(res?.data)
            setLoading(false)
        })
    }
    const [isShowTerminal, setIsShowTerminal] = useState(false)
    const [serverInfo, setServerInfo] = useState<any>({})
    const [terminalName, setTerminalName] = useState('')
    const [form] = Form.useForm(); // 创建 form 实例
    const [tempPassword, setTempPassword] = useState('')
    const columns: TableProps<object>['columns'] = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'row',
            render: (text: string, record: any, index: number) => <>{index + 1}</>,
        },
        {
            title: '服务器ID',
            dataIndex: 'serverId',
            key: 'name',
        },
        {
            title: '服务器IP',
            dataIndex: 'ip',
            key: 'ip'
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'tausernamegs'
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '最近操作时间',
            dataIndex: 'lastOperateTime',
            key: 'lastOperateTime'
        },
        {
            title: '操作',
            key: 'operation',
            render: (_, record) =>
                <Space size="middle">
                    <Button color="primary" variant="filled" icon={<CodeOutlined />}
                        onClick={() => showTerminal(record)}>
                        终端
                    </Button>
                    {/* <Button color="primary" variant="filled" icon={<EditOutlined />}>
                        编辑
                    </Button> */}
                    <Popconfirm
                        title="确认删除吗？"
                        description="确认删除该服务器吗?"
                        onConfirm={() => deleteServer(record)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button color="danger" variant="filled" icon={<DeleteOutlined />}>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
        }
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = () => {
        if(!tempPassword) {
            message.error('请输入密码');
            return;
        };
        setIsModalOpen(false);
        setTerminalName(serverInfo.ip);
        setServerInfo({ ...serverInfo, password: tempPassword });
        setIsShowTerminal(true);
        setTempPassword('');
        getList();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setTempPassword('');
        getList();
    };

    const showTerminal = (e: any) => {
        setIsModalOpen(true);
        setServerInfo(e);
        getList();
    }
    const handleTerminalCancel = () => {
        setIsShowTerminal(false);
        getList();
    }

    // 新增
    const addServer = () => {
        setIsShowAddServer(true);
    }

    const handleAddServerCancel = () => {
        setIsShowAddServer(false);
    }

    const confirmAddServer = async (e: any) => {
        const values = await form.validateFields();
        const res: any = await addRemoteServer(values);
        if (res.code === 200) {
            message.success("添加成功");
        } else {
            message.error(res.message);
        }
        setIsShowAddServer(false);
        getList();
    }

    // 删除
    const deleteServer = async (e: any) => {
        const res: any = await deleteRemoteServer(e.ip);
        if (res.code === 200) {
            message.success("删除成功");
        }
        else {
            message.error(res.message);
        }
        getList();
    }

    return (
        <div className="container">
            <Flex gap="middle" wrap vertical align="start" style={{ marginBottom: 10, marginTop: 20 }}>
                <Button color="primary" variant="outlined" icon={<PlusOutlined />} onClick={addServer}>新增</Button>
            </Flex>
            <Table<object> columns={columns} dataSource={data} loading={loading} rowKey={record => record.ip} />
            <MyTerminal isShowTerminal={isShowTerminal} terminalName={terminalName} info={serverInfo} handleTerminalCancel={handleTerminalCancel} type={2} />
            <Drawer
                title="新增服务器"
                width={750}
                onClose={handleAddServerCancel}
                open={IsShowAddServer}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                        <Button onClick={handleAddServerCancel}>取消</Button>
                        <Button onClick={confirmAddServer} type="primary" htmlType="submit">
                            确认新增
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" hideRequiredMark onFinish={confirmAddServer} form={form}  >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="ip"
                                label="服务器IP"
                                rules={[{ required: true, message: '请输入正确的服务器IP' }]}
                            >
                                <Input addonBefore={<CloudServerOutlined />} placeholder="请输入服务器IP" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="username"
                                label="用户名"
                                rules={[{ required: true, message: '请输入正确的登录用户名' }]}
                            >
                                <Input addonBefore={<UserOutlined />} placeholder="请输入登录用户名" />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="password"
                                label="登录密码"
                                rules={[{ required: true, message: '请输入正确的登录密码' }]}
                            >
                                 <Input.Password addonBefore={<LockOutlined />}  placeholder="请输入登录密码"/>
                            </Form.Item>
                        </Col>
                    </Row> */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="remark"
                                label="备注"
                            >
                                <Input.TextArea rows={4} placeholder="请输入备注" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
            <Modal title="登入密码" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText={"确定"} cancelText={"取消"}>
                <Input.Password required={true} addonBefore={<LockOutlined />} placeholder="请输入服务器登录密码" value={tempPassword} onChange={(e) => setTempPassword(e.target.value)} />
            </Modal>
        </div>
    )
}

export default RemoteContainer