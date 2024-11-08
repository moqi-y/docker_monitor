import {useState} from "react";
import {Button, Modal} from "antd";

function Logs(props: any) {
    const handleCancel = () => {
        props.handleCancel();
    };
    return (
        <>
            <Modal title={ `[${props.containerName}]日志`} width={1200} open={props.isShowLog}
                   onCancel={() => handleCancel()} okButtonProps={{style: {display: 'none'}}}>
                <pre style={{
                    backgroundColor: 'black',
                    color: 'white',
                    maxHeight: '600px',
                    overflow: 'auto',
                }}>{props.logText}</pre>
            </Modal>
        </>
    );
}

export default Logs