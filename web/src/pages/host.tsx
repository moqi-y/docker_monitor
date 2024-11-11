import { useState, useEffect } from 'react';
import { Descriptions, Card, DescriptionsProps, Space, Typography } from 'antd';

const { Text, Title } = Typography;
function Host() {
    const [hostData, setHostData] = useState<any>({});
    // 获取系统数据
    const getHostData = () => {
        fetch('/api/system/info')
            .then((response) => response.json())
            .then((json) => {
                setHostData(json.data.systemInfo)
            })
    }
    useEffect(() => {
        getHostData()
    }, [])

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: '主机系统',
            children: hostData?.system_info?.os,
        },
        {
            key: '2',
            label: '系统架构',
            children: hostData?.system_info?.architecture,
        },
        {
            key: '3',
            label: '处理器信息',
            children: hostData?.system_info?.processor,
        },
        {
            key: '4',
            label: 'CPU物理核心数',
            children: hostData?.system_info?.cpu_physical_cores,
        },
        {
            key: '5',
            label: 'CPU逻辑核心数(含超线程)',
            children: hostData?.system_info?.cpu_logical_cores,
        },
        {
            key: '6',
            label: 'CPU总使用率',
            children: hostData?.cpu_usage + ' %',
        },
        {
            key: '7',
            label: '内存使用率',
            children: hostData?.memory_info?.percent + ' %',
        },
        {
            key: '8',
            label: '内存总量',
            children: hostData?.memory_info?.total + ' GB',
        },
        {
            key: '9',
            label: '内存已使用',
            children: hostData?.memory_info?.used + ' GB',
        },
        {
            key: '10',
            label: '内存可用',
            children: hostData?.memory_info?.available + ' GB',
        },
        {
            key: '11',
            label: '磁盘总量',
            children: hostData?.disk_info?.partitions.reduce((sum, item) => sum + item['total'], 0).toFixed(2) + ' GB',
        },
        {
            key: '12',
            label: '磁盘已使用',
            children: hostData?.disk_info?.partitions.reduce((sum, item) => sum + item['used'], 0).toFixed(2) + ' GB',
        },
        {
            key: '13',
            label: '磁盘可用',
            children: hostData?.disk_info?.partitions.reduce((sum, item) => sum + item['free'], 0).toFixed(2) + ' GB',
        },
        {
            key: '14',
            label: '当前进程数',
            children: hostData?.process_info?.total_processes,
        },
        {
            key: '15',
            label: 'Python版本',
            children: hostData?.system_info?.python_version,
        }
    ];
    return (
        <div style={{width: "95%", margin: "0 auto"}}>
            <Card title="主机信息时间戳" bordered={false} style={{ width: 300, marginTop: 40 }}>
                <Space direction="vertical">
                    <Title level={3} type="success">{hostData?.timestamp}</Title>
                </Space>
            </Card>
            <Descriptions title="主机信息" items={items} style={{ marginTop: 40 }} />
        </div>
    )
}

export default Host;