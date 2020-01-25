import React from "react"

import { PieChart } from 'react-chartkick'
import 'chart.js'

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'


export default class ActivityGradeDistribution extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    var that = this

    return (
      <div>
        <PieChart data={this.props.distribution} />
      </div>
    )
  }
}

