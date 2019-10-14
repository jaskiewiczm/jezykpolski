import React from "react"

import RichTextEditor from 'react-rte';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import "./HomeworkEditor.scss"

export default class HomeworkEditor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: this.props.description != null ? RichTextEditor.createValueFromString(this.props.description, 'html') : RichTextEditor.createEmptyValue(),
      show: true
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

  handleClose = () => {
    this.setState({
      show: false
    })

    var updatedText = this.state.value.toString('html')

    fetch('/update_homework_description', {
      method: 'POST',
      body: JSON.stringify({description: updatedText, homeworkId: this.props.homeworkId}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      if (response.status == 200) {
        this.props.callback(updatedText)
      }
    })
  }


  render() {
    return (
      <Modal show={this.state.show} size="lg">
        <Modal.Header>
          <Modal.Title>Edit Homework</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col></Col>
              <Col xs={12}>
                <RichTextEditor
                  value={this.state.value}
                  onChange={this.onChange}/>
              </Col>
              <Col></Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
