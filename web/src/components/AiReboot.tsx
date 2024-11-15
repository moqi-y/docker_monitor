// src/components/AiReboot.tsx
import { useState, useCallback, useEffect, useRef } from 'react';
import { Button, Card, FloatButton, Input, Space } from 'antd';
import { CloseOutlined, CommentOutlined, LoadingOutlined, SendOutlined } from '@ant-design/icons';
import chatService from '@/api/aiChat';
import './AiReboot.css';
import ChatBox from './ChatBox';

const { TextArea } = Input;
const AI_AVATAR = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
const USER_AVATAR = 'https://tse3-mm.cn.bing.net/th/id/OIP-C.bUW2KSLDmuJtIbm7aLB1TwAAAA?rs=1&pid=ImgDetMain';

interface Message {
    message: string;
    sender: 'AI' | 'User';
    avatar: string;
}

const INITIAL_MESSAGES: Message[] = [
    {
        message: '你好，我是AI助手，有什么可以帮助你的吗？',
        sender: 'AI',
        avatar: AI_AVATAR
    }
];



function AiReboot() {
    const [isShow, setIsShow] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatList, setChatList] = useState<Message[]>(INITIAL_MESSAGES);

    const chatContentRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const scrollToBottom = useCallback(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTo({
                top: chatContentRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [chatList, scrollToBottom]);

    const toggleChat = useCallback(() => {
        setIsShow(prev => !prev);
    }, []);

    const handleAIResponse = useCallback(async (userMsg: string) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        // Add initial AI message placeholder
        setChatList(prev => [...prev, {
            message: '',
            sender: 'AI',
            avatar: AI_AVATAR
        }]);

        const response = await chatService.streamChat(
            (accumulatedResponse: any) => {
                setChatList(prev => {
                    const newList = [...prev];
                    newList[newList.length - 1] = {
                        message: accumulatedResponse,
                        sender: 'AI',
                        avatar: AI_AVATAR
                    };
                    return newList;
                });
            },
            abortControllerRef.current,
            userMsg
        );
        setInputValue('');
        if (!response?.success) {
            // Handle error
        }
    }, []);

    const handleSendMessage = useCallback(async () => {
        if (!inputValue.trim() || isLoading) return;

        setIsLoading(true);

        setChatList(prev => [...prev, {
            message: inputValue,
            sender: 'User',
            avatar: USER_AVATAR
        }]);

        try {
            await handleAIResponse(inputValue);
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, isLoading, handleAIResponse]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    return (
        <>
            <div>
                <FloatButton
                    icon={<CommentOutlined />}
                    type="primary"
                    className='box'
                    onClick={toggleChat}
                />
            </div>
            {isShow && (
                <Card
                    title={<span style={{ color: '#1677ff' }}>AI 智能小助手</span>}
                    extra={<a onClick={toggleChat}><CloseOutlined /></a>}
                    className='chat-box'
                >
                    <div className='chat-content' ref={chatContentRef}>
                        {chatList.map((item, index) => (
                            <ChatBox
                                key={`${index}-${item.message?.length}`}
                                position={item?.sender === 'AI' ? 'left' : 'right'}
                                message={item?.message}
                                sender={item?.sender}
                                avatar={item?.avatar}
                            />
                        ))}
                    </div>
                    <div className='chat-input'>
                        <Space direction="horizontal" align="center">
                            <TextArea
                                className='input-box'
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="请输入您的问题"
                                autoSize={{ minRows: 3, maxRows: 3 }}
                                disabled={isLoading}
                            />
                            <Button
                                disabled={isLoading || !inputValue.trim()}
                                icon={isLoading ?
                                    <LoadingOutlined style={{ fontSize: '20px' }} /> :
                                    <SendOutlined style={{ fontSize: '20px' }} />
                                }
                                className='send-button'
                                type="primary"
                                onClick={handleSendMessage}
                            >
                                发送
                            </Button>
                        </Space>
                    </div>
                </Card>
            )}
        </>
    );
}

export default AiReboot;