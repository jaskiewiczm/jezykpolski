import React from "react"
import HomeworkEditor from './HomeworkEditor.jsx'

import swal from 'sweetalert';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'


import styles from "./IndividualHomework.scss"

export default class IndividualHomework extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editMode: false,
      description: this.props.description,
      homeworkId: this.props.homeworkId,
      dueDate: this.props.dueDate,
      homeworkTitle: this.props.homeworkTitle
    }
  }

  deleteHomework = () => {
    var that = this
    swal({
      title: "Delete Homework?",
      text: "Are you sure you want to delete this homework assignment?",
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
        fetch('/delete_homework', {
          method: 'POST',
          body: JSON.stringify({homeworkId: this.props.homeworkId}),
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          }
        }).then((response)=>{
          if (response.status == 200) {
            that.setState({
              editMode: false
            }, this.props.deleteCallback)
          }
        })
      }
    });
  }

  editHomework = () => {
    this.setState({
      editMode: true
    })
  }

  editClosed = (text, dueDate) => {
    if (text != null && dueDate != null) {
      this.setState({
        editMode: false,
        description: text,
        dueDate: dueDate
      })
    } else {
      this.setState({
        editMode: false
      })
    }
  }

  render() {
    var editContent = this.state.editMode ? <HomeworkEditor homeworkId={this.state.homeworkId} homeworkTitle={this.state.homeworkTitle} description={this.state.description} callback={this.editClosed} dueDate={this.state.dueDate}/> : null

    return (
      <div>
        <Container>
          <Row>
            <Col xs={2}>{this.state.dueDate}</Col>
            <Col xs={8} dangerouslySetInnerHTML={{__html: this.state.description}} />
            <Col xs={1}>
              <Image src="pencil.png" onClick={this.editHomework} />
            </Col>
            <Col xs={1}>
              <Image src="trash.png" onClick={this.deleteHomework} />
            </Col>
          </Row>
        </Container>
        {editContent}
      </div>
    )
  }
}