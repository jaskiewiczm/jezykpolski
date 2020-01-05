import React from "react"
import { connect } from "react-redux";
import HomeworkEditor from './HomeworkEditor.jsx'

import swal from 'sweetalert';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'

import g_roles from './GlobalRoles.jsx'

import styles from "./IndividualHomework.scss"

class IndividualHomework extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      homeworkEditorDisableFields: false,
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
      editMode: true,
      homeworkEditorDisableFields: false
    })
  }

  readHomework = () => {
    this.setState({
      editMode: true,
      homeworkEditorDisableFields: true
    })
  }

  editClosed = (title, dueDate, activityTypeId) => {
    if (title != null && dueDate != null) {
      this.setState({
        editMode: false,
        homeworkTitle: title,
        dueDate: dueDate
      })
    } else {
      this.setState({
        editMode: false
      })
    }
  }

  render() {
    var editContent = this.state.editMode ? <HomeworkEditor homeworkEditorDisableFields={this.state.homeworkEditorDisableFields}
                                                            homeworkId={this.state.homeworkId}
                                                            homeworkTitle={this.state.homeworkTitle}
                                                            description={this.state.description}
                                                            callback={this.editClosed}
                                                            homework={this.props.homework}
                                                            dueDate={this.state.dueDate}/> : null

    var readOrDeleteButton = null
    var editButton = null
    if (g_roles.containsRole('admin', this.props.roles)
        || g_roles.containsRole('school_admin', this.props.roles)
        || g_roles.containsRole('teacher', this.props.roles)) {
      editButton = <Image className='imageButtons' src="pencil.png" onClick={this.editHomework} />
      readOrDeleteButton = <Image className='imageButtons' src="trash.png" onClick={this.deleteHomework} />
    } else {
      readOrDeleteButton = <Image className='imageButtons' src="search.svg" onClick={this.readHomework} />
    }

    return (
      <div>
        <Container>
          <Row>
            <Col xs={2}>{this.state.dueDate}</Col>
            <Col xs={8}>
              <Container>
                <Row><Col>{this.state.homeworkTitle}</Col></Row>
              </Container>
            </Col>
            <Col xs={1}>
              {editButton}
            </Col>
            <Col xs={1}>
              {readOrDeleteButton}
            </Col>
          </Row>
        </Container>
        {editContent}
      </div>
    )
  }
}

export default connect(state => {
    return {
        roles: state.myRoles
    }
})(IndividualHomework)
