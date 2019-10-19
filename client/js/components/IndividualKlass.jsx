import React from "react"
import KlassEditor from './KlassEditor.jsx'

import swal from 'sweetalert';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'


import styles from "./IndividualHomework.scss"

export default class IndividualKlass extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editMode: false,
      name: this.props.name,
      klassId: this.props.klassId
    }
  }

  deleteKlass = () => {
    var that = this
    swal({
      title: "Delete Class?",
      text: "Are you sure you want to delete this class?",
      icon: "warning",
      buttons: {
        no: {
          text: 'No',
          value: false
        },
        yes: {
          text: 'Yes',
          value: true
        }
      }
    })
    .then((willDelete) => {
      if (willDelete === true) {
        fetch('/delete_klass', {
          method: 'POST',
          body: JSON.stringify({klassId: this.props.klassId}),
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          }
        }).then((response)=>{
          if (response.status == 200) {
            this.props.deleteCallback()
          }
        })
      }
    });
  }

  editKlass = () => {
    this.setState({
      editMode: true
    })
  }

  editClosed = (name) => {
    if (name != null) {
      this.setState({
        editMode: false,
        name: name
      })
    } else {
      this.setState({
        editMode: false
      })
    }
  }

  render() {
    var editContent = this.state.editMode ? <KlassEditor klassId={this.state.klassId} name={this.state.name} callback={this.editClosed} /> : null

    return (
      <div>
        <Container>
          <Row>
            <Col xs={8}>
              {this.state.name}
            </Col>
            <Col xs={1}>
              <Image src="pencil.png" onClick={this.editKlass} />
            </Col>
            <Col xs={1}>
              <Image src="trash.png" onClick={this.deleteKlass} />
            </Col>
          </Row>
        </Container>
        {editContent}
      </div>
    )
  }
}
