import React from "react"

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'

import styles from './EarnedGradeHistory.scss'


export default class EarnedGradeHistory extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      history: null
    }

    this.getEarnedGradeHistory()
  }

  getEarnedGradeHistory = () => {
    var that = this
    fetch('/get_earned_grade_histories', {
      method: 'POST',
      body: JSON.stringify({earned_grade_id: this.props.earnedGrade.id}),
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
          history: response
        })
      }
    })
  }

  render() {
    var that = this

    if (this.state.history != null && this.state.history.length > 0) {
      return (
        <ListGroup>
          <ListGroup.Item variant="dark">Grade History</ListGroup.Item>
          {this.state.history.map(function(item){
            return  <ListGroup.Item>
                      <Row>
                        <Col xs={4} className='earnedGradeCreatedAt'>{item.created_at}</Col>
                        <Col xs={6} className='earnedGradeTeacher'>{item.teacher_name}</Col>
                        <Col xs={2} className='earnedGradeGrade'>{item.grade}</Col>
                      </Row>
                    </ListGroup.Item>
          })}
        </ListGroup>
      )
    } else {
      return (<ListGroup>
                <ListGroup.Item variant="dark">Grade History</ListGroup.Item>
                <ListGroup.Item variant="info">There is no grade history for this assignment.</ListGroup.Item>
              </ListGroup>)
    }
  }
}
