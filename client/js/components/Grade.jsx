import React from "react"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'

import {grade} from './Grade.scss'


export default class Grade extends React.Component {

  constructor(props) {
    super(props)
    // props userId, homeworkId, earnedGrade, gradingScale

    if (this.props.earnedGrade != null) {
      var gsgId = this.props.earnedGrade.grading_scale_grade_id
      var displayGrade = this.props.gradingScale.find((element) => {return element.id == gsgId})

      this.state = {
        displayGrade: displayGrade.name,
        earnedGrade: this.props.earnedGrade
      }
    } else {
      this.state = {
        displayGrade: 'N/A',
        earnedGrade: this.props.earnedGrade
      }
    }


  }

  saveGrade = (gradingScaleGradeObj, userId, homeworkId) => {
    var earnedGradeId = null
    if (this.state.earnedGrade != null) {
      earnedGradeId = this.state.earnedGrade.id
    }
    fetch('/set_grade', {
      method: 'POST',
      body: JSON.stringify({earnedGradeId: earnedGradeId, userId: userId, homeworkId: homeworkId, gradingScaleGradeId: gradingScaleGradeObj.id}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      if (response.status == 200) {
        return response.json()
      }
      return null
    }).then((response) => {
      if (response != null) {
        this.overlay.hide()
        this.setState({
          displayGrade: gradingScaleGradeObj.name,
          earnedGrade: response.grade
        })
      }
    })
  }

  gradePopover = (userId, homeworkId) => {
    var that = this
    return (<Popover id="popover-basic">
        <Popover.Content>
          <ListGroup>
            {this.props.gradingScale.map(function(gradingScaleGradeObj, index){
              return <ListGroup.Item
                      action key={index}
                      onClick={() => {that.saveGrade(gradingScaleGradeObj, that.props.userId, that.props.homeworkId)}}>{gradingScaleGradeObj.name}</ListGroup.Item>
            })}
          </ListGroup>
        </Popover.Content>
      </Popover>)
  }

  render() {
    var variant = this.state == null ? 'light' : (this.state.displayGrade == 'N/A' ? 'light' : 'success')
    return (
      <div className='grade'>
        <OverlayTrigger trigger="click" placement="left" overlay={this.gradePopover()} ref={(ref) => this.overlay = ref}>
          <Button variant={variant}>{this.state.displayGrade}</Button>
        </OverlayTrigger>
      </div>
    )
  }
}