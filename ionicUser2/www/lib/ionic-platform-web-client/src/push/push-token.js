export class PushToken {

  constructor(token) {
    this._token = token || null;
  }

  set token(value) {
    this._token = value;
  }

  get token() {
    return this._token;
  }

  toString() {
    var token = this._token || 'null';
    return '<PushToken [\'' + token + '\']>';
  }
}


