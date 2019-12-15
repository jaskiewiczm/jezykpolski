import React from "react"
import { connect } from "react-redux";

import Enrollment from './Enrollment.jsx'
import UserSearch from './UserSearch.jsx'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'


import "./HomeworkEditor.scss"

class UserEditor extends React.Component {

  constructor(props) {
    super(props)

    var user = this.props.user
    var parentList = this.props.masterUsers.filter(user => user.userRoles.find(role => role.code == 'parent') != null)

    this.state = {
      name: this.props.name,
      uniqueName: false,
      uniqueEmail: false,
      validatedName: false,
      validatedEmail: false,
      email: this.props.email,
      show: true,
      title: this.props.title == null ? 'Edit User' : this.props.title,
      userType: this.props.userType,
      enrollments: [],
      userId: this.props.userId,
      schoolId: this.props.schoolId,
      showAddEnrollments: false,
      addOrEdit: this.props.title == null ? 'edit' : 'add',
      roles: [],
      userRoles: this.props.userRoles == null ? [] : this.props.userRoles,
      parentList: parentList,
      parent1Id: user != null ? user.parents[0] : null,
      parent2Id: user != null ? user.parents[1] : null
    }

    this.getEnrollments()
    this.getRoles()
  }

  getRoles = () => {
    var that = this
    fetch('/get_roles', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      if (response.status == 200) {
        return response.json()
      }
    }).then((response)=>{
      if (response != null) {
        that.setState({
          roles: response
        })
      }
    })
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
        if (response.status == 200) {
          return response.json()
        }
        return null
      }).then((response) => {
        if (response != null) {
          this.setState({
            enrollments: response
          })
        }
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
    var that = this

    var path = ''
    if (this.state.addOrEdit == 'edit') {
      path = '/update_user'
    } else {
      path = '/add_user'
    }
    fetch(path, {
      method: 'POST',
      body: JSON.stringify({name: this.state.name,
                            userId: this.props.userId,
                            email: this.state.email,
                            roles: this.state.userRoles.map(function(role){return role.id}),
                            parent1Id: this.state.parent1Id,
                            parent2Id: this.state.parent2Id
                          }),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response) => {
      if (response.status == 200) {
        this.props.callback(this.state.email, this.state.name, this.state.userRoles)
        this.props.user.parents = []
        if (this.state.parent1Id != null) {
          this.props.user.parents.push(this.state.parent1Id)
        }
        if (this.state.parent2Id != null) {
          this.props.user.parents.push(this.state.parent2Id)
        }
        that.setState({
          show: false
        })
        return null
      }

      return response.json()
      //else {
      //  this.props.callback()
      //}
    }).then((response) => {
      if (response != null) {
        that.setState({
          uniqueName: response.name_unique,
          validatedName: true,
          uniqueEmail: response.email_unique,
          validatedEmail: true
        })
      }
    })
  }

  addEnrollment = () => {
    fetch('/add_enrollments', {
      method: 'POST',
      body: JSON.stringify({userId: this.state.userId, klassId: this.state.selectedKlassId}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    })
  }

  deleteEnrollment = (klassId) => {
    var that = this
    fetch('/delete_enrollment', {
      method: 'POST',
      body: JSON.stringify({userId: this.state.userId, klassId: klassId}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      var enrollments = this.state.enrollments
      enrollments = enrollments.filter(function(value, index, ar) {
        return value.id != klassId
      })

      this.setState({
        enrollments: enrollments
      })
    })
  }

  nameChanged = (evt) => {
    this.setState({
        name: evt.currentTarget.value,
        validatedName: false,
        uniqueName: false
    })
  }

  emailChanged = (evt) => {
    this.setState({
        email: evt.currentTarget.value,
        validatedEmail: false,
        uniqueEmail: false
    })
  }

  addEnrollment = () => {
    this.setState({
      showAddEnrollments: true
    })
  }

  addEnrollmentCallback = (klass) => {
    if (klass != null) {
      var enrollments = this.state.enrollments
      enrollments.push(klass)

      this.setState({
        showAddEnrollments: false,
        enrollments: enrollments
      })
    } else {
      this.setState({
        showAddEnrollments: false
      })
    }
  }

  permissionsChanged = (event) => {
    var roles = []
    var len = event.currentTarget.length
    for (var i=0; i<len; i++) {
      var option = event.currentTarget[i]
      if (option.selected) {
        var roleId = option.getAttribute('role-id')
        roles.push(this.state.roles.find(function(element){return element.id == roleId}))
      }
    }

    this.setState({
      userRoles: roles
    })
  }

  clearParent1SearchCallback = () => {
    this.setState({
      parent1Id: null
    })
  }

  clearParent2SearchCallback = () => {
    this.setState({
      parent2Id: null
    })
  }

  userParent1SelectedCallback = (name) => {
    var parent = this.state.parentList.find(parent => parent.name == name)
    this.setState({
      parent1Id: parent.id
    })
  }

  userParent2SelectedCallback = (name) => {
    var parent = this.state.parentList.find(parent => parent.name == name)
    this.setState({
      parent2Id: parent.id
    })
  }

  render() {
    var that = this

    var enrollment = null
    if (this.state.showAddEnrollments) {
      enrollment = <Enrollment userId={this.state.userId} schoolId={this.state.schoolId} callback={this.addEnrollmentCallback}/>
    }

    var parent1 = this.state.parentList.find(parent => parent.id == this.state.parent1Id)
    var parent2 = this.state.parentList.find(parent => parent.id == this.state.parent2Id)
    if (parent1 != null) {
      parent1 = parent1.name
    }
    if (parent2 != null) {
      parent2 = parent2.name
    }

    return (
      <Modal show={this.state.show} size="lg">
        <Modal.Header>
          <Modal.Title>{this.state.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form validated={this.state.validatedName || this.state.validatedEmail}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type='text' value={this.state.name} onChange={this.nameChanged} isInvalid={this.state.validatedName && !this.state.uniqueName}/>
              <Form.Control.Feedback type='invalid'>This name is not unique.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type='text' value={this.state.email} onChange={this.emailChanged} isInvalid={this.state.validatedEmail && !this.state.uniqueEmail}/>
              <Form.Control.Feedback type='invalid'>This email is not unique.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Permissions</Form.Label>
              <Form.Control as='select' multiple onChange={this.permissionsChanged} value={this.state.userRoles.map(function(role){return role.name})}>
                {this.state.roles.map(function(role){
                  return <option key={role.id} role-id={role.id}>{role.name}</option>
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Parent #1</Form.Label>
              <UserSearch defaultValue={parent1} users={this.state.parentList} clearCallback={this.clearParent1SearchCallback} selectedCallback={this.userParent1SelectedCallback}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Parent #2</Form.Label>
              <UserSearch defaultValue={parent2}  users={this.state.parentList} clearCallback={this.clearParent2SearchCallback} selectedCallback={this.userParent2SelectedCallback}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Enrollments</Form.Label>
              <Button variant="outline-primary" size='sm' onClick={this.addEnrollment} style={{float: 'right', paddingBottom: '5px'}}>Enroll</Button>
            </Form.Group>
            <Form.Group>
              <ListGroup>
                {
                  this.state.enrollments.map(function(key, index){
                    return <ListGroup.Item key={index}>
                      <Row>
                        <Col xs={10}>
                          {key.name}
                        </Col>
                        <Col>
                          <Image src="trash.png" onClick={() => {that.deleteEnrollment(key.id)}} />
                        </Col>
                      </Row>
                      </ListGroup.Item>
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
        {enrollment}
      </Modal>
    )
  }
}

export default connect(state => {
    return {
        user: state.user
    }
})(UserEditor)

