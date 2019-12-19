import React from "react"
import { connect } from "react-redux";

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import UserEnrollment from './UserEnrollment.jsx'

import "./HomeworkEditor.scss"

class KlassEditor extends React.Component {

  constructor(props) {
    super(props)

    var name = this.props.name != null ? this.props.name : ''
    var selectedTeacherId = null
    if (this.props.klass != null) {
      selectedTeacherId = this.props.klass.teacher_id
    }

    this.state = {
      klassId: this.props.klassId,
      name: name,
      show: true,
      title: this.props.title == null ? 'Edit Class' : this.props.title,
      addOrEdit: this.props.title == null ? 'edit' : 'add',
      teachers: [],
      selectedTeacherId: selectedTeacherId
    }
  }

  componentDidMount() {
    this.getTeachers()
  }

  handleClose = () => {
    this.setState({
      show: false
    })

    this.props.callback(this.state.name)
  }

  getTeachers = () => {
    fetch('/teachers', {
      method: 'POST',
      body: JSON.stringify({schoolId: this.props.selectedSchoolId}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      if (response.status == 200) {
        return response.json()
      }
      return null
    }).then((response) => {
      if (response != null) {
        this.setState({
          teachers: response
        })
      }
    })
  }

  handleSave = () => {
    if (this.props.klass != null) {
      this.props.klass.teacher_id = this.state.selectedTeacherId
    }

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
      body: JSON.stringify({name: this.state.name, klassId: this.props.klassId, schoolId: this.props.selectedSchoolId, teacherId: this.state.selectedTeacherId}),
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

  teacherChanged = (evt) => {
    var x= 0
    x = 1
    var teacher = this.state.teachers.find(function(teacher){
      return teacher.name == evt.currentTarget.value
    })

    if (teacher != null) {
      this.setState({
        selectedTeacherId: teacher.id
      })
    }
  }

  render() {
    var that = this
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
              <Form.Label>Teacher</Form.Label>
              <Form.Control as='select' onChange={this.teacherChanged}>
                <option></option>
                {this.state.teachers.map(function(teacher){
                  return <option key={teacher.id} selected={teacher.id == that.state.selectedTeacherId ? 'selected' : false}>{teacher.name}</option>
                })}
              </Form.Control>
              <br />
              <Form.Label>Enrollments</Form.Label>
              <UserEnrollment schoolId={this.props.selectedSchoolId} klassId={this.props.klassId}/>
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


export default connect(state => {
    return {
        selectedSchoolId: state.selectedSchoolId
    }
})(KlassEditor)

