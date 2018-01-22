class Session{
  constructor() {
    this.data = {
      account: null,
      id: null,
      role: '',
      permissions: [],
      token: ''
    }

    if (window.localStorage['session']) {
      try {
        var obj = JSON.parse(window.localStorage['session']);
        this.create(obj.account, obj.token);
      } catch (e) {
        console.log(e)
      }
    }

    return this
  }

  create(account, token) {
    this.destory()
    this.data.account = account
    this.data.token = token
    window.localStorage['session'] = JSON.stringify(this.data)
    console.log('create session success!',this.data.token)

  }

  destory() {
    this.data = {
      account: null,
      id: null,
      role: '',
      permissions: [],
      token: ''
    }

    window.localStorage.removeItem('session');
  }

  getToken() {
    return this.data.token;
  }

  getAccount() {
    return this.data.account;
  }

  setPermissions(d) {
    this.data.permissions = d;
  }

  getPermissions() {
    return this.data.permissions;
  }
}

Session.$inject = []

/*angular.module('session' , [])
      .service('Session', Session)
      .name*/
export default {
  name: 'Session',
  service: Session
}