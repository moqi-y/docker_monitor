import Terminal from 'terminal-in-react';
import { Button, Modal } from "antd";
import {useState,useEffect} from 'react';
import './MyTerminal.css'
import { sendCommand } from '@/api/container';
import {resetPath} from '@/api/myTerminalApi'
import {sendSSH} from '@/api/remoteServer';
function MyTerminal(props: any) {
  const showMsg = () => 'Hello World';

  const handleCancel = () => {
    props.handleTerminalCancel();
  };

  useEffect(() => {
    props.type == 1 && resetPath();
  }, [props.isShowTerminal])

  return (
    <Modal title={`[${props.terminalName}]终端`} width={650} height={850} open={props.isShowTerminal} className='model'
      onCancel={() => handleCancel()} cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ style: { display: 'none' } }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "620px"
        }}
      >
        <Terminal
          color='white'
          backgroundColor='black'
          barColor='black'
          allowTabs={false}
          style={{ fontWeight: "normal", fontSize: "1.1em"}}
          commands={{
            showmsg: showMsg,
            popup: () => alert('Terminal in React')
          }}
          commandPassThrough={(cmd, print) => {            
            let tempCmd = ""
            cmd.forEach(element => {
              tempCmd += element + " "
            });
            props.type == 1 && sendCommand({containerName: props.terminalName, command: [tempCmd]}).then((res:any) => {
              console.log(res);
              print(`${res.output}`);
            })
            props.type == 2 && sendSSH({...props.info,command:tempCmd}).then((res:any) => {
              console.log(res);
              print(`${res?.data?.output}`);
            })
          }}
          msg="You are in the terminal"
        />
      </div>
    </Modal>
  );
}

export default MyTerminal;