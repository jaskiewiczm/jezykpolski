import React from "react"
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import SchoolSelector from './SchoolSelector.jsx'
import KlassSelector from './KlassSelector.jsx'

import styles from './Homeworks.scss'


export default class Gradebook extends React.Component {

  constructor(props) {
    super(props)

    var schoolId = localStorage.getItem('gradebookSelectedSchoolId')
    var klassId = localStorage.getItem('gradebookSelectedKlassId')

    this.state = {
      selectedSchoolId: schoolId,
      selectedKlassId: klassId,
      klasses: null
    }
  }

  klassSelected = (klassId) => {
    this.setState({
      selectedKlassId: klassId
    }, this.getHomeworks)

    localStorage.setItem('gradebookSelectedKlassId', klassId)
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

  schoolSelected = (schoolId) => {
    this.setState({
      selectedSchoolId: schoolId
    })

    localStorage.setItem('gradebookSelectedSchoolId', schoolId)
    this.getKlasses()
  }

  render() {
    var that = this

    var klassSelector = null
    if (this.state.selectedSchoolId != null) {
      klassSelector = <KlassSelector schoolId={this.state.selectedSchoolId} callback={this.klassSelected} klassId={this.state.selectedKlassId}/>
    }

    return (
      <div>
        <br />
        <Container>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Gradebook</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link onClick={that.add}></Nav.Link>
            </Nav>
            <Nav>
              <SchoolSelector callback={this.schoolSelected} schoolId={this.state.selectedSchoolId}/>
            </Nav>
            &nbsp;
            <Nav>
              {klassSelector}
            </Nav>
          </Navbar>

        </Container>
      </div>
    )
  }
}
