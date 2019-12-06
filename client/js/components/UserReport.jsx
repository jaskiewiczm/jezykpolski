import React from "react"

import { LineChart, PieChart } from 'react-chartkick'
import 'chart.js'

import Container from 'react-bootstrap/Container'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'

import "./UserReport.scss"


export default class UserReport extends React.Component {

  constructor(props) {
    super(props)

    this.getUsers()

    this.state = {
      userData: null
    }
  }

  getUsers = () => {
    var that = this
    fetch('/get_user_report', {
      method: 'GET',
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
          userData: response
        })
      }
    })
  }

  getKlassChartData = (klass) => {
    var data = [{'name': 'Grades', 'data': null}]

    var dataObj = {}
    klass.homeworks.forEach(function(homework){
      dataObj[homework.due_date] = '+' + homework.grade
    })

    data[0]['data'] = dataObj

    return data
  }

  render() {
    var that = this

    var body = (<div />)
    if (this.state.userData != null) {
      body = (<div>
                <Accordion>
                  {this.state.userData.map(function(klass){
                    return  <Card key={klass.id}>
                              <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">{klass.name}</Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                  <Row>
                                    <Col>
                                      <ListGroup>
                                        {klass.homeworks.map(function(homework){
                                          return  <ListGroup.Item key={homework.id}>
                                                    <Row>
                                                      <Col xs={8}>{homework.title}</Col>
                                                      <Col xs={1}>{homework.grade}</Col>
                                                    </Row>
                                                  </ListGroup.Item>
                                        })}
                                      </ListGroup>
                                    </Col>
                                    <Col>
                                      <LineChart key={klass.id} data={that.getKlassChartData(klass)} download={true}/>
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </Accordion.Collapse>
                            </Card>
                  })}
                </Accordion>
              </div>)
    }

    return (
      <div>
        <br />
        <Container className='userReport'>
          {body}
        </Container>
      </div>
    )
  }
}
