import React from "react"
import Table from 'react-bootstrap/Table'

import {readingLogContainer} from '../../scss/ReadingLog.scss'



export default class ReadingLog extends React.Component {

  constructor(props) {
    super(props)
    this.getReadingLogs = this.getReadingLogs.bind(this)

    this.state = {
      logs: []
    }
  }

  getReadingLogs() {
    data = {
      userId: 1
    }

    fetch('/getReadingLogs', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      return response.json()
    }).then((response)=>{
      this.setState({
        logs: response.logs
      })
    })
  }

  render() {
    return (
      <div>
        <Table>
          <thead>
            <th>Date</th>
            <th>Book</th>
            <th>Duration</th>
          </thead>
          {
            this.state.logs.map(function(log) {
              <tr key={log.id}>
                <td>{log.date}</td>
                <td><i>{log.book.title}</i></td>
                <td>{log.duration}</td>
              </tr>
            })
          }
        </Table>
      </div>
    )
  }
}
