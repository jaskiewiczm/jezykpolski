import React from "react"
import { connect } from "react-redux";

import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

import './PasswordReset.scss'

export default class PasswordReset extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      email: null,
      successAlert: false
    }
  }

  attemptReset() {
    var that = this
    fetch('/request_password_reset', {
      method: 'POST',
      body: JSON.stringify({email: this.state.email}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      if (response.status == 200) {
        that.setState({
          successAlert: true
        })
      }
      return null
    })
  }

  emailChanged = (event) => {
    this.setState({
      email: event.currentTarget.value
    })
  }

  render() {
    var that = this

    var successAlert = null
    if (this.state.successAlert) {
      successAlert =  <div>
                        <br />
                        <Alert variant='success'>
                          A password reset email will be sent shortly.
                        </Alert>
                      </div>
    }

    return (
      <div>
        <br />
        <Container>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Password Reset</Navbar.Brand>
          </Navbar>

          <Form className='passwordResetContainer'>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' onChange={this.emailChanged} />
            </Form.Group>
            <Button variant="primary" onClick={this.attemptReset}>
              Reset Password
            </Button>

            {successAlert}

          </Form>

        </Container>
      </div>
    )
  }
}

