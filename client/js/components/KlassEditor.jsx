import React from "react"
import { connect } from "react-redux";

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'

import UserEnrollment from './UserEnrollment.jsx'
import ActivityTypePercentage from './ActivityTypePercentage.jsx'

import "./HomeworkEditor.scss"
import "./KlassEditor.scss"

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
      selectedTeacherId: selectedTeacherId,
      activityTypeBreakdown: null,
      disableSave: false
    }
  }

  componentDidMount() {
    this.getTeachers()
    this.getActivityTypeBreakdown()
  }

  handleClose = () => {
    this.setState({
      show: false
    })

    this.props.callback(this.state.name)
  }

  updateActivityTypesCallback = (activityTypes) => {
    var that = this
    activityTypes.forEach(at => {
      var oldAt = that.state.activityTypeBreakdown.find(item => {return item.activity_id == at.activity_id})
      if (oldAt) {
        oldAt.percentage = at.percentage
      }
    })
  }

  getActivityTypeBreakdown = () => {
    var body = null
    if (this.props.klassId != null) {
      body = {klassId: this.props.klassId}
    }

    fetch('/get_activity_types', {
      method: 'POST',
      body: JSON.stringify(body),
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
          activityTypeBreakdown: response
        })
      }
    })
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

    var data = {name: this.state.name,
                klassId: this.props.klassId,
                schoolId: this.props.selectedSchoolId,
                teacherId: this.state.selectedTeacherId}

    if (this.state.activityTypeBreakdown) {
      var activityTypes = this.state.activityTypeBreakdown.map(at => {return {activity_id: at.activity_id, percentage: at.percentage}})
      data['activityPercentages'] = activityTypes
    }

    fetch(path, {
      method: 'POST',
      body: JSON.stringify(data),
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

  disableSaveCallback = (newState) => {
    if (this.state.disableSave != newState) {
      this.setState({
        disableSave: newState
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
            <Row>
              <Col>
                <Card className='klassEditorCards'>
                  <Card.Title className='klassEditorCardTitle'>
                    Basic Settings
                  </Card.Title>
                  <Card.Body className='klassEditorCardBody'>
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control type='text' value={this.state.name} onChange={this.nameChanged}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Teacher</Form.Label>
                      <Form.Control as='select' onChange={this.teacherChanged}>
                        <option></option>
                        {this.state.teachers.map(function(teacher){
                          return <option key={teacher.id} selected={teacher.id == that.state.selectedTeacherId ? 'selected' : false}>{teacher.name}</option>
                        })}
                      </Form.Control>
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className='klassEditorCards'>
                  <Card.Title className='klassEditorCardTitle'>Activity Type Percentages</Card.Title>
                  <Card.Body className='klassEditorCardBody'>
                    <Form.Group>
                      <Form.Label></Form.Label>
                      <ActivityTypePercentage updateActivityTypesCallback={this.updateActivityTypesCallback}
                                              disableSaveCallback={this.disableSaveCallback}
                                              activityTypes={this.state.activityTypeBreakdown}/>
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Card className='klassEditorCards'>
                  <Card.Title className='klassEditorCardTitle'>Enrollments</Card.Title>
                  <Card.Body className='klassEditorCardBody'>
                    <Form.Group>
                      <UserEnrollment schoolId={this.props.selectedSchoolId} klassId={this.props.klassId}/>
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" disabled={this.state.disableSave} onClick={this.handleSave}>
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

