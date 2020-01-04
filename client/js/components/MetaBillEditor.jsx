import React from "react"

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'

import './MetaBillEditor.scss'

export default class MetaBillEditor extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      show: true,
      saveDisabled: false,
      title: this.props.metabillId == null ? 'Add Bill Configuration' : 'Edit Bill Configuration',
      billName: null,
      billValue: null,
      billType: 'bill'
    }

  }

  handleClose = () => {
    this.setState({
      show: false
    })

    this.props.closeCallback()
  }

  handleSave = () => {
    var that = this

    if (this.state.billName == null || this.state.billName.length == 0) {
      that.setState({
        billName: ''
      })
      return
    }

    var data = {
      billName: this.state.billName,
      billValue: this.state.billValue,
      billType: this.state.billType,
      schoolId: this.props.schoolId
    }

    var route = '/add_meta_bill'
    if (this.props.metaBillId) {
      route = '/edit_meta_bill'
      data['metaBillId'] = this.props.metaBillId
    }

    fetch(route, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      if (response.status == 200) {
        return response.json()
      }
      return null
    }).then((response)=>{
      this.setState({
        show: false
      })

      this.props.closeCallback()
    })
  }

  nameChanged = (evt) => {
    this.setState({
      billName: evt.currentTarget.value
    })
  }

  billValueChanged = (evt) => {
    var billValue = evt.currentTarget.value
    if (billValue[billValue.length - 1] != '.') {
      var billValue = parseFloat(billValue)
      if (isNaN(billValue)) {
        this.setState({
          billValue: ''
        })
      } else {
        this.setState({
          billValue: billValue
        })
      }
    } else {
      this.setState({
        billValue: billValue
      })
    }
  }

  typeChanged = (evt) => {
    var val = evt.target.value
    this.setState({
      billType: val
    })
  }

  render() {
    var that = this

    return (
      <Modal show={this.state.show} size="lg">
        <Modal.Header>
          <Modal.Title>{this.state.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form validated={this.state.validatedName || this.state.validatedEmail}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type='text' value={this.state.name} onChange={this.nameChanged} isInvalid={this.state.billName != null && this.state.billName.length == 0}/>
              <Form.Control.Feedback type='invalid'>A bill configuration name is required.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Bill Amount</Form.Label>
              <Form.Control type='text' value={this.state.billValue} onChange={this.billValueChanged} isInvalid={this.state.billValue != null && this.state.billValue.length == 0}/>
              <Form.Control.Feedback type='invalid'>A numeric value is required.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Control as="select" onChange={this.typeChanged}>
                <option value='bill'>Bill</option>
                <option value='rate_adjustment'>Rate Adjustment</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button disabled={this.state.saveDisabled} variant="primary" onClick={this.handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

