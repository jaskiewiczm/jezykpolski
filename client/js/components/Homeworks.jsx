import React from "react"
import { connect } from "react-redux";
import IndividualHomework from './IndividualHomework.jsx'
import SchoolSelector from './SchoolSelector.jsx'
import KlassSelector from './KlassSelector.jsx'
import HomeworkEditor from './HomeworkEditor.jsx'
import styles from './Homeworks.scss'

import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import g_roles from './GlobalRoles.jsx'


class Homeworks extends React.Component {

  constructor(props) {
    super(props)

    var schoolId = localStorage.getItem('homeworksSelectedSchoolId')
    var klassId = localStorage.getItem('homeworksSelectedKlassId')

    this.state = {
      homeworks: [],
      editMode: false,
      selectedSchoolId: schoolId,
      selectedKlassId: klassId
    }
  }

  componentDidMount() {
    if (this.state.selectedSchoolId != null && this.state.selectedKlassId != null) {
      this.getHomeworks()
    }
  }

  getHomeworks = () => {
    var that = this
    fetch('/get_homeworks', {
      method: 'POST',
      body: JSON.stringify({
        schoolId: this.state.selectedSchoolId,
        klassId: this.state.selectedKlassId
      }),
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
          homeworks: response
        })
      }
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

    localStorage.setItem('homeworksSelectedSchoolId', schoolId)
  }

  klassSelected = (klassId) => {
    this.setState({
      selectedKlassId: klassId
    }, this.getHomeworks)

    localStorage.setItem('homeworksSelectedKlassId', klassId)
  }

  render() {
    var that = this

    var editContent = this.state.editMode ? <HomeworkEditor callback={this.closeEditor} title={'Add Homework'} selectedKlassId={this.state.selectedKlassId}/> : null

    var klassSelector = null
    if (this.state.selectedSchoolId != null) {
      klassSelector = <KlassSelector schoolId={this.state.selectedSchoolId} callback={this.klassSelected} klassId={this.state.selectedKlassId}/>
    }

    var addButton = <Nav className="mr-auto" />
    if (g_roles.containsRole('teacher', this.props.roles)
        || g_roles.containsRole('admin', this.props.roles)
        || g_roles.containsRole('school_admin', this.props.roles)) {
      addButton = <Nav className="mr-auto">
                    <Nav.Link onClick={that.add}>Add</Nav.Link>
                  </Nav>
    }

    var body = null
    if (this.state.homeworks.length > 0) {
      body = (<Row>
            <Col></Col>
            <Col xs={12}>
              <ListGroup className={styles.homeworks}>
                {
                  this.state.homeworks.map(function(key, index){
                    return <ListGroup.Item action key={key.id}><IndividualHomework dueDate={key.due_date} description={key.description} homeworkId={key.id} homeworkTitle={key.title} deleteCallback={that.deleteCallback}/></ListGroup.Item>
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
                      Please select a school and class to view homework.
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
            <Navbar.Brand>Homework</Navbar.Brand>
            {addButton}
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

export default connect(state => {
    return {
        roles: state.myRoles
    }
})(Homeworks)
