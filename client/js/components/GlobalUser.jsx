
class GlobalUser {
  constructor() {
    this.school = null
    this.klasses = []
  }

  setSchool = (school) => {
    this.school = school
  }

  getSchool = () => { return this.school }

  setKlasses = (klasses) => {
    this.klasses = klasses
  }

  getKlasses = () => { return this.klasses }

  clear = () => {
    this.school = null
    this.klasses = []
  }

}

const g_user = new GlobalUser()
export default g_user