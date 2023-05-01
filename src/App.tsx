import React, { CSSProperties, useEffect } from 'react'
import { useState } from 'react'
import './App.css'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Checkbox } from '@mui/material';


interface ToDoItem {
  id: number,
  name: string,
  isComplete: boolean
}

/* var dataObject: ToDoItem = {
  id: 0,
  name: "Feed Dracula",
  isComplete: false
} */

function LeftPositionedTimeline(props: ToDoItem) {
  const [checked, setChecked] = useState(props.isComplete)
  const [disabled, setDisabled] = useState(false);
  const [style, setStyle] = useState<CSSProperties>();

  useEffect(() => {
    if (checked) {
      setStyle({ textDecorationLine: 'line-through', textDecorationStyle: 'solid' })
    }
    else {
      setStyle(undefined);
    }
  }, [checked]);

  async function PutValues() {
    const originalValue = checked;
    setDisabled(true);
    //Change state and create a new ToDoItem
    setChecked(!originalValue);

    var updatedItem = {
      ...props,
      isComplete: !originalValue
    }

    try {
      const response = await fetch(`https://localhost:7129/api/TodoItems/${props.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      })
    }
    catch {
      setChecked(originalValue);
    }
    setDisabled(false);
  }
  return (
    <>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent style={style}>{props.name}</TimelineContent>
        <Checkbox {...TimelineContent} checked={checked} disabled={disabled} color="success" onChange={() => PutValues()} />
      </TimelineItem>
    </>
  );
}

function App() {
  const [idData, setIdData] = useState(1);
  const [data, setData] = useState([] as ToDoItem[]);
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    GetValues()
  }, []);

  async function GetValues() {
    const dataFetched = await fetch("https://localhost:7129/api/TodoItems");
    const dataToGet = await dataFetched.json() as ToDoItem[];
    setData(dataToGet);
    setIdData(dataToGet[0].id);
  }

  async function postValues(itemText: string) {
    const blah = {
      id: 0,
      name:itemText,
      isComplete:false
    } as ToDoItem

    const response = await fetch("https://localhost:7129/api/TodoItems", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blah),
    });
    GetValues();
  }

  async function deleteValues(id: number) {
    const response = await fetch(`https://localhost:7129/api/TodoItems/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    });
    GetValues();
  }

  return (
    <>
      <Timeline position="left">
        {
          data.map((item) => <div>{<LeftPositionedTimeline name={item.name} isComplete={item.isComplete} id={item.id} />}</div>)
        }
      </Timeline>
     {/*  <button onClick={() => postValues(dataObject)}>
        Click me
      </button> */}
      <button onClick={() => deleteValues(idData)}>I will delete something {idData}</button>
      <label>
        Text input: <input name="myInput"  onChange={(e)=> setFirstName(e.target.value)} />
      </label>
      <button onClick={()=>postValues(firstName)}>Submit your input!</button>
    </>
  )
}

export default App
