import MyTerminal from "@/components/MyTerminal";
import { useState } from "react";

function RemoteContainer() {

    const [isShowTerminal, setIsShowTerminal] = useState(true)
    const [terminalName, setTerminalName] = useState('测试')
    const showTerminal = (e: any) => {
        setTerminalName(e.container_name)
        setIsShowTerminal(true);
    }
    const handleTerminalCancel = () => {
        setIsShowTerminal(false);
    }

    return (
        <div className="container">
            <h1>Remote Container</h1>
            <MyTerminal isShowTerminal={isShowTerminal} terminalName={"10.13.6.47"} info={{ip:"10.13.6.47",password:"Yuy@123", username:"root"}} handleTerminalCancel={handleTerminalCancel} type={2} />
        </div>
    )
}

export default RemoteContainer