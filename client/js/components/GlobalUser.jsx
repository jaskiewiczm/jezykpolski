
class GlobalUser {
  constructor() {
    this.schools = []
    this.klasses = []
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
        that.schools = response
      }
    })
  }

  getSchools = () => { return this.schools }

  setKlasses = (klasses) => {
    this.klasses = klasses
  }

  getKlasses = () => { return this.klasses }

  clear = () => {
    this.schools = []
    this.klasses = []
  }

}

const g_user = new GlobalUser()
export default g_user