import React from "react"

import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Tab from 'react-bootstrap/Tab'

import ActiveBillManager from './ActiveBillManager.jsx'
import BillMetaManager from './BillMetaManager.jsx'
import SchoolSelector from './SchoolSelector.jsx'


export default class Billing extends React.Component {

  constructor(props) {
    super(props)
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
            <Nav.Item>
              <Nav.Link eventKey="meta_bill_event_key">Meta Bill</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="active_bill_event_key">Active Bill</Nav.Link>
            </Nav.Item>
            </Nav>
            <Nav>
              <SchoolSelector schoolId={this.props.selectedSchoolId}/>
            </Nav>
          </Navbar>
          <Tab.Content>
            <Tab.Pane eventKey="meta_bill_event_key">
              <BillMetaManager />
            </Tab.Pane>
            <Tab.Pane eventKey="active_bill_event_key">
              <ActiveBillManager />
            </Tab.Pane>
          </Tab.Content>
        </Container>
      </div>
    )
  }
}

