import React from 'react';
import { connect } from "react-redux";
import {Link} from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap';

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Toast from 'react-bootstrap/Toast'
import Dropdown from 'react-bootstrap/Dropdown'
import NavItem from 'react-bootstrap/NavItem'
import NavLink from 'react-bootstrap/NavLink'
import DropdownButton from 'react-bootstrap/DropdownButton'
import NavDropdown from 'react-bootstrap/NavDropdown'


import g_roles from './components/GlobalRoles.jsx'
import g_user from './components/GlobalUser.jsx'

import {updateMyRoles, updateSchools, updateUser, updateSelectedSchoolId, updateSelectedKlassId} from './redux/Actions.jsx'

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
        if (this.props.history.location.pathname != '/jwt_reset_password') {
          that.props.history.push('/homeworks')
        }
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
    updateSelectedSchoolId(null)
    updateSelectedKlassId(null)

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
                <Link className='passwordReset' to="/password_reset_request">Password Reset</Link>
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

  getHomeworkLink = () => {
    var homeworksLink = null
    if (g_roles.containsRole('admin', this.props.roles)
        || g_roles.containsRole('school_admin', this.props.roles)
        || g_roles.containsRole('parent', this.props.roles)
        || g_roles.containsRole('teacher', this.props.roles)
        || g_roles.containsRole('student', this.props.roles)) {
      homeworksLink = <Nav.Item as='li'>
                        <Nav.Link as={Link} to='/homeworks'>Homeworks</Nav.Link>
                      </Nav.Item>
    }
    return homeworksLink
  }

  getUsersLink = () => {
    var usersLink = null
    if (g_roles.containsRole('admin', this.props.roles)
        || g_roles.containsRole('school_admin', this.props.roles)) {
      usersLink = <Nav.Item as='li'>
                    <Nav.Link as={Link} to='/users'>Users</Nav.Link>
                  </Nav.Item>
    }
    return usersLink
  }

  getKlassesLink = () => {
    var classesLink = null
    if (g_roles.containsRole('admin', this.props.roles)
        || g_roles.containsRole('school_admin', this.props.roles)
        || g_roles.containsRole('teacher', this.props.roles)) {
      classesLink = <Nav.Item as='li'>
                      <Nav.Link as={Link} to='/klasses'>Classes</Nav.Link>
                    </Nav.Item>
    }
    return classesLink
  }

  getGradebookLink = () => {
    var gradebookLink = null
    if (g_roles.containsRole('admin', this.props.roles)
        || g_roles.containsRole('school_admin', this.props.roles)
        || g_roles.containsRole('teacher', this.props.roles)) {
      gradebookLink = <Nav.Item as='li'>
                        <Nav.Link as={Link} to='/gradebook'>Gradebook</Nav.Link>
                      </Nav.Item>
    }
    return gradebookLink
  }

  getStudentReportLink = () => {
    var studentReportLink = null
    if (g_roles.containsRole('parent', this.props.roles)
        || g_roles.containsRole('student', this.props.roles)) {
      studentReportLink = <Nav.Item as='li'>
                            <Nav.Link as={Link} to='/user_report'>Student Report</Nav.Link>
                          </Nav.Item>
    }
    return studentReportLink
  }

  getBillingLink = () => {
    var billingLink = null
    if (g_roles.containsRole('admin', this.props.roles)
        || g_roles.containsRole('school_admin', this.props.roles)) {
      billingLink = <Dropdown as={NavItem}>
                      <Dropdown.Toggle variant="success" id="dropdown-basic" as={NavLink}>Bills</Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item as={Link} to='/bill_meta_manager'>Configuration</Dropdown.Item>
                        <Dropdown.Item as={Link} to='/active_bill_manager'>Active Bills</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
    }
    return billingLink
  }

  getNavButtons() {

    var homeworksLink = this.getHomeworkLink()
    var usersLink = this.getUsersLink()
    var classesLink = this.getKlassesLink()
    var gradebookLink = this.getGradebookLink()
    var studentReportLink = this.getStudentReportLink()
    var billingLink = null //this.getBillingLink()

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