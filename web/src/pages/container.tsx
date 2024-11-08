import {Space, Table, Tag, message, Button} from 'antd';
import type {TableProps} from 'antd';
import {useCallback, useEffect, useState} from 'react';
import {changeContainerStatus, getContainerList, getContainerLog} from '@/api/container';
import {CaretRightOutlined, InfoCircleOutlined, StopOutlined} from '@ant-design/icons';
import Logs from "@/components/logs";


function Container() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();
    const [isShowLog, setIsShowLog] = useState(false)
    const [containerName, setContainerName] = useState('')
    const [logText, setLogText] = useState('')

    const getLogs = (containerName:string) => {
        getContainerLog({containerName: containerName})
            .then((res: any) => {
                setLogText(res.data.dockerContainer.logs)
            })
    }

    const showModal = (e:any) => {
        getLogs(e.container_name);
        setContainerName(e.container_name)
        setIsShowLog(true);
    };

    const handleCancel = () => {
        setIsShowLog(false);
    };

    function changeStatus(container_name: string, status:string) {
        setLoading(true);
        let statusText = status === 'running' ? 'stop' : 'start';
        changeContainerStatus({containerName: container_name, status: statusText})
            .then(async (res: any) => {
                await getList();
                setLoading(false);
                messageApi.open({
                    type: 'success',
                    content: '操作成功',
                });
            })
            .catch((err) => {
                messageApi.open({
                    type: 'error',
                    content: '操作失败',
                });
                setLoading(false);
            })
    }


    interface Record {
        container_id: string;
        container_name: string;
        create_time: string;
        start_time: string;
        memory_rate: string;
        ports: string[];
        status: string;
    }

    const columns: TableProps<object>['columns'] = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'row',
            render: (text: string, record: any, index: number) => <>{index + 1}</>,
        },
        {
            title: '容器ID',
            dataIndex: 'container_id',
            key: 'container_id',
            render: (text: string) => <>{text.substring(0, 15)}</>,
        },
        {
            title: '容器名称',
            dataIndex: 'container_name',
            key: 'container_name',
        },
        {
            title: '容器创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '容器启动时间',
            dataIndex: 'start_time',
            key: 'start_time',
        },
        {
            title: '内存占用率',
            dataIndex: 'memory_rate',
            key: 'memory_rate',
        },
        {
            title: '端口',
            dataIndex: 'ports',
            key: 'ports',
            render: (ports) => {
                return ports.join(' | ');
            },
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            render: (status) => (
                <Tag color={status === 'running' ? 'green' : 'volcano'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record: Record) => (
                <Space size="middle">
                    {record.status === 'running' ?
                        <Button type="primary" color="danger" icon={<StopOutlined/>} variant="outlined"
                                onClick={() => changeStatus(record.container_name, record.status)}>
                            停止
                        </Button> :
                        <Button type="primary" color="primary" icon={<CaretRightOutlined/>} variant="outlined"
                                onClick={() => changeStatus(record.container_name, record.status)}>
                            启动
                        </Button>}

                    <Button type="primary" color="secondary" icon={<InfoCircleOutlined/>} variant="outlined"
                            onClick={() => showModal(record)}>
                        查看日志
                    </Button>
                </Space>
            ),
        },
    ];
    const getList = async () => {
        let res = await getContainerList();
        setData(res.data?.dockerContainer?.containers);
        setLoading(false);
    }

    useEffect(() => {
        getList();
    }, []);

    return (
        <div>
            {contextHolder}
            <Logs isShowLog={isShowLog} logText={logText} containerName={containerName} handleCancel={handleCancel}/>
            <Table<object> columns={columns} dataSource={data} loading={loading}
                           rowKey={record => record.container_id}/>
        </div>
    );
}

export default Container;