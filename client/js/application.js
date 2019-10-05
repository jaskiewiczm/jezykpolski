
import React from "react"
import ReactDOM from "react-dom"
import {IndexRedirect, Route, Router} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import Login from "./components/Login.jsx"
import Application from './Application.jsx'
import ReadingLog from './components/ReadingLog.jsx'

const bindNode = document.getElementById('data-bind-node');


if (!bindNode) {
  console.error('No div#data-bind-node found for react to render');
} else {
  ReactDOM.render(
    (
      <BrowserRouter>
        <Route path="/" component={Application} />
        <Route path="/login" component={Login} />
        <Route path="/reading_log" component={ReadingLog} />
      </BrowserRouter>
    ), bindNode
  )
}