import React from "react"
import { connect } from "react-redux";

import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

import './JwtPasswordReset.scss'

export default class JwtPasswordReset extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      newPassword: '',
      passwordConfirmation: ''
    }
  }

  resetPassword = () => {
    var that = this

    if (!this.invalidNewPassword() && !this.invalidPasswordConfirmation()) {
      fetch('/reset_password', {
        method: 'POST',
        body: JSON.stringify({newPassword: that.state.newPassword, passwordConfirmation: that.state.passwordConfirmation}),
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }).then((response)=>{
        if (response.status == 200) {
          this.props.history.push('/homeworks')
        }
        return null
      })
    }
  }

  newPasswordChanged = (event) => {
    this.setState({
      newPassword: event.currentTarget.value
    })
  }

  passwordConfirmationChanged = (event) => {
    this.setState({
      passwordConfirmation: event.currentTarget.value
    })
  }


  invalidNewPassword = () => {
    var rv = false

    if (this.state.newPassword.length < 6) {
      rv = true
    } else if (this.state.newPassword != this.state.passwordConfirmation) {
      rv = true
    }

    return rv
  }

  invalidNewPasswordMessage = () => {
    if (this.state.newPassword.length < 6) {
      return 'New password must be longer than 6 characters.'
    }
    else if (this.state.newPassword != this.state.passwordConfirmation) {
      return 'New password does not match password confirmation.'
    }
    return ''
  }

  invalidPasswordConfirmation = () => {
    var rv = false

    if (this.state.passwordConfirmation.length < 6) {
      rv = true
    } else if (this.state.newPassword != this.state.passwordConfirmation) {
      rv = true
    }

    return rv
  }

  invalidPasswordConfirmationMessage = () => {
    if (this.state.passwordConfirmation.length < 6) {
      return 'New password must be longer than 6 characters.'
    }
    else if (this.state.newPassword != this.state.passwordConfirmation) {
      return 'New password does not match password confirmation.'
    }
    return ''
  }

  render() {
    var that = this

    return (
      <div>
        <br />
        <Container>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Password Reset</Navbar.Brand>
          </Navbar>

          <Form className='jwtPasswordResetContainer'>
            <Form.Group>
              <Form.Label>New Password</Form.Label>
              <Form.Control type='password' onChange={this.newPasswordChanged} isInvalid={this.invalidNewPassword()}/>
              <Form.Control.Feedback type='invalid'>{this.invalidNewPasswordMessage()}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type='password' onChange={this.passwordConfirmationChanged} isInvalid={this.invalidPasswordConfirmation()}/>
              <Form.Control.Feedback type='invalid'>{this.invalidPasswordConfirmationMessage()}</Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" onClick={this.resetPassword}>
              Reset Password
            </Button>
          </Form>

        </Container>
      </div>
    )
  }
}

