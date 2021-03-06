import "bootstrap/dist/css/bootstrap.css"
import {Button, Container, Row, Col} from "react-bootstrap"
import React, {useState} from "react"
import "rc-dock/dist/rc-dock.css"
import {useIntervalStateImmediate} from "./Utils"
import {axiosInstance} from "./Common";

interface SessionInfo {
  name: string;
  ip: string;
  pid: number;
  machine_name: string;
  epoch: number;
  description: string;
}

function SessionListArgument(prop: { info: SessionInfo, onSelect: () => void }) {
  function AlignedLabel(prop: { tag: string, content: string }) {
    return <Row>
      <Col className={"text-start"}>{prop.tag}</Col>
      <Col className={"text-end"}>{prop.content}</Col>
    </Row>;
  }

  return <Button className={"bg-secondary w-100 p-2 mb-1"} style={{fontFamily: "Lucida Console"}}
                 onClick={prop.onSelect}>
    <Col className="badge w-100 bg-primary align-self-center fw-bold" style={{fontSize: "1.25em"}}>
      {prop.info.name}
    </Col>
    <Container>
      <AlignedLabel tag={"IP"} content={prop.info.ip}/>
      <AlignedLabel tag={"PID"} content={prop.info.pid.toString()}/>
      <AlignedLabel tag={"EPOCH"} content={(new Date(prop.info.epoch)).toLocaleString()}/>
    </Container>
  </Button>;
}


export function SessionListPanel(prop: { url: string, onSelect: (id: string) => void }) {
  const [sessionList, setSessionList] = useState([]);

  const fetchSession = () => {
    axiosInstance.get( "sessions").then(
      (obj) => {
        const sessions: { [key: string]: SessionInfo } = obj.data['sessions'];
        let sessList: any = [];

        for (const key in sessions) {
          sessList.push(
            <SessionListArgument
              info={sessions[key]}
              key={key}
              onSelect={() => prop.onSelect(key)}/>);
        }
        console.log(`${sessList.length} session${sessList.length > 1 ? "s" : ""} detected`);

        setSessionList(sessList);
      }
    ).catch((err) => {
      console.log(`${err}: ${JSON.stringify(err)}`);
    })
  };

  useIntervalStateImmediate(fetchSession, 3000);

  return <div className={"overflow-auto"}>
    <div>.</div>
    <Container>
      {sessionList === [] ? "no sessions available" : sessionList}
    </Container>
  </div>
}
