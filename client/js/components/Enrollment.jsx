import React from "react"

import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import styles from './Homeworks.scss'


export default class Enrollment extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      klasses: [],
      selectedSchoolId: this.props.schoolId,
      selectedKlassId: null,
      show: true,
      userId: this.props.userId
    }

    this.getKlasses()
  }

  getKlasses = () => {
    var that = this
    fetch('/get_klasses', {
      method: 'POST',
      body: JSON.stringify({schoolId: this.state.selectedSchoolId}),
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
        that.setState({
          klasses: response
        })
      }
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

    if (this.state.userId) {
      fetch('/add_enrollment', {
        method: 'POST',
        body: JSON.stringify({userId: this.state.userId, klassId: this.state.selectedKlassId}),
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }).then((response)=>{
        if (response.status == 200) {
          var klass = this.state.klasses.find((member) => {
            return member.id == this.state.selectedKlassId
          })
          this.props.callback(klass)
        }
      })
    }
  }

  klassSelected = (key) => {
    this.setState({
      selectedKlassId: parseInt(key)
    })
  }

  render() {
    var that = this

    return (
      <Modal show={this.state.show}>
        <Modal.Header>
          <Modal.Title>Add New Enrollment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup onSelect={that.klassSelected}>
            {
              this.state.klasses.map(function(key, index){
                return <ListGroup.Item eventKey={key.id} key={index} variant={key.id == that.state.selectedKlassId ? 'primary' : ''} action >{key.name}</ListGroup.Item>
              })
            }
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleSave}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
