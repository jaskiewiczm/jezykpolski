import React from "react"

import IndividualUser from './IndividualUser.jsx'
import UserEditor from './UserEditor.jsx'
import SchoolSelector from './SchoolSelector.jsx'
import KlassSelector from './KlassSelector.jsx'

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

    var schoolId = localStorage.getItem('usersSelectedSchoolId')
    var klassId = localStorage.getItem('usersSelectedKlassId')

    this.state = {
      users: [],
      editMode: false,
      selectedSchoolId: schoolId,
      selectedKlassId: klassId
    }

    this.getUsers()
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

  schoolSelected = (schoolId) => {
    this.setState({
      selectedSchoolId: schoolId
    })

    localStorage.setItem('usersSelectedSchoolId', schoolId)
  }

  klassSelected = (klassId) => {
    this.setState({
      selectedKlassId: klassId
    }, this.getHomeworks)

    localStorage.setItem('usersSelectedKlassId', klassId)
  }

  render() {
    var that = this

    var editContent = this.state.editMode ? <UserEditor callback={this.closeEditor} title={'Add User'} schoolId={this.state.selectedSchoolId}/> : null

    var klassSelector = null
    if (this.state.selectedSchoolId != null) {
      klassSelector = <KlassSelector schoolId={this.state.selectedSchoolId} callback={this.klassSelected} klassId={this.state.selectedKlassId}/>
    }


    var body = null
    if (this.state.users.length > 0) {

      body = (<Row>
                <Col></Col>
                <Col xs={12}>
                  <ListGroup className={styles.homeworks}>
                    {
                      this.state.users.map(function(key, index){
                        return <ListGroup.Item action key={index}><IndividualUser roleCode={key.roleCode} userId={key.id} email={key.email} name={key.name} deleteCallback={that.deleteCallback} schoolId={that.state.selectedSchoolId}/></ListGroup.Item>
                      })
                    }
                  </ListGroup>
                </Col>
                <Col></Col>
              </Row>)

    } else {
      body = (<Row>
                <Col/>
                <Col xs={12}>
                  <ListGroup>
                    <ListGroup.Item>
                      Please select a school and class to view users.
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col/>
              </Row>)
    }


    return (
      <div>
        <br />
        <Container>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>User</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link onClick={that.add}>Add</Nav.Link>
            </Nav>
            <Nav>
              <SchoolSelector callback={this.schoolSelected} schoolId={this.state.selectedSchoolId}/>
            </Nav>
            &nbsp;
            <Nav>
              {klassSelector}
            </Nav>
          </Navbar>
          {body}
        </Container>
        {editContent}
      </div>
    )
  }
}
