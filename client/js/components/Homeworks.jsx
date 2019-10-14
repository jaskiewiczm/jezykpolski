import React from "react"
import IndividualHomework from './IndividualHomework.jsx'
import styles from './Homeworks.scss'

import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'


export default class Homeworks extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      homeworks: []
    }

    this.getHomeworks = this.getHomeworks.bind(this)
    this.getHomeworks()
  }

  getHomeworks() {
    var that = this
    fetch('/get_homeworks', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      return response.json()
    }).then((response)=>{
      that.setState({
        homeworks: response
      })
    })
  }

  deleteCallback = () => {
    this.getHomeworks()
  }

  render() {
    var that = this
    return (
      <Container>
        <br/>
        <Row>
          <Col></Col>
          <Col xs={12}>
            <ListGroup className={styles.homeworks}>
              {
                this.state.homeworks.map(function(key, index){
                  return <ListGroup.Item action key={index}><IndividualHomework dueDate={key.due_date} description={key.description} homeworkId={key.id} deleteCallback={that.deleteCallback}/></ListGroup.Item>
                })
              }
            </ListGroup>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    )
  }
}
