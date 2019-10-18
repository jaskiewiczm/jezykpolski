import React from "react"

import RichTextEditor from 'react-rte';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import "./HomeworkEditor.scss"

export default class UserEditor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: this.props.name,
      email: this.props.email,
      show: true,
      title: this.props.title == null ? 'Edit User' : this.props.title,
      userType: this.props.userType
    }
  }

  handleClose = () => {
    this.setState({
      show: false
    })

    fetch('/update_user', {
      method: 'POST',
      body: JSON.stringify({name: this.state.name, userId: this.props.userId, email: this.state.email}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      if (response.status == 200) {
        this.props.callback(this.state.email, this.state.name)
      }
    })
  }


  render() {

    if (this.state.userType == 'parent') {

    } else if (this.state.userType == 'student') {

    }

    return (
      <Modal show={this.state.show} size="lg">
        <Modal.Header>
          <Modal.Title>{this.state.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control />
            </Form.Group>
            <Form.Group>
              <Form.Label>Parent #1</Form.Label>
              <Form.Control />
            </Form.Group>
            <Form.Group>
              <Form.Label>Parent #2</Form.Label>
              <Form.Control />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
