import React from "react"
import { connect } from "react-redux";

import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

import {updateSelectedKlassId} from '../redux/Actions.jsx'


class KlassSelector extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      klasses: null,
      title: 'Class',
      selectedKlassId: this.props.klassId,
      prevSchoolId: this.props.schoolId
    }

    this.getKlasses()
  }

  componentDidUpdate() {
    if (this.state.klasses == null && this.props.schoolId != null) {
      this.getKlasses()
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.schoolId !== state.prevSchoolId) {
      return {
        klasses: null,
        title: 'Class',
        prevSchoolId: props.schoolId
      };
    }
    return null;
  }

  getSelectedKlassTitle = () => {
    var klass = this.state.klasses.find((element) => {
      return element.id == parseInt(this.state.selectedKlassId);
    })

    if (klass != null) {
      return klass.name
    }
    return 'Class'
  }

  getKlasses = () => {
    if (this.props.schoolId != null) {
      fetch('/get_klasses', {
        method: 'POST',
        body: JSON.stringify({schoolId: this.props.schoolId}),
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }).then((response)=>{
        if (response.status == 200) {
          return response.json()
        }
        return null
      }).then((response)=>{
        if (response != null) {
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
        }
      })
    }
  }

  klassSelected = (klassId) => {
    var klass = this.state.klasses.find((element) => {
      return element.id == klassId;
    })

    this.setState({
      title: klass.name
    })

    updateSelectedKlassId(klassId)

    this.props.callback(klassId)
  }

  render() {
    var that = this

    var klasses = []
    if (this.state.klasses != null) {
      klasses = this.state.klasses
    }

    return (
      <div>
        <DropdownButton title={this.state.title} drop={'left'} onSelect={that.klassSelected}>
          {
            klasses.map(function(key, index){
              return <Dropdown.Item eventKey={key.id} key={index}>{key.name}</Dropdown.Item>
            })
          }
        </DropdownButton>
      </div>
    )
  }
}


export default connect(state => {
    return {
        selectedSchoolId: state.schoolId
    }
})(KlassSelector)

