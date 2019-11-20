
class GlobalRoles {
  constructor() {
    this.roles = []
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