import React from "react"
import styles from "./IndividualHomework.scss"

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

export default class IndividualHomework extends React.Component {

  constructor(props) {
    super(props)

  }

  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col xs={2}>{this.props.dueDate}</Col>
            <Col xs={5}>{this.props.description}</Col>
          </Row>
        </Container>
      </div>
    )
  }
}
