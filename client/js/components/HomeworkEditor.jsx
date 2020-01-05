import React from "react"

import RichTextEditor from 'react-rte';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import Calendar from 'react-calendar'

import getActivityTypes from '../helpers/activity_types.jsx'

import "./HomeworkEditor.scss"

export default class HomeworkEditor extends React.Component {

  constructor(props) {
    super(props)

    var selectedActivityTypeId = null
    if (this.props.homework) {
      selectedActivityTypeId = this.props.homework.activity_type_id
    }

    this.state = {
      value: this.props.description != null ? RichTextEditor.createValueFromString(this.props.description, 'html') : RichTextEditor.createEmptyValue(),
      show: true,
      title: this.props.title == null ? 'Edit Homework' : this.props.title,
      dueDate: this.props.dueDate != null ? this.props.dueDate : null,
      homeworkTitle: this.props.homeworkTitle != null ? this.props.homeworkTitle : null,
      addOrEdit: this.props.title == null ? 'edit' : 'add',
      selectedKlassId: this.props.selectedKlassId,
      activityTypes: null,
      selectedActivityTypeId: selectedActivityTypeId
    }
  }

  componentDidMount() {
    var that = this
    getActivityTypes(null, (response) => {
      that.setState({
        activityTypes: response
      })
    })
  }

  onChange = (value) => {
    this.setState({value});
    if (this.props.onChange) {
      this.props.onChange(
        value.toString('html')
      );
    }
  };

  onDueDateChange = (value) => {
    this.setState({
      dueDate: value.currentTarget.value
    })
  }

  onTitleChange = (value) => {
    this.setState({
      homeworkTitle: value.currentTarget.value
    })
  }

  activityTypeChanged = (event) => {
    var at = this.state.activityTypes.find(at => {return at.activity_name == event.currentTarget.value})
    if (at) {
      this.setState({
        selectedActivityTypeId: at.activity_id
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
    this.setState({
      show: false
    })

    var updatedText = this.state.value.toString('html')

    if (this.state.addOrEdit == 'add') {
      fetch('/add_homework', {
        method: 'POST',
        body: JSON.stringify({description: updatedText,
                              dueDate: this.state.dueDate,
                              selectedKlassId: this.state.selectedKlassId,
                              selectedActivityTypeId: this.state.selectedActivityTypeId,
                              title: this.state.homeworkTitle}),
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }).then((response)=>{
        if (response.status == 200) {
          return response.json()
        }
        return null
      }).then((response)=>{
        if (response != null) {
          this.props.callback()
        }
      })
    } else {
      fetch('/update_homework_description', {
        method: 'POST',
        body: JSON.stringify({description: updatedText,
                              homeworkId: this.props.homeworkId,
                              dueDate: this.state.dueDate,
                              selectedActivityTypeId: this.state.selectedActivityTypeId,
                              title: this.state.homeworkTitle}),
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }).then((response)=>{
        if (response.status == 200) {
          this.props.callback(updatedText, this.state.dueDate)
        }
      })
    }
  }


  render() {
    var that = this
    var buttons = null
    var rte = null
    if (!this.props.homeworkEditorDisableFields) {
      buttons =     <div>
                      <Button variant="secondary" onClick={this.handleClose}>
                        Close
                      </Button>&nbsp;
                      <Button variant="primary" onClick={this.handleSave}>
                        Save Changes
                      </Button>
                    </div>
      rte = <RichTextEditor
              value={this.state.value}
              onChange={this.onChange}/>
    } else {
      buttons =     <Button variant="primary" onClick={this.handleClose}>
                      Close
                    </Button>
      rte = <div dangerouslySetInnerHTML={{__html: this.props.description}}></div>
    }

    var activityTypes = []
    if (this.state.activityTypes) {
      activityTypes = this.state.activityTypes
    }

    return (
      <Modal show={this.state.show} size="lg">
        <Modal.Header>
          <Modal.Title>{this.state.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control disabled={this.props.homeworkEditorDisableFields} required type="text" onChange={this.onTitleChange} value={this.state.homeworkTitle}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Activity Type</Form.Label>
              <Form.Control as='select' onChange={this.activityTypeChanged}>
                <option></option>
                {activityTypes.map(function(at){
                  return <option key={at.id} selected={at.activity_id == that.state.selectedActivityTypeId ? 'selected' : false}>{at.activity_name}</option>
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control disabled={this.props.homeworkEditorDisableFields} type="date" onChange={this.onDueDateChange} value={this.state.dueDate}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Assignment</Form.Label>
              {rte}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {buttons}
        </Modal.Footer>
      </Modal>
    )
  }
}
