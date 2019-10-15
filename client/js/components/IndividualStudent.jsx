import React from "react"
import HomeworkEditor from './HomeworkEditor.jsx'

import swal from 'sweetalert';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'


import styles from "./IndividualHomework.scss"

export default class IndividualStudent extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editMode: false,
      name: this.props.description,
      email: this.props.email,
      studentId: this.props.homeworkId,
      guardians: []
    }
  }

  deleteStudent = () => {
    var that = this
    swal({
      title: "Delete Student?",
      text: "Are you sure you want to delete this student?",
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
        fetch('/delete_student', {
          method: 'POST',
          body: JSON.stringify({studentId: this.props.studentId}),
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

  editStudent = () => {
    this.setState({
      editMode: true
    })
  }

  editClosed = (email, name) => {
    this.setState({
      editMode: false,
      name: name,
      email: email
    })
  }

  render() {
    var editContent = this.state.editMode ? <StudentEditor studentId={this.state.studentId} name={this.state.name} callback={this.editClosed}/> : null

    return (
      <div>
        <Container>
          <Row>
            <Col xs={1}>{this.state.name}</Col>
            <Col xs={1}>{this.state.email}</Col>
            <Col xs={1}>
              <Image src="pencil.png" onClick={this.editStudent} />
            </Col>
            <Col xs={1}>
              <Image src="trash.png" onClick={this.deleteStudent} />
            </Col>
          </Row>
        </Container>
        {editContent}
      </div>
    )
  }
}
