import React from "react"
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import ListGroup from 'react-bootstrap/ListGroup'
import Tooltip from 'react-bootstrap/Tooltip'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'

import './FinalGrade.scss'


export default class FinalGrade extends React.Component {

  constructor(props) {
    super(props)
  }

  getLetterGrade = (activityId) => {
    var rv = 'N/A'
    if (this.props.gradeObj != null) {
      var activityObj = this.props.gradeObj[activityId]
      if (activityObj != null) {
        rv = activityObj['letter_value']
      }
    }
    
    return rv
  }

  getGrade = (activityId) => {
    var rv = ''
    if (this.props.gradeObj != null) {
      var activityObj = this.props.gradeObj[activityId]
      if (activityObj != null) {
        var value = activityObj['raw_value']
        rv = parseFloat(value).toFixed(2)
        if (isNaN(rv)) {
          return rv
        }
      }
    }
    return rv
  }

  gradePopover = () => {
    var that = this
    
    return (<Popover className='finalGradePopover'>
        <Popover.Content className='finalGradePopoverContent'>
          <ListGroup>
          {this.props.activityTypes.map(function(at){
            return  <ListGroup.Item key={at.activity_id}>
                      <Row>
                        <Col className='activityTypeColumnWidth' style={{width: '128px !important'}}>
                          {at.activity_name}
                        </Col>
                        <Col style={{width: '64px'}}>
                          <div>                            
                            <Badge variant="info" style={{display: 'inline', fontSize: '1.2em'}}>{that.getLetterGrade(at['activity_id'])}</Badge>
                            &nbsp;
                            <div style={{display: 'inline', fontSize: '0.8em'}}>{that.getGrade(at['activity_id'])}</div>                            
                          </div>
                        </Col> 
                        <Col style={{width: '32px'}}>
                          {at.percentage}%
                        </Col>                       
                      </Row>
                    </ListGroup.Item>
          })}
          </ListGroup>
        </Popover.Content>
      </Popover>)
      
  }

  render() {
    if (this.props.gradeObj) {
      return (
        <div>        
          <OverlayTrigger trigger="click" placement="left" overlay={this.gradePopover()} ref={(ref) => this.overlay = ref}>
            <Button variant='success'>{this.props.gradeObj.final_letter}</Button>
          </OverlayTrigger>                  
        </div>
      )  
    } else {
      return null
    }
    
  }
}
