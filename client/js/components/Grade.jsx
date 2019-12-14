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
    var that = this
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
        if (this.props.earnedGrade != null) {
          this.props.earnedGrade.email = 'pending'
        }
        response.grade.email = 'pending'
        this.overlay.hide()
        this.setState({
          displayGrade: gradingScaleGradeObj.name,
          earnedGrade: response.grade
        })
        that.props.gradeSetCallback()
      }
    })
  }

  getGradeRows = () => {
    var clone = this.props.gradingScale.slice(0)
    var rows = []
    var currentRow = {colspan: 0, cells: []}
    var currentGroup = clone[0].group
    var widestRowLength = 0

    for (var i=0; i<clone.length; i+=1) {
      if (currentGroup != clone[i].group) {
        rows.push(currentRow)
        currentRow = {colspan: 0, cells: []}
        currentGroup = clone[i].group
      }

      currentRow.cells.push(clone[i])

      if (currentRow.cells.length > widestRowLength) {
        widestRowLength = currentRow.cells.length
      }
    }
    rows.push(currentRow)

    for (var j=0; j<rows.length; j++) {
      var row = rows[j]
      row.colspan = Math.floor(widestRowLength / row.cells.length)
    }

    return rows
  }

  gradePopover = (userId, homeworkId) => {
    var that = this
    var rows = this.getGradeRows()
    return (<Popover id="popover-basic">
        <Popover.Content>
          <Table>
            <tbody>
              {rows.map(function(row, rowIndex){
                return (
                  <tr key={rowIndex}>
                    {row.cells.map(function(cell, cellIndex){
                      return <td key={cellIndex} align='center' colSpan={row.colspan} className='gradeSelect' onClick={() => {that.saveGrade(cell, that.props.userId, that.props.homeworkId)}}>{cell.name}</td>
                    })}
                  </tr>)
              })}
            </tbody>
          </Table>
        </Popover.Content>
      </Popover>)
  }

  render() {
    var variant = this.state == null ? 'light' : (this.state.displayGrade == 'N/A' ? 'light' : 'success')
    var star = null
    if (this.state.earnedGrade != null && this.state.earnedGrade.email == 'pending') {
      star = '<span>*</span>'
    }
    return (
      <div className='grade'>
        <div className='overlayTriggerWrapper'>
          <OverlayTrigger trigger="click" placement="bottom" overlay={this.gradePopover()} ref={(ref) => this.overlay = ref}>
            <Button variant={variant}>{this.state.displayGrade}</Button>
          </OverlayTrigger>
          &nbsp;
        </div>
        <div className='pendingEmailMarker' dangerouslySetInnerHTML={{__html: star}}></div>
      </div>
    )
  }
}
