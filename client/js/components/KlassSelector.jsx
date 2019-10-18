import React from "react"

import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

export default class KlassSelector extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      klasses: [],
      schoolId: this.props.schoolId,
      title: 'Class',
      selectedKlassId: this.props.klassId
    }

    if (this.props.schoolId != null) {
      this.getKlasses()
    }
  }

  getKlasses = () => {
    fetch('/get_klasses', {
      method: 'POST',
      body: JSON.stringify({schoolId: this.props.schoolId}),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }).then((response)=>{
      return response.json()
    }).then((response)=>{
      var klass = response.find((element) => {
        return element.id == parseInt(this.state.selectedKlassId);
      })

      var title = this.state.title
      if (klass != null) {
        title = klass.name
      }

      this.setState({
        klasses: response,
        title: title
      })
    })
  }

  klassSelected = (klassId) => {
    var klass = this.state.klasses.find((element) => {
      return element.id == klassId;
    })

    this.setState({
      title: klass.name
    })

    this.props.callback(klassId)
  }

  render() {
    var that = this

    return (
      <div>
        <DropdownButton title={this.state.title} drop={'left'} onSelect={that.klassSelected}>
          {
            this.state.klasses.map(function(key, index){
              return <Dropdown.Item eventKey={key.id} key={index}>{key.name}</Dropdown.Item>
            })
          }
        </DropdownButton>
      </div>
    )
  }
}
