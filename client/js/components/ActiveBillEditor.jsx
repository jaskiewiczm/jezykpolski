import React from "react"

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'

import './ActiveBillEditor.scss'

export default class ActiveBillEditor extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      show: true,
      title: this.props.metabillId == null ? 'Add Bill' : 'Edit Bill',
      metaBills: [],
      total: this.props.total,
      paid_amount: this.props.paid_amount
    }

  }

  componentDidMount() {
    fetch('/get_meta_bills', {
      method: 'POST',
      body: JSON.stringify({schoolId: this.props.schoolId}),
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
        metaBills: response
      })
    })
  }

  handleClose = () => {
    this.setState({
      show: false
    })

    this.props.closeCallback()
  }

  handleSave = () => {
    var that = this

  }

  isMetaBillActive = (metaBillId) => {
    return true
  }

  metaBillChecked = (event) => {

  }

  render() {
    var that = this
    var metaBills = []
    if (this.state.metaBills) {
      metaBills = this.state.metaBills
    }

    return (
      <Modal show={this.state.show} size="lg">
        <Modal.Header>
          <Modal.Title>{this.state.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>User</Form.Label>
              <Form.Control type='text' disabled={true} value={this.state.user_name}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Bill Components</Form.Label>
              <ListGroup>
                {metaBills.map(function(mb) {
                  return  <ListGroup.Item>
                            <Col>{mb.name}</Col>
                            <Col>{mb.amount}</Col>
                            <Col><Form.Check onChange={that.metaBillChecked} checked={() => {that.isMetaBillActive(mb.id)}}/></Col>
                          </ListGroup.Item>
                })}
              </ListGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Total</Form.Label>
              <Form.Control type='text' disabled={true} value={this.state.total}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Paid</Form.Label>
              <Form.Control type='text' value={this.state.paid_amount}/>
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

