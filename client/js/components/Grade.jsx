import React from "react"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Table from 'react-bootstrap/Table'

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

  getGradeRows = () => {
    var clone = this.props.gradingScale.slice(0)
    var rows = []

    for (var i=0; i<clone.length; i+=3) {
      rows.push([clone[i], clone[i+1], clone[i+2]])
    }

    return rows
  }

  gradePopover = (userId, homeworkId) => {
    var that = this
    var rows = this.getGradeRows()
    return (<Popover id="popover-basic">
        <Popover.Content>
          <Table>
            {rows.map(function(obj, index){
              return  <tr key={index}>
                        <td className='gradeSelect' onClick={() => {that.saveGrade(obj[0], that.props.userId, that.props.homeworkId)}}>{obj[0].name}</td>
                        <td className='gradeSelect' onClick={() => {that.saveGrade(obj[1], that.props.userId, that.props.homeworkId)}}>{obj[1].name}</td>
                        <td className='gradeSelect' onClick={() => {that.saveGrade(obj[2], that.props.userId, that.props.homeworkId)}}>{obj[2].name}</td>
                      </tr>
            })}
          </Table>
        </Popover.Content>
      </Popover>)
  }

  render() {
    var variant = this.state == null ? 'light' : (this.state.displayGrade == 'N/A' ? 'light' : 'success')
    return (
      <div className='grade'>
        <OverlayTrigger trigger="click" placement="bottom" overlay={this.gradePopover()} ref={(ref) => this.overlay = ref}>
          <Button variant={variant}>{this.state.displayGrade}</Button>
        </OverlayTrigger>
      </div>
    )
  }
}
