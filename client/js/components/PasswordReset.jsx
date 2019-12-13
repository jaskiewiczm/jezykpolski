import React from "react"

import Enrollment from './Enrollment.jsx'
import UserSearch from './UserSearch.jsx'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'


import "./HomeworkEditor.scss"

export default class PasswordReset extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      show: true,
      oldPassword: null,
      newPassword: null,
      passwordConfirmation: null
    }
  }

  handleClose = () => {
    this.setState({
      show: false
    })

    this.props.callback()
  }

  handleSave = () => {
    var that = this

    fetch('/password_reset', {
      method: 'POST',
      body: JSON.stringify({oldPassword: this.state.oldPassword, newPassword: this.state.newPassword, passwordConfirmation: this.state.passwordConfirmation}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response) => {
      if (response.status == 200) {
        this.props.callback()

        that.setState({
          show: false
        })
      } else if (response.status == 403) {

      }
      return null
    })
  }

  oldPasswordChanged = (evt) => {
    this.setState({
      oldPassword: evt.currentTarget.value
    })
  }

  newPasswordChanged = (evt) => {
    this.setState({
      newPassword: evt.currentTarget.value
    })
  }

  passwordConfirmationChanged = (evt) => {
    this.setState({
      passwordConfirmation: evt.currentTarget.value
    })
  }

  render() {
    var that = this

    var withConfirmation = null
    if (this.props.withConfirmation) {
      withConfirmation =  <Form.Group>
                            <Form.Label>Old Password</Form.Label>
                            <Form.Control type='password' value={this.state.oldPassword} onChange={this.oldPasswordChanged} />
                          </Form.Group>
    }

    return (
      <Modal show={this.state.show} size="lg">
        <Modal.Header>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {withConfirmation}
            <Form.Group>
              <Form.Label>New Password</Form.Label>
              <Form.Control type='password' value={this.state.newPassword} onChange={this.newPasswordChanged} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type='password' value={this.state.passwordConfirmation} onChange={this.passwordConfirmationChanged} />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
