import React from "react"

import RichTextEditor from 'react-rte';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'

import "./HomeworkEditor.scss"

export default class UserEditor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: this.props.name,
      email: this.props.email,
      show: true,
      title: this.props.title == null ? 'Edit User' : this.props.title,
      userType: this.props.userType,
      enrollments: [],
      userId: this.props.userId
    }

    this.getEnrollments()
  }

  getEnrollments = () => {
    if (this.state.userId) {
      fetch('/get_enrollments', {
        method: 'POST',
        body: JSON.stringify({userId: this.state.userId}),
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }).then((response) => {
        return response.json()
      }).then((response) => {
        this.setState({
          enrollments: response
        })
      })
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

    fetch('/update_user', {
      method: 'POST',
      body: JSON.stringify({name: this.state.name, userId: this.props.userId, email: this.state.email}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      if (response.status == 200) {
        this.props.callback(this.state.email, this.state.name)
      } else {
        this.props.callback()
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
              <Form.Control type='text' value={this.state.name}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type='text' value={this.state.email}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Parent #1</Form.Label>
              <Form.Control type='text'/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Parent #2</Form.Label>
              <Form.Control type='text'/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Enrollments</Form.Label>
              <ListGroup>
                {
                  this.state.enrollments.map(function(key, index){
                    return <ListGroup.Item variant={ index % 2 == 0 ? 'dark' : 'light'}>{key.name}</ListGroup.Item>
                  })
                }
              </ListGroup>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
