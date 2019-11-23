
class GlobalRoles {
  constructor() {
    this.roles = []
  }

  _getRolesFromServer = () => {
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
        that.roles = response
      }
    })
  }

  getRoles = () => {
    return this.roles;
  }

  setRoles = (newRoles) => {
    this.roles = roles
  }

  containsRole = (roleCode) => {
    return this.roles.find(role => role.code == roleCode)
  }

  clearRoles = () => {
    this.roles = []
  }
}

const g_roles = new GlobalRoles()
export default g_roles