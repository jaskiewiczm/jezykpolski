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
import Badge from 'react-bootstrap/Badge'

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
      dataObj[homework.due_date] = homework.value
    })

    data[0]['data'] = dataObj

    return data
  }

  visualizationToVariant = (variant) => {
    if (variant == 'none') {
      return 'secondary'
    } else if (variant == 'bad') {
      return 'danger'
    } else if (variant == 'medium') {
      return 'warning'
    } else if (variant == 'good') {
      return 'success'
    }
    return 'secondary'
  }

  renderUser = (userObj) => {
    var that = this
    return <ListGroup.Item>
        <Row className='userReportNameRow'>
          <Col><h1>{userObj.user.name}</h1></Col>
        </Row>
        {userObj.klasses.map(function(klass){
          return <Row key={klass.id}>
            <Col>
              <Container>
                <Row className='userReportKlassNameRow'>
                  <Col>
                    <h2>{klass.name}</h2>
                  </Col>
                </Row>
                <Row className='userReportHomeworkRow'>
                  <Col>
                    <ListGroup>{that.renderKlass(klass)}</ListGroup>
                  </Col>
                  <Col>
                    <Container>
                      <Row>Grades over Time</Row>
                      <Row>
                        <LineChart key={klass.id} data={that.getKlassChartData(klass)} download={true}/>
                      </Row>
                    </Container>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        })}
      </ListGroup.Item>
  }

  renderKlass = (klass) => {
    var that = this

    return <div>
        {klass.homeworks.map(function(homework){
          return  <ListGroup.Item key={homework.id}>
                    <Row>
                      <Col xs={10}>
                        <h3>{homework.title}</h3>
                      </Col>
                      <Col xs={1}>
                        <h3>
                          <Badge variant={that.visualizationToVariant(homework.visualization)}>{homework.grade}</Badge>
                        </h3>
                      </Col>
                    </Row>
                  </ListGroup.Item>
        })}
      </div>
  }

  render() {
    var that = this

    var body = (<div />)
    if (this.state.userData != null) {
      body = (<div>
                {this.state.userData.map(function(userObj){
                  return <div>{that.renderUser(userObj)}</div>
                })}
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
