import React from "react"
import { connect } from "react-redux";

import Enrollment from './Enrollment.jsx'
import UserSearch from './UserSearch.jsx'
import {updateUser} from '../redux/Actions.jsx'

import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Alert from 'react-bootstrap/Alert'

import {styles} from './UserSettings.scss'


import "./HomeworkEditor.scss"

class UserSettings extends React.Component {

  constructor(props) {
    super(props)

    var allowGradesEmail = false
    var userName = null
    if (this.props.user) {
      userName = this.props.user.name
      allowGradesEmail = this.props.user.suppress_grades_emails ? '' : 'checked'
    }
    this.state = {
      oldPassword: '',
      newPassword: '',
      passwordConfirmation: '',
      name: userName,
      isNameUnique: true,
      originalPasswordIncorrect: false,
      showSuccess: false,
      allowGradesEmail: allowGradesEmail
    }
  }

  save = () => {
    var that = this

    var suppressGradesEmail = this.state.allowGradesEmail == 'checked' ? false : true
    var user =  {
                  userId: this.props.user.id,
                  name: this.state.name,
                  suppressGradesEmail: suppressGradesEmail
                }

    if (this.passwordChangeAttempt()) {
      if (this.passwordError()) {
        return
      }

      user['oldPassword'] = this.state.oldPassword
      user['newPassword'] = this.state.newPassword,
      user['passwordConfirmation'] = this.state.passwordConfirmation
    }

    fetch('/update_user', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json; charset=utf-8" }
    }).then((response) => {
      if (response.status == 200) {
        var newUser = this.props.user
        newUser.name = that.state.name
        newUser.suppress_grades_emails = suppressGradesEmail
        updateUser(newUser)

        that.setState({
          showSuccess: true
        })
      } else if (response.status == 401) {
        // original password is incorrect
        that.setState({
          originalPasswordIncorrect: true,
          showSuccess: false
        })
      } else if (response.status == 406) {
        // name or email is not unique
        that.setState({
          isNameUnique: false,
          showSuccess: false
        })
      }
    })
  }

  passwordChangeAttempt = () => {
    return this.state.oldPassword || this.state.newPassword || this.state.passwordConfirmation
  }

  passwordError = () => {
    var passwordError = this.oldPasswordInvalid() || this.newPasswordInvalid() || this.passwordConfirmationInvalid()
    if (!passwordError) {
      this.forceUpdate()
    }
    return passwordError
  }

  oldPasswordChanged = (evt) => {
    this.setState({
      oldPassword: evt.currentTarget.value,
      originalPasswordIncorrect: false
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
      name: evt.currentTarget.value,
      isNameUnique: true
    })
  }

  nameInvalid = () => {
    if (!this.state.isNameUnique) {
      return true
    }
    return false
  }

  nameInvalidMessage = () => {
    if (!this.state.isNameUnique) {
      return 'The name must be unique.'
    } else if (this.state.name != null && this.state.name.length == 0) {
      return 'Name is required.'
    }

    return ''
  }

  oldPasswordInvalid = (originalPasswordIncorrectCheck) => {
    if (originalPasswordIncorrectCheck && this.state.originalPasswordIncorrect) {
      return true
    }

    if (this.state.oldPassword == '' && this.state.newPassword == '' && this.state.passwordConfirmation == '') {
      return false
    }

    if (this.state.oldPassword != '' || this.state.newPassword != '' || this.state.passwordConfirmation != '') {
      if (this.state.oldPassword == ''){
        return true
      }
    }

    return false
  }

  newPasswordInvalid = () => {
    if (this.state.oldPassword == '' && this.state.newPassword == '' && this.state.passwordConfirmation == '') {
      return false
    }

    if (this.state.oldPassword != '' || this.state.newPassword != '' || this.state.passwordConfirmation != '') {
      if (this.state.newPassword == '' || this.state.newPassword != this.state.passwordConfirmation) {
        return true
      }
    }

    return false
  }

  passwordConfirmationInvalid = () => {
    if (this.state.oldPassword == '' && this.state.newPassword == '' && this.state.passwordConfirmation == '') {
      return false
    }

    if (this.state.oldPassword != '' || this.state.newPassword != '' || this.state.passwordConfirmation != '') {
      if (this.state.passwordConfirmation == '' || this.state.newPassword != this.state.passwordConfirmation) {
        return true
      }
    }

    return false
  }

  oldPasswordInvalidMessage = () => {
    if (this.state.originalPasswordIncorrect) {
      return 'The old password is incorrect.'
    } else if (this.state.oldPassword == '') {
      return 'Old password cannot be empty.'
    }
    return ''
  }

  newPasswordInvalidMessage = () => {
    if (this.state.newPassword == '') {
      return 'New password cannot be empty.'
    } else if (this.state.newPassword != this.state.passwordConfirmation) {
      return 'New password must match password confirmation.'
    }
    return ''
  }

  passwordConfirmationInvalidMessage = () => {
    if (this.state.passwordConfirmation == '') {
      return 'Password confirmation cannot be empty.'
    } else if (this.state.newPassword != this.state.passwordConfirmation) {
      return 'New password must match password confirmation.'
    }
    return ''
  }

  unsubscribeFromGrades = (event) => {
    this.setState({
      allowGradesEmail: event.currentTarget.checked ? 'checked' : ''
    })
  }

  render() {
    var that = this

    var withoutConfirmation = null
    if (this.props.withoutConfirmation == null) {
      withoutConfirmation =  <Form.Group>
                            <Form.Label>Old Password</Form.Label>
                            <Form.Control type='password' value={this.state.oldPassword} onChange={this.oldPasswordChanged} isInvalid={this.oldPasswordInvalid(true)}/>
                            <Form.Control.Feedback type='invalid'>{this.oldPasswordInvalidMessage()}</Form.Control.Feedback>
                          </Form.Group>
    }

    var successAlert = null
    if (this.state.showSuccess) {
      successAlert =  <Alert variant='success'>
                        Your settings have been successfully changed.
                      </Alert>
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
              {successAlert}
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type='text' value={this.state.name} onChange={this.nameChanged} isInvalid={this.nameInvalid()}/>
                <Form.Control.Feedback type='invalid'>{this.nameInvalidMessage()}</Form.Control.Feedback>
              </Form.Group>
              {withoutConfirmation}
              <Form.Group>
                <Form.Label>New Password</Form.Label>
                <Form.Control type='password' value={this.state.newPassword} onChange={this.newPasswordChanged} isInvalid={this.newPasswordInvalid()}/>
                <Form.Control.Feedback type='invalid'>{this.newPasswordInvalidMessage()}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control type='password' value={this.state.passwordConfirmation} onChange={this.passwordConfirmationChanged} isInvalid={this.passwordConfirmationInvalid()}/>
                <Form.Control.Feedback type='invalid'>{this.passwordConfirmationInvalidMessage()}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Email Subscriptions</Form.Label>
                <Form.Check type='checkbox' label={'Grade Announcements'} checked={this.state.allowGradesEmail} onChange={this.unsubscribeFromGrades} />
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

export default connect(state => {
    return {
        user: state.user
    }
})(UserSettings)
