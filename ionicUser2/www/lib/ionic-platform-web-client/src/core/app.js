import { Logger } from "./logger";

var privateData = {};

function privateVar(key) {
  return privateData[key] || null;
}

export class App {

  constructor(appId, apiKey) {
    this.logger = new Logger({
      'prefix': 'Ionic App:'
    });
    if (!appId || appId === '') {
      this.logger.info('No app_id was provided');
      return false;
    }

    if (!apiKey || apiKey === '') {
      this.logger.info('No api_key was provided');
      return false;
    }

    privateData.id = appId;
    privateData.apiKey = apiKey;

    // other config value reference
    this.devPush = null;
    this.gcmKey = null;
  }

  get id() {
    return privateVar('id');
  }

  get apiKey() {
    return privateVar('apiKey');
  }

  toString() {
    return '<IonicApp [\'' + this.id + '\'>';
  }
}
