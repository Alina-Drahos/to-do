import React, { useEffect } from 'react'
import { useState } from 'react'
import './App.css'


interface ToDoItem {
  id: number,
  name: string,
  isComplete: boolean
}

function App() {
  const [data, setData] = useState([] as ToDoItem[]);

  useEffect(() => {
    GetValues()
  }, []);

  async function GetValues() {
    const dataFetched = await fetch("https://localhost:7129/api/TodoItems");
    const dataToGet = await dataFetched.json() as ToDoItem[];

    setData(dataToGet);
  }

  return (
    <>
      {
        data.map((item) => {
          return (
            <div>{item.id}</div>
          )
        })
      }
    </>
  )
}

export default App
