import React from "react"

import Enrollment from './Enrollment.jsx'
import UserSearch from './UserSearch.jsx'

import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'

import {styles} from './UserSettings.scss'


import "./HomeworkEditor.scss"

export default class UserSettings extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      oldPassword: null,
      newPassword: null,
      passwordConfirmation: null,
      name: null
    }
  }

  save = () => {
    var that = this

    if (this.passwordError()) {
      fetch('/password_reset', {
        method: 'POST',
        body: JSON.stringify({oldPassword: this.state.oldPassword, newPassword: this.state.newPassword, passwordConfirmation: this.state.passwordConfirmation}),
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }).then((response) => {
        if (response.status == 200) {

        } else if (response.status == 403) {

        }
        return null
      })
    }
  }

  passwordError = () => {
    var passwordError = this.oldPasswordInvalid() || this.newPasswordInvalid() || this.passwordConfirmationInvalid()
    this.forceUpdate()
    return passwordError
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

  nameChanged = (evt) => {
    this.setState({
      name: evt.currentTarget.value
    })
  }

  oldPasswordInvalid = () => {
    if (this.state.oldPassword != null || this.state.newPassword != null || this.state.passwordConfirmation != null) {
      if (this.state.oldPassword == null){
        return true
      }
    }

    return false
  }

  newPasswordInvalid = () => {
    if (this.state.oldPassword != null || this.state.newPassword != null || this.state.passwordConfirmation != null) {
      if (this.state.newPassword == null || this.state.newPassword != this.state.passwordConfirmation) {
        return true
      }
    }

    return false
  }

  passwordConfirmationInvalid = () => {
    if (this.state.oldPassword != null || this.state.newPassword != null || this.state.passwordConfirmation != null) {
      if (this.state.passwordConfirmation == null || this.state.newPassword != this.state.passwordConfirmation) {
        return true
      }
    }

    return false
  }

  oldPasswordInvalidMessage = () => {
    if (this.state.oldPassword == null) {
      return 'Old password cannot be empty.'
    }
    return ''
  }

  newPasswordInvalidMessage = () => {
    if (this.state.newPassword == null) {
      return 'New password cannot be empty.'
    }
    return ''
  }

  passwordConfirmationInvalidMessage = () => {
    if (this.state.passwordConfirmation == null) {
      return 'Password confirmation cannot be empty.'
    }
    return ''
  }

  render() {
    var that = this

    var withoutConfirmation = null
    if (this.props.withoutConfirmation == null) {
      withoutConfirmation =  <Form.Group>
                            <Form.Label>Old Password</Form.Label>
                            <Form.Control type='password' value={this.state.oldPassword} onChange={this.oldPasswordChanged} isInvalid={this.oldPasswordInvalid}/>
                            <Form.Control.Feedback type='valid'>{this.oldPasswordInvalidMessage()}</Form.Control.Feedback>
                          </Form.Group>
    }

    return (
      <div>
        <br />
        <div>
          <Container>
            <Navbar bg="dark" variant="dark">
              <Navbar.Brand>User Settings</Navbar.Brand>
            </Navbar>
            <Form className='userSettingsContainer'>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type='text' value={this.state.name} onChange={this.nameChanged}/>
              </Form.Group>
              {withoutConfirmation}
              <Form.Group>
                <Form.Label>New Password</Form.Label>
                <Form.Control type='password' value={this.state.newPassword} onChange={this.newPasswordChanged} isInvalid={this.newPasswordInvalid}/>
                <Form.Control.Feedback type='invalid'>{this.newPasswordInvalidMessage()}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control type='password' value={this.state.passwordConfirmation} onChange={this.passwordConfirmationChanged} isInvalid={this.passwordConfirmationInvalid}/>
                <Form.Control.Feedback type='invalid'>{this.passwordConfirmationInvalidMessage()}</Form.Control.Feedback>
              </Form.Group>
              &nbsp;
              <Button className='userSettingsSaveButton' onClick={this.save}>Save</Button>
              <br />
            </Form>
          </Container>
        </div>
      </div>
    )
  }
}
