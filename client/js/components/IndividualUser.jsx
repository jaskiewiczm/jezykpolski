import React from "react"
import UserEditor from './UserEditor.jsx'

import swal from 'sweetalert';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import $ from 'jquery'


import styles from "./IndividualHomework.scss"
import './IndividualUser.scss'

export default class IndividualUser extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editMode: false,
      name: this.props.name,
      email: this.props.email,
      userId: this.props.userId,
      guardians: [],
      schoolId: this.props.schoolId,
      userRoles: this.props.userRoles
    }
  }

  deleteUser = () => {
    var that = this
    swal({
      title: "Delete User?",
      text: "Are you sure you want to delete this user?",
      icon: "warning",
      buttons: {
        no: {
          text: 'No',
          value: false
        },
        yes: {
          text: 'Yes',
          value: true
        }
      }
    })
    .then((willDelete) => {
      if (willDelete === true) {
        fetch('/delete_user', {
          method: 'POST',
          body: JSON.stringify({userId: this.props.userId}),
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          }
        }).then((response)=>{
          if (response.status == 200) {
            that.forceUpdate();
            that.props.deleteCallback()
          }
        })
      }
    });
  }

  editUser = () => {
    this.setState({
      editMode: true
    })
  }

  editClosed = (email, name, userRoles) => {
    if (email != null && name != null) {
      this.setState({
        editMode: false,
        name: name,
        email: email,
        userRoles: userRoles
      }, this.updateAdminAlert)
    } else {
      this.setState({
        editMode: false
      })
    }
  }

  updateAdminAlert = () => {
    var roleStyle = this.state.userRoles.find(function(roleObj){return roleObj.code.includes('admin')})
    var individualUserId = '#individual_user_' + String(this.state.userId)

    if (roleStyle != null) {
      $(individualUserId).parent().addClass('schoolAdminRoleClass')
    } else {
      $(individualUserId).parent().removeClass('schoolAdminRoleClass')
    }

  }

  componentDidMount() {
    this.updateAdminAlert()
  }

  render() {
    var editContent = this.state.editMode ? <UserEditor masterUsers={this.props.masterUsers} userId={this.state.userId} name={this.state.name} email={this.state.email} schoolId={this.state.schoolId} callback={this.editClosed} userRoles={this.state.userRoles}/> : null
    var individualUserId = 'individual_user_' + String(this.state.userId)

    return (
      <div id={individualUserId}>
        <Container>
          <Row>
            <Col xs={3}>{this.state.name}</Col>
            <Col xs={3}>{this.state.email}</Col>
            <Col xs={4} />
            <Col xs={1}>
              <Image src="pencil.png" onClick={this.editUser} />
            </Col>
            <Col xs={1}>
              <Image src="trash.png" onClick={this.deleteUser} />
            </Col>
          </Row>
        </Container>
        {editContent}
      </div>
    )
  }
}
