import React from "react"

import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Image from 'react-bootstrap/Image'

import UserSearch from './UserSearch.jsx'

import styles from './UserEnrollment.scss'

export default class UserEnrollment extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      users: [],
      students: [],
      searchValue: null
    }

    this.getEnrolledUsers()
    this.getStudents()
  }

  getStudents = () => {
    var that = this
    fetch('/students', {
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
      if (response != null) {
        that.setState({
          students: response
        })
      }
    })
  }

  getEnrolledUsers = () => {
    var that = this
    fetch('/get_enrolled_users', {
      method: 'POST',
      body: JSON.stringify({klassId: this.props.klassId}),
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
          users: response
        })
      }
    })
  }

  addUser = () => {
    var that = this
    var searchValue = this.state.searchValue
    var user = this.state.students.find((user) => {return user.name == searchValue})

    if (user != null) {
      fetch('/add_enrollment', {
        method: 'POST',
        body: JSON.stringify({userId: user.id, klassId: this.props.klassId}),
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }).then((response)=>{
        if (response.status == 201) {
          return response.json()
        }
        return null
      }).then((response)=>{
        if (response != null) {
          var users = that.state.users
          users.unshift(user)
          that.setState({
            users: users
          })
        }
      })
    }
  }

  deleteUser = (user) => {
    var that = this
    fetch('/delete_enrollment', {
      method: 'POST',
      body: JSON.stringify({userId: user.id, klassId: this.props.klassId}),
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
        var users = this.state.users
        that.setState({
          users: users.filter((suser) => {return suser.id != user.id})
        })
      }
    })

  }

  selectedCallback = (value) => {
    this.setState({
      searchValue: value
    })
  }

  clearCallback = () => {
    this.setState({
      searchValue: null
    })
  }

  render() {
    var that = this

    return (
      <div>
        <Row>
          <Col>
            <div style={{display: 'flex'}}>
              <div className='userEnrollmentUserSearch'>
                <UserSearch users={this.state.students} selectedCallback={this.selectedCallback} clearCallback={this.clearCallback}/>
              </div>
              <div className='userEnrollmentButton'>
                <Button variant={'light'} onClick={this.addUser}>Add</Button>
              </div>
            </div>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <ListGroup>
              {this.state.users.map(function(user){
                return (<ListGroup.Item key={user.id}>
                    <Row>
                      <Col xs={10}>{user.name}</Col>
                      <Col xs={1}><Image src="trash.png" onClick={function(){that.deleteUser(user)}} /></Col>
                    </Row>
                  </ListGroup.Item>)
              })}
            </ListGroup>
          </Col>
        </Row>
      </div>
    )
  }
}
