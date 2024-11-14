import { useState, useCallback, useEffect, useRef } from 'react';
import { Button, Card, FloatButton, Input, Space } from 'antd';
import { CloseOutlined, CommentOutlined, LoadingOutlined, SendOutlined } from '@ant-design/icons';
import './AiReboot.css';
import ChatBox from './ChatBox';

const { TextArea } = Input;

// Define TypeScript interfaces
interface Message {
    message: string;
    sender: 'AI' | 'User';
    avatar: string;
}

const INITIAL_MESSAGES: Message[] = [
    { 
        message: '你好，我是AI助手，有什么可以帮助你的吗？', 
        sender: 'AI', 
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' 
    },
    { 
        message: '你好，我想了解一下关于你的信息', 
        sender: 'User', 
        avatar: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.bUW2KSLDmuJtIbm7aLB1TwAAAA?rs=1&pid=ImgDetMain' 
    },
    { 
        message: '我是一个AI助手，可以回答你的问题', 
        sender: 'AI', 
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' 
    },
    { 
        message: '那你能帮我写一篇关于人工智能的文章吗？', 
        sender: 'User', 
        avatar: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.bUW2KSLDmuJtIbm7aLB1TwAAAA?rs=1&pid=ImgDetMain' 
    },
    { 
        message: '当然可以，请告诉我你的需求', 
        sender: 'AI', 
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' 
    }
];

const AI_AVATAR = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
const USER_AVATAR = 'https://tse3-mm.cn.bing.net/th/id/OIP-C.bUW2KSLDmuJtIbm7aLB1TwAAAA?rs=1&pid=ImgDetMain';

function AiReboot(props: any) {
    const [isShow, setIsShow] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatList, setChatList] = useState<Message[]>(INITIAL_MESSAGES);
    
    const chatContentRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
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

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [chatList, scrollToBottom]);

    const toggleChat = useCallback(() => {
        setIsShow(prev => !prev);
    }, []);

    const getAIResponse = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        
        try {
            const response = await fetch('http://localhost:8000/api/stream-chat', {
                signal: abortControllerRef.current.signal
            });

            if (!response.body) {
                throw new Error('Response body is not a stream');
            }

            const reader = response.body.getReader();
            let accumulatedResponse = '';

            // Add initial AI message placeholder
            setChatList(prev => [...prev, {
                message: '...',
                sender: 'AI',
                avatar: AI_AVATAR
            }]);

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                const chunk = new TextDecoder().decode(value, { stream: true });
                accumulatedResponse += chunk;

                // Update the last message in real-time
                setChatList(prev => {
                    const newList = [...prev];
                    newList[newList.length - 1] = {
                        message: accumulatedResponse,
                        sender: 'AI',
                        avatar: AI_AVATAR
                    };
                    return newList;
                });
            }

            return accumulatedResponse;
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('Request aborted');
            } else {
                console.error('Error fetching AI response:', error);
                setChatList(prev => [...prev, {
                    message: '抱歉，我现在无法回答。请稍后再试。',
                    sender: 'AI',
                    avatar: AI_AVATAR
                }]);
            }
        }
    }, []);

    const handleSendMessage = useCallback(async () => {
        if (!inputValue.trim() || isLoading) return;

        setIsLoading(true);
        
        // Add user message
        setChatList(prev => [...prev, {
            message: inputValue,
            sender: 'User',
            avatar: USER_AVATAR
        }]);
        
        setInputValue('');

        try {
            await getAIResponse();
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, isLoading, getAIResponse]);

    // Handle Enter key press
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
                    <div className='chat-content' id='chat-con' ref={chatContentRef}>
                        {chatList.map((item, index) => (
                            <ChatBox
                                key={`${index}-${item.message.length}`}
                                position={item.sender === 'AI' ? 'left' : 'right'}
                                message={item.message}
                                sender={item.sender}
                                avatar={item.avatar}
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