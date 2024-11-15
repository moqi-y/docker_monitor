import Terminal from 'terminal-in-react';
import { Button, Modal } from "antd";
import {useState,useEffect} from 'react';
import './MyTerminal.css'
import { sendCommand } from '@/api/container';
import {resetPath} from '@/api/myTerminalApi'
function MyTerminal(props: any) {
  const showMsg = () => 'Hello World';

  const handleCancel = () => {
    props.handleTerminalCancel();
  };

  useEffect(() => {
    resetPath();
  }, [props.isShowTerminal])

  return (
    <Modal title={`[${props.containerName}]终端`} width={650} height={850} open={props.isShowTerminal} className='model'
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
            'open-google': () => window.open('https://www.google.com/', '_blank'),
            showmsg: showMsg,
            popup: () => alert('Terminal in React')
          }}
          commandPassThrough={(cmd, print) => {            
            let tempCmd = ""
            cmd.forEach(element => {
              console.log("element",element);
              tempCmd += element + " "
            });
            sendCommand({containerName: props.containerName, command: [tempCmd]}).then((res:any) => {
              console.log(res);
              print(`${res.output}`);
            })
            
          }}
          msg="You are in the terminal"
        />
      </div>
    </Modal>
  );
}

export default MyTerminal;