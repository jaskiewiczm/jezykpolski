import React from "react"
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import ListGroup from 'react-bootstrap/ListGroup'
import Tooltip from 'react-bootstrap/Tooltip'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import './FinalGrade.scss'


export default class FinalGrade extends React.Component {

  constructor(props) {
    super(props)
  }

  gradePopover = () => {
    var that = this
    
    return (<Popover>
        <Popover.Content>
          <ListGroup>
          {this.props.activityTypes.map(function(at){
            return  <ListGroup.Item>
                      <Row>
                        <Col>
                          {at.activity_name}
                        </Col>
                        <Col>
                          {parseFloat(that.props.gradeObj[at['activity_id']]).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
          })}
          </ListGroup>
        </Popover.Content>
      </Popover>)
      
  }

  render() {
    return (
      <div>        
        <OverlayTrigger trigger="click" placement="left" overlay={this.gradePopover} ref={(ref) => this.overlay = ref}>
          <Button variant='success'>{this.props.gradeObj.final_letter}</Button>
        </OverlayTrigger>                  
      </div>
    )
  }
}
