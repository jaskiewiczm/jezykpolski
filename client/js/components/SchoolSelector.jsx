import React from "react"

import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

import g_user from './GlobalUser.jsx'
import schoolStore from '../redux/Store.jsx'

export default class SchoolSelector extends React.Component {

  constructor(props) {
    super(props)

    var gSchools = g_user.getSchools()
    this.state = {
      schools: gSchools,
      title: this.getTitle(gSchools, parseInt(this.props.schoolId)),
      selectedSchoolId: parseInt(this.props.schoolId)
    }

    schoolStore.subscribe(() => {
      this.schoolsUpdated()
    });
  }

  getTitle = (schools, selectedSchoolId) => {
    var that = this
    var title = 'School'
    if (selectedSchoolId == null) {
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

  schoolsUpdated = () => {
    var schools = g_user.getSchools()

    this.setState({
      schools: schools,
      title: this.getTitle(schools, this.state.selectedSchoolId)
    })
  }

  schoolSelected = (schoolId) => {
    this.props.callback(schoolId)

    var school = this.state.schools.find((element) => {
      return element.id == schoolId;
    })

    this.setState({
      title: school.name
    })
  }

  render() {
    var that = this
    return (
      <div>
        <DropdownButton title={this.state.title} id='foobar' drop={'left'} onSelect={that.schoolSelected}>
          {
            this.state.schools.map(function(key, index){
              return <Dropdown.Item eventKey={key.id} key={index}>{key.name}</Dropdown.Item>
            })
          }
        </DropdownButton>
      </div>
    )
  }
}
