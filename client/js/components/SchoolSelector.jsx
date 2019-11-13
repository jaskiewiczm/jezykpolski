import React from "react"

import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

export default class SchoolSelector extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      schools: [],
      title: 'School',
      selectedSchoolId: this.props.schoolId
    }

    this.getSchools()
  }

  getSchools = () => {
    fetch('/get_schools', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      if (response.status == 200) {
        return response.json()
      }
    }).then((response)=>{
      if (response != null) {
        var school = response.find((element) => {
          return element.id == parseInt(this.state.selectedSchoolId);
        })

        var title = this.state.title
        if (school != null) {
          title = school.name
        }

        this.setState({
          schools: response,
          title: title
        })
      }
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
