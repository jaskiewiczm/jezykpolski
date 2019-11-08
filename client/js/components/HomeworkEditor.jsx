import React from "react"

import RichTextEditor from 'react-rte';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import Calendar from 'react-calendar'

import "./HomeworkEditor.scss"

export default class HomeworkEditor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: this.props.description != null ? RichTextEditor.createValueFromString(this.props.description, 'html') : RichTextEditor.createEmptyValue(),
      show: true,
      title: this.props.title == null ? 'Edit Homework' : this.props.title,
      dueDate: this.props.dueDate != null ? this.props.dueDate : null,
      homeworkTitle: this.props.homeworkTitle != null ? this.props.homeworkTitle : null,
      addOrEdit: this.props.title == null ? 'edit' : 'add',
      selectedKlassId: this.props.selectedKlassId
    }
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
    return (
      <Modal show={this.state.show} size="lg">
        <Modal.Header>
          <Modal.Title>{this.state.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control required type="text" onChange={this.onTitleChange} value={this.state.homeworkTitle}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control type="date" onChange={this.onDueDateChange} value={this.state.dueDate}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Assignment</Form.Label>
              <RichTextEditor
                  value={this.state.value}
                  onChange={this.onChange}/>
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
