
import React from "react"
import ReactDOM from "react-dom"
import {IndexRedirect, Route, Router} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import Login from "./components/Login.jsx"
import Application from './Application.jsx'
import ReadingLog from './components/ReadingLog.jsx'
import Homeworks from 'components/Homeworks.jsx'
import Users from 'components/Users.jsx'
import Welcome from 'components/Welcome.jsx'
import Klasses from 'components/Klasses.jsx'
import Gradebook from 'components/Gradebook.jsx'

const bindNode = document.getElementById('data-bind-node');


if (!bindNode) {
  console.error('No div#data-bind-node found for react to render');
} else {
  ReactDOM.render(
    (
      <BrowserRouter>
        <Route path="/" component={Application} />
        <Route path="/users" component={Users} />
        <Route path="/homeworks" component={Homeworks}/>
        <Route path="/welcome" component={Welcome} />
        <Route path="/klasses" component={Klasses} />
        <Route path="/gradebook" component={Gradebook} />
      </BrowserRouter>
    ), bindNode
  )
}