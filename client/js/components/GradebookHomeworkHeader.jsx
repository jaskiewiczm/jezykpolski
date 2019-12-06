import React from "react"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'

import $ from 'jquery'

import HomeworkEmailModal from './HomeworkEmailModal.jsx'

import {grade} from './GradebookHomeworkHeader.scss'


export default class GradebookHomeworkHeader extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      displayHomeworkEmailModal: false
    }

    this.ref = React.createRef();
  }

  displayHomeworkEmailModal = () => {
    this.setState({
      displayHomeworkEmailModal: true
    })
  }

  displayHomeworkEmailModalCallback = () => {
    this.setState({
      displayHomeworkEmailModal: false
    })
  }

  setHover = (hovered) => {
    if (hovered) {
      $(this.ref.current).parent().addClass('gradebookHomeworkHeaderParentHover')
    } else {
      $(this.ref.current).parent().removeClass('gradebookHomeworkHeaderParentHover')
    }
  }

  render() {
    var modal = null
    if (this.state.displayHomeworkEmailModal) {
      modal = <HomeworkEmailModal callback={this.displayHomeworkEmailModalCallback}/>
    }

    return (
      <div ref={this.ref} className='gradebookHomeworkHeader' onClick={this.displayHomeworkEmailModal} onMouseEnter={() => this.setHover(true)} onMouseLeave={() => this.setHover(false)}>
        <div>{this.props.homework.due_date}</div>
        <div>{this.props.homework.title}</div>
        {modal}
      </div>
    )
  }
}
