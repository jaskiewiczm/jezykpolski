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
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import "./UserReport.scss"
import UserReportComparison from "./UserReportComparison.jsx"
import getActivityTypes from '../helpers/activity_types.jsx'
import ActivityGradeDistribution from './ActivityGradeDistribution.jsx'


export default class UserReport extends React.Component {

  constructor(props) {
    super(props)

    this.getUsers()

    this.state = {
      userData: null,
      activityTypes: {},
      klassIndividualDistributions: {}
    }    
  }

  getActivityTypes = () => {
    var that = this
    if (this.state.userData) {
      this.state.userData.forEach(function(userObj) {
        userObj.klasses.forEach(function(klass) {
          getActivityTypes( {klassId: klass.id}, 
                            function(activityTypes){
                              var at = that.state.activityTypes
                              at[klass.id] = activityTypes
                              that.setState({activityTypes: at})
                            }
                          )
        })        
      })
    }    
  }

  getKlassActivityDistributions = (klassId) => {
    var that = this
    fetch('/calculate_individual_activity_distributions', {
      method: 'POST',
      body: JSON.stringify({klassId: klassId}),
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
        var klassIndividualDistributions = that.state.klassIndividualDistributions
        klassIndividualDistributions[klassId] = response
        that.setState({
          klassIndividualDistributions: klassIndividualDistributions
        })
      }
    })
  }

  postUserFetch = () => {
    var that = this
    this.getActivityTypes()
    this.state.userData.forEach(function(userObj) {
      userObj.klasses.forEach(function(klass){
        that.getKlassActivityDistributions(klass.id)    
      })      
    })    
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
        }, that.postUserFetch)
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
         
              <Row className='userReportKlassNameRow'>
                <Col>
                  <h2>{klass.name}</h2>
                </Col>
              </Row>
              <Row className='userReportHomeworkRow'>
                <Col>
                  <Card className='userReportCard'>
                    <Card.Title className='userReportCardTitle'>Activities</Card.Title>
                    <Card.Body>
                      <ListGroup>{that.renderKlass(klass)}</ListGroup>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card className='userReportCard'>
                    <Card.Title className='userReportCardTitle'>Grade Breakdown</Card.Title>
                    <Card.Body>                                                
                      <UserReportComparison activityTypes={that.state.activityTypes[klass.id]} klass={klass} user={userObj.user}/>                        
                    </Card.Body>
                  </Card>
                  <br />
                  <Card className='userReportCard'>
                    <Card.Title className='userReportCardTitle'>Grades over Time</Card.Title>
                    <Card.Body>
                      <LineChart key={klass.id} data={that.getKlassChartData(klass)} download={true}/>
                    </Card.Body>
                  </Card>                        
                </Col>
              </Row>
              
            </Col>
          </Row>
        })}
      </ListGroup.Item>
  }

  renderKlass = (klass) => {
    var that = this
    var klassIndividualDistributions = null
    if (this.state.klassIndividualDistributions) {
      klassIndividualDistributions = this.state.klassIndividualDistributions[klass.id]
    }

    return <div>
        {klass.homeworks.map(function(homework){
          return  <ListGroup.Item key={homework.id}>
                    <Row>
                      <Col xs={10}>
                        <h3>{homework.title}</h3>
                      </Col>
                      <Col xs={1}>
                        <h3>
                          <OverlayTrigger placement='right' overlay={<Tooltip><ActivityGradeDistribution distribution={klassIndividualDistributions == null ? null : klassIndividualDistributions[homework.id]}/></Tooltip>}>
                            <Badge variant={that.visualizationToVariant(homework.visualization)}>
                              {homework.grade}
                            </Badge>
                          </OverlayTrigger>
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
                  return <div key={userObj.id}>{that.renderUser(userObj)}</div>
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
