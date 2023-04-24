import React, { useEffect } from 'react'
import { useState } from 'react'
import './App.css'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';


interface ToDoItem {
  id: number,
  name: string,
  isComplete: boolean
}

interface ButtonProps {
  id: number
}

var dataObject: ToDoItem ={
  id: 0,
  name: "Feed Dracula",
  isComplete : false
} 

function LeftPositionedTimeline(props: ButtonProps) {
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>{props.id}</TimelineContent>
    </TimelineItem>
  );
}

function App() {
  const [data, setData] = useState([] as ToDoItem[]);
  const [update,setUpdate] = useState(false);

  useEffect(() => {
    GetValues()
  }, [update]);

  async function GetValues() {
    const dataFetched  = await fetch("https://localhost:7129/api/TodoItems");
    const dataToGet = await dataFetched.json() as ToDoItem[];
    setData(dataToGet);
  }

  async function postValues(item:ToDoItem){
    const response = await fetch("https://localhost:7129/api/TodoItems", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    setUpdate(true);
  }

  return (

    <>
      <Timeline position="left">
        {
          data.map((item) => <div>{<LeftPositionedTimeline id={item.id} />}</div>)
        }
      </Timeline>
      <button onClick={()=>postValues(dataObject)}>
        Click me
      </button>
    </>
  )
}

export default App
