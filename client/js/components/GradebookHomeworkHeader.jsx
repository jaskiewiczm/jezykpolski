import React from "react"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'

import {grade} from './Grade.scss'


export default class GradebookHomeworkHeader extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div>{this.props.homework.due_date}</div>
        <div>{this.props.homework.title}</div>
      </div>
    )
  }
}
