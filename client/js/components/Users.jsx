import React from "react"
import { connect } from "react-redux";

import IndividualUser from './IndividualUser.jsx'
import UserEditor from './UserEditor.jsx'
import SchoolSelector from './SchoolSelector.jsx'
import KlassSelector from './KlassSelector.jsx'
import UserSearch from './UserSearch.jsx'

import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import styles from './Homeworks.scss'


class Users extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      masterUsers: null,
      visibleUsers: null,
      editMode: false,
      prevSchoolId: null
    }

    if (this.props.selectedSchoolId != null && this.state.masterUsers == null) {
      this.getMasterUsers()
    }
  }

  componentDidUpdate() {
    if (this.props.selectedSchoolId != null && this.state.masterUsers == null) {
      this.getMasterUsers()
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.selectedSchoolId !== state.prevSchoolId) {
      return {
        prevSchoolId: props.selectedSchoolId,
        masterUsers: null,
        visibleUsers: null,
        editMode: false
      };
    }
    return null;
  }

  getMasterUsers() {
    var that = this
    fetch('/get_users', {
      method: 'POST',
      body: JSON.stringify({schoolId: this.props.selectedSchoolId}),
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
          masterUsers: response,
          visibleUsers: response
        })
      }
    })
  }

  deleteCallback = () => {
    this.getMasterUsers()
  }

  add = () => {
    if (this.props.selectedSchoolId) {
      this.setState({
        editMode: true
      })
    }
  }

  closeEditor = () => {
    this.setState({
      editMode: false
    }, this.getMasterUsers)
  }

  userSelectedCallback = (name) => {
    var visibleUsers = [this.state.masterUsers.find(user => {return user.name == name})]
    this.setState({
      visibleUsers: visibleUsers
    })
  }

  clearSearchCallback = () => {
    this.setState({
      visibleUsers: this.state.masterUsers
    })
  }

  render() {
    var that = this

    var editContent = this.state.editMode ? <UserEditor masterUsers={this.state.masterUsers} callback={this.closeEditor} title={'Add User'} schoolId={this.props.selectedSchoolId}/> : null

    var body = null
    var userSearch = null
    if (this.state.visibleUsers != null && this.state.visibleUsers.length > 0) {
      body = (<Row>
                <Col></Col>
                <Col xs={12}>
                  <ListGroup className={styles.homeworks}>
                    {
                      this.state.visibleUsers.map(function(key, index){
                        return <ListGroup.Item action key={key.id}><IndividualUser user={key} masterUsers={that.state.masterUsers} userRoles={key.userRoles} userId={key.id} email={key.email} name={key.name} deleteCallback={that.deleteCallback} schoolId={that.props.selectedSchoolId}/></ListGroup.Item>
                      })
                    }
                  </ListGroup>
                </Col>
                <Col></Col>
              </Row>)

      userSearch =  (<UserSearch users={this.state.masterUsers} clearCallback={this.clearSearchCallback} selectedCallback={this.userSelectedCallback} />)
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
              {userSearch}
            </Nav>
            &nbsp;&nbsp;&nbsp;
            <Nav>
              <SchoolSelector schoolId={this.props.selectedSchoolId}/>
            </Nav>


          </Navbar>
          {body}
        </Container>
        {editContent}
      </div>
    )
  }
}

export default connect(state => {
    return {
        selectedSchoolId: state.selectedSchoolId
    }
})(Users)
