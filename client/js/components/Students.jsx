import React from "react"

import IndividualHomework from './IndividualStudent.jsx'

import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import styles from './Homeworks.scss'


export default class Students extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      students: [],
      editMode: false
    }
  }

  getStudents() {
    var that = this
    fetch('/get_students', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      return response.json()
    }).then((response)=>{
      that.setState({
        students: response
      })
    })
  }

  deleteCallback = () => {
    this.getStudents()
  }

  add = () => {
    this.setState({
      editMode: true
    })
  }

  closeEditor = () => {
    this.setState({
      editMode: false
    }, this.getStudents())
  }

  render() {
    var that = this

    var editContent = this.state.editMode ? <StudentEditor callback={this.closeEditor} title={'Add Student'}/> : null

    return (
      <div>
        <br />
        <Container>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Student</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link onClick={that.add}>Add</Nav.Link>
            </Nav>
          </Navbar>
          <Row>
            <Col></Col>
            <Col xs={12}>
              <ListGroup className={styles.homeworks}>
                {
                  this.state.students.map(function(key, index){
                    return <ListGroup.Item action key={index}><IndividualStudent studentId={key.id} name={key.name} deleteCallback={that.deleteCallback}/></ListGroup.Item>
                  })
                }
              </ListGroup>
            </Col>
            <Col></Col>
          </Row>
        </Container>
        {editContent}
      </div>
    )
  }
}
