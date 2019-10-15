import React from "react"
import IndividualHomework from './IndividualHomework.jsx'
import SchoolSelector from './SchoolSelector.jsx'
//import KlassSelector from './KlassSelector.jsx'
import styles from './Homeworks.scss'

import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'


export default class Homeworks extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      homeworks: [],
      editMode: false,
      selectedSchoolId: null,
      selectedKlassId: null
    }

    this.getHomeworks = this.getHomeworks.bind(this)
    this.getHomeworks()
  }

  getHomeworks() {
    var that = this
    fetch('/get_homeworks', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      return response.json()
    }).then((response)=>{
      that.setState({
        homeworks: response
      })
    })
  }

  deleteCallback = () => {
    this.getHomeworks()
  }

  add = () => {
    this.setState({
      editMode: true
    })
  }

  closeEditor = () => {
    this.setState({
      editMode: false
    }, this.getHomeworks())
  }

  schoolSelected = (schoolId) => {
    this.setState({
      selectedSchoolId: schoolId
    })
  }

  klassSelected = (klassId) => {
    this.setState({
      selectedKlassId: klassId
    })
  }

  render() {
    var that = this

    var editContent = this.state.editMode ? <HomeworkEditor callback={this.closeEditor} title={'Add Homework'}/> : null

    //<SchoolSelector callback={this.schoolSelected}/>
    //<KlassSelector schoolId={this.state.selectedSchoolId} callback={this.klassSelected}/>

    return (
      <div>
        <br />
        <Container>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Homework</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link onClick={that.add}>Add</Nav.Link>
            </Nav>
            <Nav>

            </Nav>
            <Nav>

            </Nav>
          </Navbar>
          <Row>
            <Col></Col>
            <Col xs={12}>
              <ListGroup className={styles.homeworks}>
                {
                  this.state.homeworks.map(function(key, index){
                    return <ListGroup.Item action key={index}><IndividualHomework dueDate={key.due_date} description={key.description} homeworkId={key.id} deleteCallback={that.deleteCallback}/></ListGroup.Item>
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
