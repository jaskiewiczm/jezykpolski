import React from "react"

import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import styles from './Homeworks.scss'


export default class HomeworkEmailModal extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      show: true
    }
  }

  handleClose = () => {
    this.setState({
      show: false
    })

    this.props.callback()
  }

  handleSave = () => {
    this.setState({
      show: false
    })

    this.props.callback()
  }

  render() {
    var that = this

    return (
      <Modal show={this.state.show}>
        <Modal.Header>
          <Modal.Title>Send Grades?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Would you like to release grades to parents and students via email?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={this.handleSave}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
