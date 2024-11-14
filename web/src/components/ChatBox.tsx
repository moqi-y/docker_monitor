import './ChatBox.css'

interface Props {
    position: string; // "left" or "right"
    message: string; // The message to be displayed
    sender: string|null; // The name of the sender
    avatar: string; // The URL of the sender's avatar
}

function ChatBox(props: Props) {
    return (
        <div className={`flex items-${props.position} gap-2`}>
            {props.position == 'left' && <div className="flex items-center gap-2">
                <img className="avatar-img" src={props.avatar} alt="Avatar" />
            </div>}
            <div className="flex message-box">
                <p className="text-sm">{props.message}</p>
            </div>
            {props.position == 'right' && <div className="flex items-center gap-2">
                <img className="avatar-img" src={props.avatar} alt="Avatar" />
            </div>}
        </div>
    )
}

export default ChatBox