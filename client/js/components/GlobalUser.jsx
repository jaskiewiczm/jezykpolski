
import schoolStore from '../redux/Store.jsx'
import {updateSchools} from '../redux/Actions.jsx'


class GlobalUser {
  constructor() {

  }

  initialize = () => {
    this.initializeSchools()
  }

  initializeSchools = () => {
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
        schoolStore.dispatch(updateSchools(response));
        console.log('After:', schoolStore.getState());
      }
    })
  }

  getSchools = () => {
    var schools = schoolStore.getState().schools.schools
    if (schools.length > 0) {
      return schools[0].schools
    } else {
      return []
    }
  }

  clear = () => {

  }

}

const g_user = new GlobalUser()
export default g_user