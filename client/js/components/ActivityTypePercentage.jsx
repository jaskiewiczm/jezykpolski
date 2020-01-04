import React from "react"

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'

import "./ActivityTypePercentage.scss"

export default class ActivityTypePercentage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      activityTypes: this.props.activityTypes
    }
  }

  componentDidUpdate() {
    if (this.state.activityTypes == null && this.props.activityTypes != null) {
      this.setState({
        activityTypes: this.props.activityTypes
      })
    } else if (this.state.activityTypes) {
      var disable = this.isAnyPercentageInvalid()
      this.props.disableSaveCallback(disable)
      this.props.updateActivityTypesCallback(this.state.activityTypes)
    }
  }

  isAnyPercentageInvalid = () => {
    var that = this
    var disableSave = false
    var invalids = this.state.activityTypes.map(at => {return that.invalidPercentage(at.activity_id)})
    invalids = invalids.reduce((prev, next) => prev | next)

    return invalids
  }

  invalidPercentage = (activityId) => {
    var activityType = this.state.activityTypes.find((at) => {return at.activity_id == activityId})
    var percentage = parseInt(activityType.percentage)
    if (Number.isNaN(percentage) || percentage > 100) {
      return true
    }

    var sum = this.state.activityTypes.map(at => at.percentage).reduce((prev, next) => prev + next)
    if (sum > 100) {
      return true
    }

    return false
  }

  invalidPercentageMessage = (activityId) => {
    var activityType = this.state.activityTypes.find((at) => {return at.activity_id == activityId})
    var percentage = parseInt(activityType.percentage)
    if (!Number.isNaN(percentage) && percentage > 100) {
      return 'Percentage must be less than or equal 100%'
    }

    var sum = this.state.activityTypes.map(at => at.percentage).reduce((prev, next) => prev + next)
    if (sum > 100) {
      return 'Percentages must sum to 100%'
    }

    return ''
  }

  percentageChanged = (event, activityId) => {
    var activityTypes = this.state.activityTypes
    var activityType = activityTypes.find((at) => {return at.activity_id == activityId})

    var percentage = parseInt(event.currentTarget.value)
    if (!Number.isNaN(percentage)) {
      activityType.percentage = percentage
    } else {
      activityType.percentage = 0
    }

    this.setState({
      activityTypes: activityTypes
    })
  }

  render() {
    var that = this

    var activityTypes = []
    if (this.state.activityTypes) {
      activityTypes = this.state.activityTypes
    }
    return (
      <ListGroup>
        {activityTypes.map(function(at) {
          return  <ListGroup.Item key={at.activity_id}>
                    <Row>
                      <Col xs={8}>{at.activity_name}</Col>
                      <Col xs={2}>
                        <Form.Control type='text'
                                      value={at.percentage}
                                      onChange={(event) => {that.percentageChanged(event, at.activity_id)}}
                                      isInvalid={that.invalidPercentage(at.activity_id)}
                                      className='activityTypePercentageCell'/>
                        <Form.Control.Feedback type='invalid'>

                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  </ListGroup.Item>
        })}
      </ListGroup>
    )
  }
}

