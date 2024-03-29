
import React from "react"
import { Provider } from 'react-redux'
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
import UserReport from 'components/UserReport.jsx'
import UserSettings from 'components/UserSettings.jsx'
import ActiveBillManager from 'components/ActiveBillManager.jsx'
import BillMetaManager from 'components/BillMetaManager.jsx'
import PasswordResetRequest from 'components/PasswordResetRequest.jsx'
import JwtPasswordReset from 'components/JwtPasswordReset.jsx'

import { createStore, combineReducers } from 'redux';
import schoolsReducer from './redux/Reducers.jsx';

const bindNode = document.getElementById('data-bind-node');
export const reduxStore = createStore(schoolsReducer);


if (!bindNode) {
  console.error('No div#data-bind-node found for react to render');
} else {
  ReactDOM.render(
    (
      <Provider store={reduxStore}>
        <BrowserRouter>
          <Route path="/" component={Application} />
          <Route path="/users" component={Users} />
          <Route path="/homeworks" component={Homeworks}/>
          <Route path="/welcome" component={Welcome} />
          <Route path="/klasses" component={Klasses} />
          <Route path="/gradebook" component={Gradebook} />
          <Route path="/user_report" component={UserReport} />
          <Route path="/user_settings" component={UserSettings} />
          <Route path="/password_reset_request" component={PasswordResetRequest} />
          <Route path="/jwt_reset_password" component={JwtPasswordReset} />
          <Route path="/bill_meta_manager" component={BillMetaManager} />
          <Route path="/active_bill_manager" component={ActiveBillManager} />
        </BrowserRouter>
      </Provider>
    ), bindNode
  )
}