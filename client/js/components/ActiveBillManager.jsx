import React from "react"
import { connect } from "react-redux";

import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'

import SchoolSelector from './SchoolSelector.jsx'
import ActiveBillEditor from './ActiveBillEditor.jsx'


class ActiveBillManager extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      bills: null,
      showBillEditor: false,
      prevSchoolId: null
    }
  }

  componentDidMount() {
    if (this.props.selectedSchoolId != null && this.state.bills == null) {
      this.getBills()
    }
  }

  componentDidUpdate() {
    if (this.props.selectedSchoolId != null && this.state.bills == null) {
      this.getBills()
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.selectedSchoolId !== state.prevSchoolId) {
      return {
        prevSchoolId: props.selectedSchoolId,
        bills: null
      };
    }
    return null;
  }

  getBills() {
    var that = this
    fetch('/get_active_bills', {
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
          bills: response
        })
      }
    })
  }

  addBill = () => {
    this.setState({
      showBillEditor: true
    })
  }

  closeBillEditor = () => {
    this.setState({
      showBillEditor: false
    })
  }

  editBill = (billId) => {
    this.setState({
      showBillEditor: true
    })
  }

  deleteBill = (billId) => {

  }

  render() {
    var that = this
    var editor = null
    if (this.state.showBillEditor) {
      editor = <ActiveBillEditor closeCallback={this.closeBillEditor}/>
    }

    var bills = this.state.bills
    if (bills == null) {
      bills = []
    }

    return (
      <div>
        {editor}
        <br />
        <Container>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Active Bills</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link onClick={that.addBill}>Add</Nav.Link>
            </Nav>
            <Nav>
              <SchoolSelector schoolId={this.props.selectedSchoolId}/>
            </Nav>
          </Navbar>
          <ListGroup>
            {bills.map(function(bill){
              return  <ListGroup.Item>
                        <Row>
                          <Col xs={8}>{bill.user_name}</Col>
                          <Col xs={1}>{bill.paid_amount}</Col>
                          <Col xs={1}>{bill.total}</Col>
                          <Col xs={1}><Image src="pencil.png" onClick={() => {that.editBill(bill.id)}} /></Col>
                          <Col xs={1}><Image src="trash.png" onClick={() => {that.deleteBill(bill.id)}} /></Col>
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
})(ActiveBillManager)