import React from "react"

import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

import ActiveBillManager from './ActiveBillManager.jsx'
import BillMetaManager from './BillMetaManager.jsx'
import SchoolSelector from './SchoolSelector.jsx'


export default class Billing extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedSchoolId: null
    }
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
      if (response.status == 200) {
        return response.json()
      }
      return null
    }).then((response)=>{
      if (response != null) {
        that.setState({
          klasses: response
        })
      }
    })
  }

  schoolSelected = (schoolId) => {
    this.setState({
      selectedSchoolId: schoolId
    })
  }

  render() {
    var that = this

    return (
      <div>
        <br />
        <Container>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Billing</Navbar.Brand>
            <Nav className="mr-auto">

            </Nav>
            <Nav>
              <SchoolSelector callback={this.schoolSelected} schoolId={this.state.selectedSchoolId}/>
            </Nav>
          </Navbar>

          <Tabs>
            <Tab title='Bill'>
              <BillMetaManager />
            </Tab>
            <Tab title='Published Bills'>
              <ActiveBillManager />
            </Tab>
          </Tabs>
        </Container>
      </div>
    )
  }
}
