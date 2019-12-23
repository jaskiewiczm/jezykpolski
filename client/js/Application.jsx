import React from 'react';
import { connect } from "react-redux";
import {Link} from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Toast from 'react-bootstrap/Toast'

import g_roles from './components/GlobalRoles.jsx'
import g_user from './components/GlobalUser.jsx'

import {updateMyRoles, updateSchools, updateUser} from './redux/Actions.jsx'

import {styles} from './Application.scss'


class Application extends React.Component {

  constructor(props) {
    super(props)

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.onEmailChange = this.onEmailChange.bind(this)
    this.onPasswordChanged = this.onPasswordChanged.bind(this)
    this.addAlert = this.addAlert.bind(this)
    this.getNavButtons = this.getNavButtons.bind(this)

    this.state = {
      loggedIn: false,
      loginFailed: false,
      email: null
    }
  }

  componentDidMount() {
    this.whoami()
  }

  whoami = () => {
    var that = this
    fetch('/whoami', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      if (response.status == 200) {
        return response.json()
      } else {
        return null
      }
    }).then((response)=>{
      if (response != null) {
        g_roles.initialize()
        g_user.initialize()
        updateMyRoles(response.roles)
        updateUser(response.user)

        that.setState({
          loggedIn: true,
          loginFailed: false,
          email: response.user.email
        })
        that.props.history.push('/homeworks')
      }
    })
  }

  login() {
    var that = this
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify({email: this.state.email, password: this.state.password}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      if (response.status == 200) {
        return response.json()
      } else {
        return null
      }
    }).then((response)=>{
      if (response != null) {
        g_roles.initialize()
        g_user.initialize()
        updateMyRoles(response.roles)
        updateUser(response)

        that.setState({
          loggedIn: true,
          loginFailed: false,
          email: response.email,
          user: response
        })
        that.props.history.push('/homeworks')
      } else {
        that.setState({
          loginFailed: true
        })
      }
    })
  }

  logout() {
    updateMyRoles([])
    updateSchools([])
    fetch('/logout', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      if (response.status == 200) {

        this.setState({
          loggedIn: false,
          loginFailed: false,
          email: null
        })

        updateUser(null)

        this.props.history.push('/welcome')
      }
    })
  }

  onEmailChange(data) {
    this.setState({email: data.currentTarget.value})
  }

  onPasswordChanged(data) {
    this.setState({password: data.currentTarget.value})
  }

  getAuthenticatorArea() {
    if (this.state.loggedIn == true) {
      return (
          <Form inline>
            <span style={{fontSize: '1.25em', color: 'white', paddingRight: '10px'}}>{this.state.email}</span>
            <Link to="/user_settings">
              <img className='userButton' src='/user.svg' />
            </Link>
            &nbsp;&nbsp;
            <Button variant="outline-info" onClick={this.logout}>Logout</Button>
          </Form>
        )
    } else {
      return (
          <div>
            <div>
              <Form inline>
                <FormControl type="text" placeholder="Email" className="mr-sm-2" onChange={this.onEmailChange}/>
                <FormControl type="password" placeholder="Password" className="mr-sm-2" onChange={this.onPasswordChanged}/>
                <Button variant="outline-info" onClick={this.login}>Login</Button>
              </Form>
            </div>
            <div>
              <div>
                <Link className='passwordReset' to="/password_reset">Password Reset</Link>
              </div>
            </div>
          </div>
        )
    }
  }

  getContent() {
    if (this.state.loggedIn == true) {
      return (<Homeworks />)
    } else {
      return (<Welcome />)
    }
  }

  addAlert() {
    if (this.state.loginFailed) {
      return (
          <Alert variant="danger" onClose={() => this.setState({loginFailed: false})} dismissible>
            Incorrect email or password. Please try again.
          </Alert>
        )
    }

    return null
  }

  getNavButtons() {

    var homeworksLink = null
    var usersLink = null
    var classesLink = null
    var gradebookLink = null
    var studentReportLink = null
    var billingLink = null

    if (g_roles.containsRole('admin', this.props.roles) || g_roles.containsRole('school_admin', this.props.roles)) {
      homeworksLink = <div><Link to="/homeworks">Homework</Link>&nbsp;&nbsp;&nbsp;</div>
      usersLink = <div><Link to="/users">Users</Link>&nbsp;&nbsp;&nbsp;</div>
      classesLink = <div><Link to="/klasses">Classes</Link>&nbsp;&nbsp;&nbsp;</div>
      gradebookLink = <div><Link to="/gradebook">Gradebook</Link>&nbsp;&nbsp;&nbsp;</div>
      studentReportLink = <div><Link to="/user_report">Student Report</Link>&nbsp;&nbsp;&nbsp;</div>
      billingLink = <div><Link to="/billing">Billing</Link>&nbsp;&nbsp;&nbsp;</div>
    }
    if (g_roles.containsRole('teacher', this.props.roles)) {
      homeworksLink = <div><Link to="/homeworks">Homework</Link>&nbsp;&nbsp;&nbsp;</div>
      gradebookLink = <div><Link to="/gradebook">Gradebook</Link>&nbsp;&nbsp;&nbsp;</div>
    }
    if (g_roles.containsRole('student', this.props.roles)) {
      homeworksLink = <div><Link to="/homeworks">Homework</Link>&nbsp;&nbsp;&nbsp;</div>
      studentReportLink = <div><Link to="/user_report">Student Report</Link>&nbsp;&nbsp;&nbsp;</div>
    }
    if (g_roles.containsRole('parent', this.props.roles)) {
      homeworksLink = <div><Link to="/homeworks">Homework</Link>&nbsp;&nbsp;&nbsp;</div>
      studentReportLink = <div><Link to="/user_report">Student Report</Link>&nbsp;&nbsp;&nbsp;</div>
    }

    return (
        <Nav className="mr-auto">
          {billingLink}
          {classesLink}
          {gradebookLink}
          {homeworksLink}
          {studentReportLink}
          {usersLink}
        </Nav>
      )
  }

  render() {
    return (
      <div>
        {this.addAlert()}
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>Język Polski</Navbar.Brand>
          {this.getNavButtons()}
          {this.getAuthenticatorArea()}
        </Navbar>
      </div>
    )
  }
}


export default connect(state => {
    return {
        roles: state.myRoles,
        schools: state.schools
    }
})(Application)