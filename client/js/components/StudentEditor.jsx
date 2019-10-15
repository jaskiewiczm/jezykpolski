import React from "react"

import RichTextEditor from 'react-rte';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import "./HomeworkEditor.scss"

export default class StudentEditor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: this.props.name,
      email: this.props.email,
      show: true,
      title: this.props.title == null ? 'Edit Student' : this.props.title
    }
  }

  handleClose = () => {
    this.setState({
      show: false
    })

    fetch('/update_student', {
      method: 'POST',
      body: JSON.stringify({name: this.state.name, studentId: this.props.studentId, email: this.state.email}),
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
    return (
      <Modal show={this.state.show} size="lg">
        <Modal.Header>
          <Modal.Title>{this.state.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col>{this.state.name}</Col>
              <Col>{this.state.email}</Col>
              <Col></Col>
            </Row>
          </Container>
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
