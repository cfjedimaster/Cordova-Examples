class PushMessageAppStatus {
  constructor() {
    this.asleep = false;
    this.closed = false;
  }

  get wasAsleep() {
    return this.asleep;
  }

  get wasClosed() {
    return this.closed;
  }
}

export class PushMessage {

  constructor(raw) {
    this._raw = raw || {};

    if (!this._raw.additionalData) {
      // this should only hit if we are serving up a development push
      this._raw.additionalData = {
        'coldstart': false,
        'foreground': true
      };
    }

    this._payload = null;
    this.app = null;
    this.text = null;
    this.title = null;
    this.count = null;
    this.sound = null;
    this.image = null;
  }

  static fromPluginJSON(json) {
    var message = new PushMessage(json);
    message.processRaw();
    return message;
  }

  get payload() {
    return this._payload || {};
  }

  processRaw() {
    this.text = this._raw.message || null;
    this.title = this._raw.title || null;
    this.count = this._raw.count || null;
    this.sound = this._raw.sound || null;
    this.image = this._raw.image || null;
    this.app = new PushMessageAppStatus();

    if (!this._raw.additionalData.foreground) {
      this.app.asleep = true;
    }

    if (this._raw.additionalData.coldstart) {
      this.app.closed = true;
    }

    if (this._raw.additionalData.payload) {
      this._payload = this._raw.additionalData.payload;
    }
  }

  getRawVersion() {
    return this._raw;
  }

  toString() {
    return '<PushMessage [\'' + this.title + '\']>';
  }
}


