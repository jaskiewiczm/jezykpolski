import React from "react"

import { LineChart, PieChart } from 'react-chartkick'
import 'chart.js'

import Container from 'react-bootstrap/Container'

import "./UserReport.scss"


export default class UserReport extends React.Component {

  constructor(props) {
    super(props)

    this.getUsers()

    this.state = {
      userData: null
    }
  }

  getUsers = () => {
    var that = this
    fetch('/get_user_report', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      return response.json()
    }).then((response)=>{
      that.setState({
        userData: response
      })
    })
  }

  getKlassChartData = (klass) => {
    var data = [{'name': 'Grades', 'data': null}]

    var dataObj = {}
    klass.homeworks.forEach(function(homework){
      dataObj[homework.due_date] = '+' + homework.grade
    })

    data[0]['data'] = dataObj

    return data
  }

  render() {
    var that = this

    var body = (<div />)
    if (this.state.userData != null) {
      body = (<div>
                {this.state.userData.map(function(klass){
                  return <LineChart key={klass.id} data={that.getKlassChartData(klass)} download={true}/>
                })}
              </div>)
    }

    return (
      <div>
        <br />
        <Container className='userReport'>
          {body}
        </Container>
      </div>
    )
  }
}
