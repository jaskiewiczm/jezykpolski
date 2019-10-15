import React from "react"

import DropdownButton from 'react-bootstrap/DropdownButton'

export default class KlassSelector extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      klasses: [],
      schoolId: this.props.schoolId,
      title: 'Class'
    }

    this.getKlasses()
  }

  getKlasses = () => {
    fetch('/getKlasses', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      return response.json()
    }).then((response)=>{
      this.setState({
        klasses: response.klasses
      })
    })
  }

  klassSelected = (schoolId) => {

  }

  render() {
    return (
      <div>
        <DropdownButton title={this.state.title}>
          {
            this.state.klasses.map(function(key, index){
              return <Dropdown.Item onClick={that.klassSelected} eventKey={key.id}>{key.name}</Dropdown.Item>
            })
          }
        </DropdownButton>
      </div>
    )
  }
}
