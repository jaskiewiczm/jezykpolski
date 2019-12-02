import React from "react"

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import UserEnrollment from './UserEnrollment.jsx'

import "./HomeworkEditor.scss"

export default class KlassEditor extends React.Component {

  constructor(props) {
    super(props)

    var name = this.props.name != null ? this.props.name : ''

    this.state = {
      klassId: this.props.klassId,
      schoolId: this.props.schoolId,
      name: name,
      show: true,
      title: this.props.title == null ? 'Edit Class' : this.props.title,
      addOrEdit: this.props.title == null ? 'edit' : 'add',
    }
  }

  handleClose = () => {
    this.setState({
      show: false
    })

    this.props.callback(this.state.name)
  }

  handleSave = () => {
    this.setState({
      show: false
    })

    var path = ''
    if (this.state.addOrEdit == 'edit') {
      path = '/update_klass'
    } else {
      path = '/add_klass'
    }

    fetch(path, {
      method: 'POST',
      body: JSON.stringify({name: this.state.name, klassId: this.props.klassId, schoolId: this.props.schoolId}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      if (response.status == 200) {
        this.props.callback(this.state.name)
      }
    })

  }

  nameChanged = (evt) => {
    this.setState({name: evt.currentTarget.value})
  }

  render() {
    return (
      <Modal show={this.state.show} size="lg">
        <Modal.Header>
          <Modal.Title>{this.state.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type='text' value={this.state.name} onChange={this.nameChanged}/>
              <br />
              <Form.Label>Enrollments</Form.Label>
              <UserEnrollment schoolId={this.props.schoolId} klassId={this.props.klassId}/>
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
