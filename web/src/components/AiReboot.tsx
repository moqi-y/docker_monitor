import { useState } from 'react';
import { Button, Card, FloatButton, Input, Space } from 'antd';
import { CloseOutlined, CommentOutlined, LoadingOutlined, SendOutlined } from '@ant-design/icons';
import './AiReboot.css'
const { TextArea } = Input;

function AiReboot(props: any) {
    const [isShow, setIsShow] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isAble, setIsAble] = useState(true);
    const onClick = () => {
        isShow ? setIsShow(false) : setIsShow(true);
    }

    const onSendMsg = () => {
        // 发送消息
        setIsAble(false);
        console.log("发送消息:", inputValue);
        setInputValue('');
        setTimeout(() => {
            setIsAble(true);
        }, 1000);
    }

    return (
        <>
            <div>
                <FloatButton icon={<CommentOutlined />} type="primary" className='box' onClick={onClick} />
            </div>
            {isShow &&
                <Card title={<span style={{ color: '#1677ff'}}>AI 智能小助手</span>} extra={<a onClick={onClick}><CloseOutlined /></a>} className='chat-box'>
                    <div className='chat-content'>
                        <h1>能助手</h1>
                        <h1>能助手</h1>
                        <h1>能助手</h1>
                        <h1>能助手</h1>
                        <h1>能助手</h1>
                        <h1>能助手</h1>
                        <h1>能助手</h1>
                        <h1>能助手</h1>
                        <h1>能助手</h1>
                    </div>
                    <div className='chat-input'>
                        <Space direction="horizontal" align="center">
                            <TextArea
                                className='input-box'
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="请输入您的问题"
                                autoSize={{ minRows: 3, maxRows: 3 }}
                            />
                            <Button disabled={!isAble || !inputValue}
                                icon={isAble ? <SendOutlined style={{ fontSize: '20px' }} /> : <LoadingOutlined style={{ fontSize: '20px' }} />}
                                className='send-button' type="primary" onClick={onSendMsg}>发送
                            </Button>
                        </Space>
                    </div>
                </Card>
            }
        </>
    )

}

export default AiReboot;