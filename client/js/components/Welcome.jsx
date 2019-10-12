import React from "react"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


export default class Welcome extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col></Col>
            <Col>
              <span style={{fontSize: '6em'}}>Welcome!</span>
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col>
              <span style={{fontSize: '1.75em'}}>Please log in</span>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
