import './ChatBox.css'
import MyMarkdown from './MyMarkdown';

interface Props {
    position: string; // "left" or "right"
    message: string; // The message to be displayed
    sender: string|null; // The name of the sender
    avatar: string; // The URL of the sender's avatar
}

function ChatBox(props: Props) {
    return (
        <div className={`flex items-${props.sender == 'AI'?'left':'right'} gap-2`}>
            {props.sender == 'AI' && <div className="flex items-center gap-2">
                <img className="avatar-img" src={props.avatar} alt="Avatar" />
            </div>}
            <div className="flex message-box">
                <MyMarkdown markdownContent={props.message} />
            </div>
            {props.sender == 'User' && <div className="flex items-center gap-2">
                <img className="avatar-img" src={props.avatar} alt="Avatar" />
            </div>}
        </div>
    )
}

export default ChatBox