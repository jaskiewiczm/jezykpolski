import React from "react"
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Table from 'react-bootstrap/Table'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'

import SchoolSelector from './SchoolSelector.jsx'
import KlassSelector from './KlassSelector.jsx'
import Grade from './Grade.jsx'
import GradebookHomeworkHeader from './GradebookHomeworkHeader.jsx'

import {gradebook} from './Gradebook.scss'


export default class Gradebook extends React.Component {

  constructor(props) {
    super(props)

    var schoolId = localStorage.getItem('gradebookSelectedSchoolId')
    var klassId = localStorage.getItem('gradebookSelectedKlassId')

    this.state = {
      selectedSchoolId: schoolId,
      selectedKlassId: klassId,
      klasses: null,

      homeworks: [],
      grades: [],
      users: [],
      sortedHomeworkIds: [],
      gradingScale: [],

      emailDisabled: true
    }

    this.getGradingScale()
    if (klassId != null) {
      this.getGradebook()
    }
  }

  schoolSelected = (schoolId) => {
    localStorage.setItem('gradebookSelectedSchoolId', schoolId)
    localStorage.setItem('gradebookSelectedKlassId', null)

    this.setState({
      selectedSchoolId: schoolId,
      selectedKlassId: null
    }, this.getKlasses)
  }

  klassSelected = (klassId) => {
    this.setState({
      selectedKlassId: klassId,
      grades: [],
      users: [],
      sortedHomeworkIds: [],
      homeworks: []
    }, this.getGradebook)

    localStorage.setItem('gradebookSelectedKlassId', klassId)
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
      body: JSON.stringify({klassId: this.state.selectedKlassId}),
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
          emailDisabled: emailDisabled
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
      body: JSON.stringify({schoolId: this.state.selectedSchoolId}),
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
    if (this.state.selectedSchoolId != null) {
      klassSelector = <KlassSelector schoolId={this.state.selectedSchoolId} callback={this.klassSelected} klassId={this.state.selectedKlassId}/>
    }

    var gradebookDownloadUrl = 'download_gradebook/' + this.state.gradebookId
    var body = null
    if (this.state.selectedSchoolId != null && this.state.selectedKlassId != null) {
      body = (<Table responsive striped hover>
          <thead className='gradebook'>
            <tr>
              <th className='envelopeButtonParent'>
                <Button disabled={this.state.emailDisabled} variant={this.state.emailDisabled ? 'outline-info': 'danger'} onClick={this.sendEmails}>
                  <Image className='envelopeButton' src="envelope.svg" />
                </Button>
              </th>
              {this.state.homeworks.map(function(homework, index) {
                return <th key={index}><GradebookHomeworkHeader homework={homework}/></th>
              })}
            </tr>
          </thead>
          <tbody className='gradebook'>
            {this.state.users.map(function(user, index){
              return <tr key={index}>
                  <td>{user.name}</td>
                  {that.state.sortedHomeworkIds.map(function(homeworkId, hIndex){
                    return <td key={hIndex}><Grade gradeSetCallback={that.gradeSetCallback} userId={user.id} homeworkId={homeworkId} earnedGrade={that.getEarnedGrade(user.id, homeworkId)} gradingScale={that.state.gradingScale}/></td>
                  })}
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
              <SchoolSelector callback={this.schoolSelected} schoolId={this.state.selectedSchoolId}/>
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
