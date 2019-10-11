import React from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Homeworks from 'components/Homeworks.jsx'

export default class Application extends React.Component {

  constructor(props) {
    super(props)

    this.login = this.login.bind(this)
  }

  login() {
    var that = this
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify({email: 'jaskiemr@gmail.com', password: 'foobar'}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      return response.json()
    }).then((response)=>{
      that.setState({
        homeworks: response
      })
    })
  }

  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">Język Polski</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/calendar">Calendar</Nav.Link>
            <Nav.Link href="/homeworks">Homework</Nav.Link>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Email" className="mr-sm-2" />
            <FormControl type="password" placeholder="Password" className="mr-sm-2" />
            <Button variant="outline-info" onClick={this.login}>Login</Button>
          </Form>
        </Navbar>

        <Homeworks />
      </div>
    )
  }
}
