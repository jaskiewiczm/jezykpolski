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

    var displayGrade = 'N/A'
    if (this.props.earnedGrade != null) {
      var gsgId = this.props.earnedGrade.grading_scale_grade_id
      displayGrade = this.props.gradingScale.find((element) => {return element.id == gsgId})
    }

    this.state = {
      displayGrade: displayGrade
    }
  }

  gradePopover = () => {
    var that = this
    return (<Popover id="popover-basic">
        <Popover.Content>
          <ListGroup>
            {this.props.gradingScale.map(function(key, index){
              return <ListGroup.Item action key={index} >{key.name}</ListGroup.Item>
            })}
          </ListGroup>
        </Popover.Content>
      </Popover>)
  }

  render() {
    return (
      <div className='grade'>
        <OverlayTrigger trigger="click" placement="left" overlay={this.gradePopover()}>
          <Button variant="success">{this.state.displayGrade}</Button>
        </OverlayTrigger>
      </div>
    )
  }
}
