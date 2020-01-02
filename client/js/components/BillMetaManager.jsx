import React from "react"
import { connect } from "react-redux";
import swal from 'sweetalert';

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import Badge from 'react-bootstrap/Badge'

import SchoolSelector from './SchoolSelector.jsx'
import MetaBillEditor from './MetaBillEditor.jsx'

import './BillMetaManager.scss'


class BillMetaManager extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      metaBills: null,
      prevSchoolId: this.props.selectedSchoolId,
      showAddMetaBill: false
    }
  }

  componentDidMount() {
    if (this.props.selectedSchoolId != null && this.state.metaBills == null) {
      this.getMetaBills()
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

  addMetaBill = () => {
    this.setState({
      showAddMetaBill: true
    })
  }

  editMetaBill = (id) => {

  }

  deleteMetaBill = (id) => {
    var that = this

    swal({
      title: "Delete Bill Configuration?",
      text: "Are you sure you want to delete this bill configuration?",
      icon: "warning",
      buttons: {
        no: {
          text: 'No',
          value: false
        },
        yes: {
          text: 'Yes',
          value: true
        }
      }
    })
    .then((willDelete) => {
      if (willDelete === true) {
        fetch('/delete_meta_bill', {
          method: 'POST',
          body: JSON.stringify({metaBillId: id}),
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
              metaBills: null
            })
          }
        })
      }
    });
  }

  closeMetaBillEditor = () => {
    this.setState({
      showAddMetaBill: false
    })
  }

  render() {
    var that = this

    var metaBillEditor = null
    if (this.state.showAddMetaBill) {
      metaBillEditor = <MetaBillEditor closeCallback={this.closeMetaBillEditor}/>
    }

    var metabills = this.state.metaBills
    if (metabills == null) {
      metabills = []
    }

    return (
      <div>
        {metaBillEditor}
        <br />
        <Container>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Configuration</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link onClick={that.addMetaBill}>Add</Nav.Link>
            </Nav>
            <Nav>
              <SchoolSelector schoolId={this.props.selectedSchoolId}/>
            </Nav>
          </Navbar>
          <ListGroup>
            {metabills.map(function(mb){
              return  <ListGroup.Item key={mb.id}>
                        <Row>
                          <Col xs={1}><img className='billMetaManagerIcon' src='bill.svg'/></Col>
                          <Col xs={7} className='billMetaManagerName'>{mb.name}</Col>
                          <Col xs={2}><h3><Badge variant={mb.amount >= 0 ? 'success' : 'danger'}>{mb.amount >= 0 ? '+' : '-'}${mb.amount}</Badge></h3></Col>
                          <Col xs={1}><Image src="pencil.png" onClick={() => {that.editMetaBill(mb.id)}} /></Col>
                          <Col xs={1}><Image src="trash.png" onClick={() => {that.deleteMetaBill(mb.id)}} /></Col>
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