import { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { PieChartOutlined, DockerOutlined } from '@ant-design/icons';
import "./index.css"
import ContainerRate from "@/components/ContainerRate"
import SystemCPURate from "@/components/SystemCPURate"
import SystemMemoryRate from "@/components/SystemMemoryRate"
import SystemChart from "@/components/SystemChart"
import { AnyObject } from 'antd/es/_util/type';

const chartStyle: React.CSSProperties = { background: '#eef1f1', padding: '8px 0', minHeight: '300px' };

export default function Index() {
    const [containerData, setContainerData] = useState<AnyObject>({});
    const [systemData, setSystemData] = useState<AnyObject>({});
    const [imageData, setImageData] = useState<AnyObject>({});

    // 获取容器数据
    const getContainerData = () => {
        fetch('/api/container/list')
            .then((response) => response.json())
            .then((json) => {
                setContainerData(json.data)
            })
    }
    // 获取系统数据
    const getSystemData = () => {
        fetch('/api/system/info')
            .then((response) => response.json())
            .then((json) => {
                //   let tempData:Array<object> = [
                //     {
                //       type: '可使用CPU',
                //       value: 100 - Number(json.data.systemInfo.cpu_usage),
                //     },
                //     {
                //       type: '已使用CPU',
                //       value: json.data.systemInfo.cpu_usage,
                //     }
                //   ]
                console.log("json.data",json.data);
                
                setSystemData(json.data)
            })
    }
    // 获取镜像信息
    const getImagesData = () => {
        fetch('/api/image/list').then((response) => response.json())
            .then((json) => {
                setImageData(json.data) 
            })
    }

    useEffect(() => {
        getContainerData()
        getSystemData()
        getImagesData()
    }, [])

    return (
        <div>
            <Row gutter={16} style={{ paddingTop: '16px' }}>
                <Col className="gutter-row" span={12}>
                    <Card bordered={false}>
                        <Statistic
                            className="statistic"
                            title="镜像总数"
                            value={imageData?.dockerImage?.count}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<PieChartOutlined />}
                            suffix="个"
                        />
                    </Card>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Card bordered={false}>
                        <Statistic
                            className="statistic"
                            title="容器总数"
                            value={containerData?.dockerContainer?.count}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<DockerOutlined />}
                            suffix="个"
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={16} style={{ paddingTop: '16px' }}>
                <Col className="gutter-row" span={8}>
                    <div style={chartStyle}>
                        <SystemCPURate systemData={systemData}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={8}>
                    <div style={chartStyle}>
                        <SystemMemoryRate systemData={systemData}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={8}>
                    <div style={chartStyle}>
                        <ContainerRate systemData={systemData}/>
                    </div>
                </Col>
            </Row>
            <Row gutter={16} style={{ paddingTop: '16px' }}>
                <Col className="gutter-row" span={24}>
                    <div style={chartStyle}>
                        <SystemChart containerData={containerData}/>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
