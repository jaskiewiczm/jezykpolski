import React from "react"
import { connect } from "react-redux";

import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

import g_user from './GlobalUser.jsx'
import g_roles from './GlobalRoles.jsx'

import {updateSelectedSchoolId, updateSelectedKlassId} from '../redux/Actions.jsx'


class SchoolSelector extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      title: this.getTitle(this.props.schools, parseInt(this.props.schoolId)),
      selectedSchoolId: parseInt(this.props.schoolId)
    }
  }

  getTitle = (schools, selectedSchoolId) => {
    var that = this
    var title = 'School'
    if (schools == null || selectedSchoolId == null) {
      return title
    } else {
      var school = schools.find((element) => {
        return element.id == selectedSchoolId;
      })

      if (school != null) {
        title = school.name
      }
      return title
    }
  }

  schoolSelected = (schoolId) => {
    var school = this.props.schools.find((element) => {
      return element.id == schoolId;
    })

    this.setState({
      title: school.name,
      selectedSchoolId: schoolId
    })

    updateSelectedSchoolId(schoolId)
    updateSelectedKlassId(null)
  }

  render() {
    var that = this

    if (g_roles.containsRole('admin', this.props.roles)) {
      return (
        <div>
          <DropdownButton title={this.getTitle(this.props.schools, parseInt(this.state.selectedSchoolId))} id='foobar' drop={'left'} onSelect={that.schoolSelected}>
            {
              this.props.schools.map(function(key, index){
                return <Dropdown.Item eventKey={key.id} key={index}>{key.name}</Dropdown.Item>
              })
            }
          </DropdownButton>
        </div>
      )
    } else {
      return <div />
    }
  }
}

export default connect(state => {
    return {
        roles: state.myRoles,
        schools: state.schools
    }
})(SchoolSelector)
