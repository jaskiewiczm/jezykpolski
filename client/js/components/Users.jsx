import React from "react"

import IndividualHomework from './IndividualUser.jsx'

import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import styles from './Homeworks.scss'


export default class Users extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      users: [],
      editMode: false
    }
  }

  getUsers() {
    var that = this
    fetch('/get_users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      return response.json()
    }).then((response)=>{
      that.setState({
        users: response
      })
    })
  }

  deleteCallback = () => {
    this.getUsers()
  }

  add = () => {
    this.setState({
      editMode: true
    })
  }

  closeEditor = () => {
    this.setState({
      editMode: false
    }, this.getUsers)
  }

  render() {
    var that = this

    var editContent = this.state.editMode ? <UserEditor callback={this.closeEditor} title={'Add User'}/> : null

    return (
      <div>
        <br />
        <Container>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>User</Navbar.Brand>
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
                    return <ListGroup.Item action key={index}><IndividualUser userId={key.id} name={key.name} deleteCallback={that.deleteCallback}/></ListGroup.Item>
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
