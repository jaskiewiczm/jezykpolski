import React from "react"

import { LineChart, PieChart } from 'react-chartkick'
import 'chart.js'

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'

import "./UserReportComparison.scss"


export default class UserReportComparison extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      classGrades: null,
      userGrades: null      
    }
    this.calculateFinalGradesDistribution()    
  }

  calculateFinalGradesDistribution = () => {
    var that = this
    fetch('/calculate_final_grades_distribution', {
      method: 'POST',
      body: JSON.stringify({klassId: that.props.klass.id, userId: that.props.user.id}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      if (response.status == 200) {
        return response.json()
      }
      return null
    }).then((response)=>{
      if (response != null) {
        that.setState({
          classGrades: response.class_grades,
          userGrades: response.user_grades
        })
      }
    })
  }

  renderUserGrade = (activityId) => {
    if (this.state.userGrades != null && activityId in this.state.userGrades) {
      return <div className='comparisonGrade'><Badge variant='info'>{this.state.userGrades[activityId].letter_value}</Badge></div>
    }

    return ''
  }

  renderClassGrade = (activityId) => {
    if (this.state.classGrades != null && activityId in this.state.classGrades) {
      return <div className='comparisonGrade'><Badge variant='light'>{this.state.classGrades[activityId]}</Badge></div>
    }

    return ''
  }

  render() {
    var that = this

    var activityTypes = []
    if (this.props.activityTypes) {
      activityTypes = this.props.activityTypes
    }    

    return (
      <Table>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Your Average</th>
            <th>Class Average</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          {activityTypes.map(function(at){
            return (<tr key={at.activity_id}>
                      <td>{at.activity_name}</td>
                      <td>{that.renderUserGrade(at.activity_id)}</td>
                      <td>{that.renderClassGrade(at.activity_id)}</td>
                      <td>{at.percentage}%</td>
                    </tr>)
          })}
        </tbody>
      </Table>
    )
  }
}
