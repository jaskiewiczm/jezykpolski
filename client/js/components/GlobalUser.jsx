
import {updateSchools} from '../redux/Actions.jsx'


class GlobalUser {
  constructor() {
  }

  initialize = () => {
    var that = this
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
        updateSchools(response)
      }
    })
  }
}

const g_user = new GlobalUser()
export default g_user