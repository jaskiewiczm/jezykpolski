import React from "react"

import Dropdown from 'react-bootstrap/Dropdown'

export default class SchoolSelector extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      schools: [],
      title: 'School'
    }

    this.getSchools()
  }

  getSchools = () => {
    fetch('/getSchools', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      return response.json()
    }).then((response)=>{
      this.setState({
        schools: response.schools
      })
    })
  }

  schoolSelected = (schoolId) => {

  }

  /*        <Dropdown title={this.state.title} id='foobar'>
          {
            this.state.schools.map(function(key, index){
              return <Dropdown.Item onClick={that.schoolSelected} eventKey={key.id}>{key.name}</Dropdown.Item>
            })
          }
        </Dropdown>
          >*/

  render() {
    var that = this
    return (
      <div>

      </div>
    )
  }
}
