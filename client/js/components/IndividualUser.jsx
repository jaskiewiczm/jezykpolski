import React from "react"
import UserEditor from './UserEditor.jsx'

import swal from 'sweetalert';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'


import styles from "./IndividualHomework.scss"

export default class IndividualUser extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editMode: false,
      name: this.props.name,
      email: this.props.email,
      userId: this.props.userId,
      guardians: []
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

  editClosed = (email, name) => {
    if (email != null && name != null) {
      this.setState({
        editMode: false,
        name: name,
        email: email
      })
    } else {
      this.setState({
        editMode: false
      })
    }
  }

  render() {
    var editContent = this.state.editMode ? <UserEditor userId={this.state.userId} name={this.state.name} email={this.state.email} callback={this.editClosed}/> : null

    return (
      <div>
        <Container>
          <Row>
            <Col xs={3}>{this.state.name}</Col>
            <Col xs={3}>{this.state.email}</Col>
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
