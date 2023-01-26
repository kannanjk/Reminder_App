import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import axios from 'axios'
import DateTimePicker from 'react-datetime-picker'
import './index.css'

function App() {
  const [reminderMsg, setREminderMsg] = useState('')
  const [remindAt, setREmindAt] = useState()
  const [reminderList, setreminderList] = useState([])

  useEffect(() => {
    axios.get("http://localhost:4000/getAllReminder").then(res => setreminderList(res.data))
  }, [])

  const addREminder = () => {
    axios.post("http://localhost:4000/addReminder", { reminderMsg, remindAt })
      .then(res => setreminderList(res.data))
    setREminderMsg('')
    setREmindAt()
  }
  const deleteReminder = (id) => {
    axios.post("http://localhost:4000/deleteReminder", { id })
    .then(res => setreminderList(res.data))
  }
  return (
    <div className="App">
      {console.log(reminderList)}
      <div className="homepage">

        <div className="homepage_header">
          <h1>Remind Me 😎</h1>
          <input type="text" value={reminderMsg} onChange={e => setREminderMsg(e.target.value)} placeholder='Reminder note here...' />
          <DateTimePicker
            value={remindAt}
            onChange={setREmindAt}
            minDate={new Date()}
            minutePlaceholder='mm'
            hourPlaceholder="hh"
            dayPlaceholder="dd"
            monthPlaceholder="MM"
            yearPlaceholder="YYYY"
          />
          <div className="button" onClick={addREminder}>Add Reminder</div>
        </div>
        <div className="homepage_body">
          {
            reminderList.map(reminder => (
              <div className="reminder_card" key={reminder._id}>
                <h2>{reminder.reminderMsg}</h2>
                <h3>Remind Me at:</h3>
                <p>{String( new Date(reminder.remindAt))}</p>
                <div className="button" onClick={()=> deleteReminder(reminder._id)}>Delete</div>
              </div>
            ))
          }

        </div>
      </div>
    </div>
  );
}



ReactDom.render(<App />, document.getElementById("root"));
