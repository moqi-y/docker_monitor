import { useState } from 'react';
import { Button, Card, FloatButton, Input, Space } from 'antd';
import { CloseOutlined, CommentOutlined, LoadingOutlined, SendOutlined } from '@ant-design/icons';
import './AiReboot.css'
import ChatBox from './ChatBox';
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
        pushMessage(inputValue);
        setInputValue('');
        setTimeout(() => {
            setIsAble(true);
        }, 1000);
    }

    const [chatList, setChatList] = useState<any>([
        { message: '你好，我是AI助手，有什么可以帮助你的吗？', sender: 'AI', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' },
        { message: '你好，我想了解一下关于你的信息', sender: 'User', avatar: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.bUW2KSLDmuJtIbm7aLB1TwAAAA?rs=1&pid=ImgDetMain' },
        { message: '我是一个AI助手，可以回答你的问题', sender: 'AI', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' },
        { message: '那你能帮我写一篇关于人工智能的文章吗？', sender: 'User', avatar: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.bUW2KSLDmuJtIbm7aLB1TwAAAA?rs=1&pid=ImgDetMain' },
        { message: '当然可以，请告诉我你的需求', sender: 'AI', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' },
        { message: '我想写一篇关于人工智能的发展历程和未来展望的文章', sender: 'User', avatar: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.bUW2KSLDmuJtIbm7aLB1TwAAAA?rs=1&pid=ImgDetMain' },
        {
            message: `写一篇关于人工智能（AI）的发展历程和未来展望的文章是一个很好的主题，因为它不仅涵盖了技术的进步，还涉及到社会、经济和伦理等多个方面。以下是一篇这样的文章的大纲和一些内容提示，你可以根据这些提示来撰写你的文章。

### 标题：人工智能：从过去到未来

#### 引言
- 简要介绍人工智能的定义和它在当今社会中的重要性。
- 提出文章的主旨：探索人工智能的发展历程和对未来的展望。

#### 第一部分：人工智能的起源和早期发展
- 描述人工智能的起源，包括早期的思考者和理论家，如图灵、麦卡锡等。
- 讨论早期的AI项目，如达特茅斯会议和早期的专家系统。

#### 第二部分：人工智能的黄金时代和冬天
- 描述20世纪70-80年代AI的快速发展，包括专业知识系统的兴起。
- 讨论AI的“冬天”，即资金和兴趣的减少，以及这些时期对AI发展的影响。

#### 第三部分：机器学习和大数据的兴起
- 描述90年代以来互联网的兴起如何为AI提供了新的数据源和应用场景。
- 讨论机器学习，特别是深度学习，如何成为AI发展的核心。

#### 第四部分：人工智能的现代应用
- 描述当前AI技术的一些关键应用，如自动驾驶汽车、语音助手、推荐系统等。
- 讨论AI在医疗、金融、教育等领域的应用。

#### 第五部分：人工智能的伦理和社会影响
- 探讨AI带来的伦理问题，如隐私、偏见和就业。
- 讨论AI对社会结构和劳动力市场的潜在影响。

#### 第六部分：人工智能的未来展望
- 描述一些预测中的AI技术，如通用人工智能（AGI）和神经形态计算。
- 讨论AI如何可能改变我们的工作和生活方式。

#### 第七部分：结论
- 总结人工智能的发展历程和未来展望。
- 强调持续的研究和负责任的AI发展的重要性。

### 写作提示：
- **历史研究**：深入研究AI的历史，包括关键的里程碑和转折点。
- **技术细节**：解释AI的关键技术，如机器学习和神经网络，但保持语言通俗易懂。
- **案例研究**：提供一些成功的AI应用案例，以及它们如何影响我们的生活。
- **专家观点**：引用AI领域的专家和思想领袖的观点和预测。
- **社会影响**：讨论AI如何影响社会，包括正面和负面的影响。
- **未来预测**：基于当前的趋势和技术发展，预测AI的未来方向。

### 结语：
撰写这样的文章需要广泛的研究和对AI领域的深刻理解。确保你的信息来源是可靠的，并且你的文章能够平衡技术细节和社会影响。希望这个大纲能够帮助你开始写作，并激发你对人工智能未来发展的思考。
`,
            sender: 'AI', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
        },
    ]);

    const chat = chatList.map((item: any, index: number) => {
        return (<ChatBox position={index % 2 === 0 ? 'left' : 'right'} key={index} message={item.message} sender={item.sender} avatar={item.avatar} />)
    })


    const pushMessage = (msg: string) => {
        setChatList([...chatList, {
            message: msg,
            sender: 'User',
            avatar: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.bUW2KSLDmuJtIbm7aLB1TwAAAA?rs=1&pid=ImgDetMain'
        }])
        //class为chat-content的滚动条滚动到底部
        scrollToBottomSmooth();
    }

    function scrollToBottomSmooth() {
        const chatContent = document.getElementById('chat-con');
        if (chatContent) {
            chatContent.scrollTo({
                top: chatContent.scrollHeight,
                behavior: 'smooth'
            }); // 丝滑滚动条滚动到底部
        }
    }

    return (
        <>
            <div>
                <FloatButton icon={<CommentOutlined />} type="primary" className='box' onClick={onClick} />
            </div>
            {isShow &&
                <Card title={<span style={{ color: '#1677ff' }}>AI 智能小助手</span>} extra={<a onClick={onClick}><CloseOutlined /></a>} className='chat-box'>
                    <div className='chat-content' id='chat-con'>
                        {chat}
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