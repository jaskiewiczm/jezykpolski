import React from "react"
import { connect } from "react-redux";

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'

import SchoolSelector from './SchoolSelector.jsx'


class BillMetaManager extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      metaBills: null,
      prevSchoolId: null
    }
  }

  componentDidUpdate() {
    if (this.props.selectedSchoolId != null && this.state.metaBills == null) {
      this.getMetaBills()
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.selectedSchoolId !== state.prevSchoolId) {
      return {
        prevSchoolId: props.selectedSchoolId,
        metaBills: null
      };
    }
    return null;
  }

  getMetaBills() {
    var that = this
    fetch('/get_meta_bills', {
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
          metaBills: response
        })
      }
    })
  }

  editUser = (id) => {

  }

  deleteUser = (id) => {

  }

  render() {
    var that = this

    var metabills = this.state.metaBills
    if (metabills == null) {
      metabills = []
    }
    return (
      <div>
        <br />
        <Container>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Configuration</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link onClick={that.add}>Add</Nav.Link>
            </Nav>
            <Nav>
              <SchoolSelector schoolId={this.props.selectedSchoolId}/>
            </Nav>
          </Navbar>
          <ListGroup>
            {metabills.map(function(mb){
              return  <ListGroup.Item key={mb.id}>
                        <Row>
                          <Col>{mb.name}</Col>
                          <Col>{mb.amount >= 0 ? '+' : '-'}${mb.amount}</Col>
                          <Col xs={1}><Image src="pencil.png" onClick={() => {that.editUser(mb.id)}} /></Col>
                          <Col xs={1}><Image src="trash.png" onClick={() => {that.deleteUser(mb.id)}} /></Col>
                        </Row>
                      </ListGroup.Item>
            })}
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
})(BillMetaManager)