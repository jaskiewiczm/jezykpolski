import React from "react"
import { connect } from "react-redux";

import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Table from 'react-bootstrap/Table'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'

import SchoolSelector from './SchoolSelector.jsx'
import KlassSelector from './KlassSelector.jsx'
import Grade from './Grade.jsx'
import GradebookHomeworkHeader from './GradebookHomeworkHeader.jsx'
import FinalGrade from './FinalGrade.jsx'
import getActivityTypes from '../helpers/activity_types.jsx'

import {gradebook} from './Gradebook.scss'


class Gradebook extends React.Component {

  constructor(props) {    
    super(props)
    var that = this

    this.state = {
      klasses: null,
      homeworks: null,
      grades: null,
      users: null,
      sortedHomeworkIds: null,
      gradingScale: null,
      emailDisabled: true,
      prevSchoolId: null,
      prevKlassId: null,
      finalGrades: null,
      activityTypes: null
    }

    this.getGradingScale()
    getActivityTypes(null, function(activityTypes){that.setState({activityTypes: activityTypes})})
  }

  componentDidUpdate() {
    if (this.props.selectedSchoolId != null && this.props.selectedKlassId != null && this.state.grades == null) {
      this.getGradebook()
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.selectedSchoolId != state.prevSchoolId || props.selectedKlassId != state.prevKlassId) {
      return {
        homeworks: null,
        grades: null,
        sortedHomeworkIds: null,
        prevSchoolId: props.selectedSchoolId,
        prevKlassId: props.selectedKlassId
      }
    }

    return null;
  }

  gradeSetCallback = () => {
    this.setState({
      emailDisabled: false
    })
  }

  getGradebook = () => {
    var that = this
    fetch('/get_gradebook', {
      method: 'POST',
      body: JSON.stringify({klassId: this.props.selectedKlassId}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response) => {
      if (response.status == 200) {
        return response.json()
      }
      return null
    }).then((response) => {
      if (response != null) {
        var emailDisabled = response.grades.find(function(grade){ return grade.email == 'pending' }) == null

        this.setState({
          grades: response.grades,
          homeworks: response.homeworks,
          users: response.users,
          sortedHomeworkIds: response.homeworks.map(function(item){ return item.id }),
          gradebookId: response.gradebook_id,
          emailDisabled: emailDisabled,
          finalGrades: response.final_grades

        })
      }
    })
  }

  getGradingScale() {
    var that = this
    fetch('/get_grading_scale', {
      method: 'POST',
      body: JSON.stringify({}),
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
          gradingScale: response.scale
        })
      }
    })
  }

  getKlasses() {
    var that = this
    fetch('/get_klasses', {
      method: 'POST',
      body: JSON.stringify({schoolId: this.props.selectedSchoolId}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      return response.json()
    }).then((response)=>{
      that.setState({
        klasses: response
      })
    })
  }

  getEarnedGrade = (userId, homeworkId) => {
    return this.state.grades.find(function(earnedGrade){
      return earnedGrade.user_id == userId && earnedGrade.homework_id == homeworkId
    })
  }

  sendEmails = () => {
    fetch('/send_grade_emails', {
      method: 'POST',
      body: JSON.stringify({gradebookId: this.state.gradebookId}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    })

    var grades = this.state.grades
    grades.forEach(grade => {
      grade.email = ''
    })

    this.setState({
      grades: grades,
      emailDisabled: true
    })
  }

  render() {
    var that = this

    var klassSelector = null
    if (this.props.selectedSchoolId != null) {
      klassSelector = <KlassSelector schoolId={this.props.selectedSchoolId} klassId={this.props.selectedKlassId}/>
    }

    var homeworks = []
    if (this.state.homeworks != null) {
      homeworks = this.state.homeworks
    }

    var users = []
    if (this.state.users != null) {
      users = this.state.users
    }

    var sortedHomeworkIds = []
    if (this.state.sortedHomeworkIds != null) {
      sortedHomeworkIds = this.state.sortedHomeworkIds
    }

    var gradebookDownloadUrl = 'download_gradebook/' + this.state.gradebookId
    var body = null

    if (this.props.selectedSchoolId != null && this.props.selectedKlassId != null) {
      body = (<Table responsive striped hover className='gradebookTable'>
          <thead className='gradebook'>
            <tr>
              <th className='envelopeButtonParent'>
                <Button disabled={this.state.emailDisabled} variant={this.state.emailDisabled ? 'outline-info': 'danger'} onClick={this.sendEmails}>
                  <Image className='envelopeButton' src="envelope.svg" />
                </Button>
              </th>
              {homeworks.map(function(homework, index) {
                return <th key={homework.id}><GradebookHomeworkHeader homework={homework}/></th>
              })}
              <th>Final</th>
            </tr>
          </thead>
          <tbody className='gradebook'>
            {users.map(function(user, index){
              return <tr key={user.id}>
                  <td>{user.name}</td>
                  {sortedHomeworkIds.map(function(homeworkId, hIndex){
                    return <td key={homeworkId}><Grade gradeSetCallback={that.gradeSetCallback} userId={user.id} homeworkId={homeworkId} earnedGrade={that.getEarnedGrade(user.id, homeworkId)} gradingScale={that.state.gradingScale}/></td>
                  })}
                  <td>
                    <FinalGrade gradeObj={that.state.finalGrades[user.id]} activityTypes={that.state.activityTypes} />
                  </td>
                </tr>
            })}            
          </tbody>
        </Table>)
    }

    return (
      <div>
        <br />
        <Container className="gradebookContainer">
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Gradebook</Navbar.Brand>
            <Nav className="mr-auto">
              <a className='exportLink' href={gradebookDownloadUrl}>Export</a>
            </Nav>
            <Nav>
              <SchoolSelector schoolId={this.props.selectedSchoolId}/>
            </Nav>
            &nbsp;
            <Nav>
              {klassSelector}
            </Nav>
          </Navbar>
          {body}
        </Container>
      </div>
    )
  }
}


export default connect(state => {
    return {
        selectedSchoolId: state.selectedSchoolId,
        selectedKlassId: state.selectedKlassId
    }
})(Gradebook)

