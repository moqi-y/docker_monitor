import {Space, Table, Tag, Spin, Button} from 'antd';
import type {TableProps} from 'antd';
import {useEffect, useState} from "react";
import {useRequest} from 'umi';
import {getContainerList} from "@/api/container";
import {CaretRightOutlined, SearchOutlined, StopOutlined} from "@ant-design/icons";
import {index} from "@umijs/utils/compiled/cheerio/lib/api/traversing";
import {getImagesList} from "@/api/images";


const columns: TableProps<object>['columns'] = [
    {
        title: '序号',
        dataIndex: 'key',
        key: 'row',
        render: (text: string, record: any, index: number) => <>{index + 1}</>,
    },
    {
        title: '镜像ID',
        dataIndex: 'image_id',
        key: 'image_id',
        render: (text: string) => <>{text.substring(0,25)}</>,
    },
    {
        title: 'tags',
        dataIndex: 'tags',
        key: 'tags',
        render: (text: string) => <Tag color="blue">{text}</Tag>,
    }, {
        title: '镜像创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
    },
    {
        title: '镜像大小',
        dataIndex: 'virtual_size',
        key: 'virtual_size',
        render: (text: string) => <>{Number(text).toFixed(3)} MB</>,
    },
    {
        title: '系统',
        dataIndex: 'system',
        key: 'system',
        render: (text: string) => <>{text.substring(0, 1).toUpperCase() + text.substring(1)}</>,
    },
    {
        title: '架构',
        dataIndex: 'architecture',
        key: 'architecture',
    }
];


function Container() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getImagesList().then((res) => {
            setData(res.data?.dockerImage?.images)
            setLoading(false)
        })
    }, [])
    return (
        <div>
            <Table<object> columns={columns} dataSource={data} loading={loading} rowKey={record => record.image_id}/>
        </div>
    )
}

export default Container