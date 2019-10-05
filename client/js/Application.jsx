import React from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'

export default class Application extends React.Component {
  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">Język Polski</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="calendar">Calendar</Nav.Link>
            <Nav.Link href="reading_log">Reading Log</Nav.Link>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Email" className="mr-sm-2" />
            <FormControl type="password" placeholder="Password" className="mr-sm-2" />
            <Button variant="outline-info">Login</Button>
          </Form>
        </Navbar>


      </div>
    )
  }
}
