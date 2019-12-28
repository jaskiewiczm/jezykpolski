import React from "react"
import { connect } from "react-redux";

import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Tab from 'react-bootstrap/Tab'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import ActiveBillManager from './ActiveBillManager.jsx'
import BillMetaManager from './BillMetaManager.jsx'
import SchoolSelector from './SchoolSelector.jsx'

import './Billing.scss'


class Billing extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    var that = this

    return (
      <div>
        <br />
        <Container>
          <Tab.Container id="left-tabs-example">
            <div className='billing_nav_bar'>
              <Nav variant="tabs" >
                <Nav.Item>
                  <Nav.Link eventKey="meta_bill_event_key">Bill Config</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="active_bill_event_key">Active Bills</Nav.Link>
                </Nav.Item>

                <div className='billing_school_selector'>
                  <SchoolSelector schoolId={this.props.selectedSchoolId}/>
                </div>
              </Nav>
            </div>

            <Tab.Content>
              <Tab.Pane eventKey="meta_bill_event_key">
                <BillMetaManager />
              </Tab.Pane>
              <Tab.Pane eventKey="active_bill_event_key">
                <ActiveBillManager />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </div>
    )
  }
}


export default connect(state => {
    return {
        selectedSchoolId: state.selectedSchoolId
    }
})(Billing)


