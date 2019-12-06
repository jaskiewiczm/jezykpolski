
import {updateRoles, updateMyRoles} from '../redux/Actions.jsx'


class GlobalRoles {
  constructor() {
  }

  initialize = () => {
    var that = this
    fetch('/get_roles', {
      method: 'GET',
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
        updateRoles(response);
      }
    })
  }

  containsRole = (roleCode, roles) => {
    if (roles != null) {
      return roles.find((role) => {return role.code == roleCode})
    } else {
      return null
    }
  }

}


const g_roles = new GlobalRoles()
export default g_roles