import React from "react"
import { connect } from "react-redux";

import SchoolSelector from './SchoolSelector.jsx'
import KlassSelector from './KlassSelector.jsx'
import IndividualKlass from './IndividualKlass.jsx'
import KlassEditor from './KlassEditor.jsx'

import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import styles from './Homeworks.scss'


class Klasses extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      klasses: null,
      editMode: false,
      prevSchoolId: null
    }
  }

  componentDidUpdate() {
    if (this.props.selectedSchoolId != null && this.state.klasses == null) {
      this.getKlasses()
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.selectedSchoolId !== state.prevSchoolId) {
      return {
        klasses: null,
        editMode: false,
        prevSchoolId: props.selectedSchoolId,
      };
    }
    return null;
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

  deleteCallback = () => {
    this.getKlasses()
  }

  add = () => {
    this.setState({
      editMode: true
    })
  }

  closeEditor = () => {
    this.setState({
      editMode: false
    }, this.getKlasses)
  }

  render() {
    var that = this

    var editContent = this.state.editMode ? <KlassEditor callback={this.closeEditor} title={'Add Class'} schoolId={this.state.selectedSchoolId}/> : null

    var body = null
    if (this.state.klasses != null && this.state.klasses.length > 0) {

      body = (<Row>
                <Col></Col>
                <Col xs={12}>
                  <ListGroup className={styles.homeworks}>
                    {
                      this.state.klasses.map(function(key, index){
                        return  <ListGroup.Item action key={key.id}>
                                  <IndividualKlass klass={key}
                                                   schoolId={that.state.selectedSchoolId}
                                                   klassId={key.id}
                                                   name={key.name}
                                                   deleteCallback={that.deleteCallback}/>
                                </ListGroup.Item>
                      })
                    }
                  </ListGroup>
                </Col>
                <Col></Col>
              </Row>)

    } else {
      body = (<Row>
                <Col/>
                <Col xs={12}>
                  <ListGroup>
                    <ListGroup.Item>
                      Please select a school to view classes.
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col/>
              </Row>)
    }


    return (
      <div>
        <br />
        <Container>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Classes</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link onClick={that.add}>Add</Nav.Link>
            </Nav>
            <Nav>
              <SchoolSelector callback={this.schoolSelected} schoolId={this.state.selectedSchoolId}/>
            </Nav>
          </Navbar>
          {body}
        </Container>
        {editContent}
      </div>
    )
  }
}


export default connect(state => {
    return {
        selectedSchoolId: state.selectedSchoolId
    }
})(Klasses)

