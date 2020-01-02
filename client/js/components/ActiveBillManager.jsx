import React from "react"
import { connect } from "react-redux";

import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

import SchoolSelector from './SchoolSelector.jsx'


class ActiveBillManager extends React.Component {
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
            <Navbar.Brand>Active Bills</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link onClick={that.add}>Add</Nav.Link>
            </Nav>
            <Nav>
              <SchoolSelector schoolId={this.props.selectedSchoolId}/>
            </Nav>
          </Navbar>
          <ListGroup>

          </ListGroup>
        </Container>
      </div>
    )
  }
}

export default connect(state => {
    return {
        selectedSchoolId: state.selectedSchoolId
    }
})(ActiveBillManager)