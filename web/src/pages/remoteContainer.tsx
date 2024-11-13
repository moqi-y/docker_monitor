import MyTerminal from "@/components/MyTerminal";
import { useState ,useEffect} from "react";
import { Button, Space, Table, Tag, } from 'antd';
import { CodeOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { getRemoteServerList } from "@/api/remoteServer";

function RemoteContainer() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getRemoteServerList('false').then((res:any) => {
            setData(res.data)
            setLoading(false)
        })
    }, [])
    const [isShowTerminal, setIsShowTerminal] = useState(false)
    const [terminalName, setTerminalName] = useState('')

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
            title: '操作',
            key: 'operation',
            render: (_, record) =>
                <Space size="middle">
                    <Button color="primary" variant="filled" icon={<CodeOutlined />}
                            onClick={() => showTerminal(record)}>
                            终端
                        </Button>
                </Space>
        }
    ];

    const showTerminal = (e: any) => {
        setTerminalName(e.ip);
        setIsShowTerminal(true);
    }
    const handleTerminalCancel = () => {
        setIsShowTerminal(false);
    }

    return (
        <div className="container">
            <Table<object> columns={columns} dataSource={data} loading={loading} rowKey={record => record.ip} />
            <MyTerminal isShowTerminal={isShowTerminal} terminalName={"10.13.6.47"} info={{ip:"10.13.6.47",password:"Yuy@123", username:"root"}} handleTerminalCancel={handleTerminalCancel} type={2} />
        </div>
    )
}

export default RemoteContainer