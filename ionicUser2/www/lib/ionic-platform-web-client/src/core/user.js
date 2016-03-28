import { Auth } from "../auth/auth";
import { APIRequest } from "./request";
import { DeferredPromise } from "./promise";
import { Settings } from "./settings";
import { Storage } from "./storage";
import { Logger } from "./logger";
import { DataType } from "./data-types.js";

var AppUserContext = null;
var settings = new Settings();
var storage = new Storage();

var userAPIBase = settings.getURL('platform-api') + '/auth/users';
var userAPIEndpoints = {
  'self': function() {
    return userAPIBase + '/self';
  },
  'get': function(userModel) {
    return userAPIBase + '/' + userModel.id;
  },
  'remove': function(userModel) {
    return userAPIBase + '/' + userModel.id;
  },
  'save': function(userModel) {
    return userAPIBase + '/' + userModel.id;
  },
  'passwordReset': function(userModel) {
    return userAPIBase + '/' + userModel.id + '/password-reset';
  }
};

class UserContext {
  static get label() {
    return "ionic_io_user_" + settings.get('app_id');
  }

  static delete() {
    storage.deleteObject(UserContext.label);
  }

  static store() {
    if (UserContext.getRawData()) {
      UserContext.storeLegacyData(UserContext.getRawData());
    }
    if (User.current().data.data.__ionic_user_migrated) {
      storage.storeObject(UserContext.label + '_legacy', { '__ionic_user_migrated': true });
    }
    storage.storeObject(UserContext.label, User.current());
  }

  static storeLegacyData(data) {
    if (!UserContext.getRawLegacyData()) {
      storage.storeObject(UserContext.label + '_legacy', data);
    }
  }

  static getRawData() {
    return storage.retrieveObject(UserContext.label) || false;
  }

  static getRawLegacyData() {
    return storage.retrieveObject(UserContext.label + '_legacy') || false;
  }

  static load() {
    var data = storage.retrieveObject(UserContext.label) || false;
    if (data) {
      UserContext.storeLegacyData(data);
      return User.fromContext(data);
    }
    return false;
  }
}

class UserData {
  constructor(data) {
    this.data = {};
    if ((typeof data === 'object')) {
      this.data = data;
      this.deserializerDataTypes();
    }
  }

  deserializerDataTypes() {
    for (var x in this.data) {
      // if we have an object, let's check for custom data types
      if (typeof this.data[x] === 'object') {
        // do we have a custom type?
        if (this.data[x].__Ionic_DataTypeSchema) {
          var name = this.data[x].__Ionic_DataTypeSchema;
          var mapping = DataType.getMapping();
          if (mapping[name]) {
            // we have a custom type and a registered class, give the custom data type
            // from storage
            this.data[x] = mapping[name].fromStorage(this.data[x].value);
          }
        }
      }
    }
  }

  set(key, value) {
    this.data[key] = value;
  }

  unset(key) {
    delete this.data[key];
  }

  get(key, defaultValue) {
    if (this.data.hasOwnProperty(key)) {
      return this.data[key];
    } else {
      if (defaultValue === 0 || defaultValue === false) {
        return defaultValue;
      }
      return defaultValue || null;
    }
  }
}

export class User {
  constructor() {
    this.logger = new Logger({
      'prefix': 'Ionic User:'
    });
    this._blockLoad = false;
    this._blockSave = false;
    this._blockDelete = false;
    this._dirty = false;
    this._fresh = true;
    this._unset = {};
    this.data = new UserData();
  }

  isDirty() {
    return this._dirty;
  }

  isAnonymous() {
    if (!this.id) {
      return true;
    } else {
      return false;
    }
  }

  isAuthenticated() {
    if (this === User.current()) {
      return Auth.isAuthenticated();
    }
    return false;
  }

  static current(user) {
    if (user) {
      AppUserContext = user;
      UserContext.store();
      return AppUserContext;
    } else {
      if (!AppUserContext) {
        AppUserContext = UserContext.load();
      }
      if (!AppUserContext) {
        AppUserContext = new User();
      }
      return AppUserContext;
    }
  }

  static fromContext(data) {
    var user = new User();
    user.id = data._id;
    user.data = new UserData(data.data.data);
    user.details = data.details || {};
    user._fresh = data._fresh;
    user._dirty = data._dirty;
    return user;
  }

  static self() {
    var deferred = new DeferredPromise();
    var tempUser = new User();

    if (!tempUser._blockLoad) {
      tempUser._blockLoad = true;
      new APIRequest({
        'uri': userAPIEndpoints.self(),
        'method': 'GET',
        'json': true
      }).then(function(result) {
        tempUser._blockLoad = false;
        tempUser.logger.info('loaded user');

        // set the custom data
        tempUser.id = result.payload.data.uuid;
        tempUser.data = new UserData(result.payload.data.custom);
        tempUser.details = result.payload.data.details;
        tempUser._fresh = false;

        User.current(tempUser);
        deferred.resolve(tempUser);
      }, function(error) {
        tempUser._blockLoad = false;
        tempUser.logger.error(error);
        deferred.reject(error);
      });
    } else {
      tempUser.logger.info("a load operation is already in progress for " + this + ".");
      deferred.reject(false);
    }

    return deferred.promise;
  }

  static load(id) {
    var deferred = new DeferredPromise();

    var tempUser = new User();
    tempUser.id = id;

    if (!tempUser._blockLoad) {
      tempUser._blockLoad = true;
      new APIRequest({
        'uri': userAPIEndpoints.get(tempUser),
        'method': 'GET',
        'json': true
      }).then(function(result) {
        tempUser._blockLoad = false;
        tempUser.logger.info('loaded user');

        // set the custom data
        tempUser.data = new UserData(result.payload.data.custom);
        tempUser.details = result.payload.data.details;
        tempUser._fresh = false;

        deferred.resolve(tempUser);
      }, function(error) {
        tempUser._blockLoad = false;
        tempUser.logger.error(error);
        deferred.reject(error);
      });
    } else {
      tempUser.logger.info("a load operation is already in progress for " + this + ".");
      deferred.reject(false);
    }

    return deferred.promise;
  }

  isFresh() {
    return this._fresh;
  }

  isValid() {
    if (this.id) {
      return true;
    }
    return false;
  }

  getAPIFormat() {
    var apiFormat = {};
    for (var key in this.details) {
      apiFormat[key] = this.details[key];
    }
    apiFormat.custom = this.data.data;
    return apiFormat;
  }

  getFormat(format) {
    var self = this;
    var formatted = null;
    switch (format) {
      case 'api-save':
        formatted = self.getAPIFormat();
        break;
    }
    return formatted;
  }

  migrate() {
    var rawData = UserContext.getRawLegacyData();
    if (rawData.__ionic_user_migrated) {
      return true;
    }
    if (rawData) {
      var currentUser = Ionic.User.current();
      var userData = new UserData(rawData.data.data);
      for (var key in userData.data) {
        currentUser.set(key, userData.data[key]);
      }
      currentUser.set('__ionic_user_migrated', true);
    }
  }

  delete() {
    var self = this;
    var deferred = new DeferredPromise();

    if (!self.isValid()) {
      return false;
    }

    if (!self._blockDelete) {
      self._blockDelete = true;
      self._delete();
      new APIRequest({
        'uri': userAPIEndpoints.remove(this),
        'method': 'DELETE',
        'json': true
      }).then(function(result) {
        self._blockDelete = false;
        self.logger.info('deleted ' + self);
        deferred.resolve(result);
      }, function(error) {
        self._blockDelete = false;
        self.logger.error(error);
        deferred.reject(error);
      });
    } else {
      self.logger.info("a delete operation is already in progress for " + this + ".");
      deferred.reject(false);
    }

    return deferred.promise;
  }

  _store() {
    if (this === User.current()) {
      UserContext.store();
    }
  }

  _delete() {
    if (this === User.current()) {
      UserContext.delete();
    }
  }

  save() {
    var self = this;
    var deferred = new DeferredPromise();

    if (!self._blockSave) {
      self._blockSave = true;
      self._store();
      new APIRequest({
        'uri': userAPIEndpoints.save(this),
        'method': 'PATCH',
        'json': self.getFormat('api-save')
      }).then(function(result) {
        self._dirty = false;
        if (!self.isFresh()) {
          self._unset = {};
        }
        self._fresh = false;
        self._blockSave = false;
        self.logger.info('saved user');
        deferred.resolve(result);
      }, function(error) {
        self._dirty = true;
        self._blockSave = false;
        self.logger.error(error);
        deferred.reject(error);
      });
    } else {
      self.logger.info("a save operation is already in progress for " + this + ".");
      deferred.reject(false);
    }

    return deferred.promise;
  }

  resetPassword() {
    var self = this;
    var deferred = new DeferredPromise();

    new APIRequest({
      'uri': userAPIEndpoints.passwordReset(this),
      'method': 'POST'
    }).then(function(result) {
      self.logger.info('password reset for user');
      deferred.resolve(result);
    }, function(error) {
      self.logger.error(error);
      deferred.reject(error);
    });

    return deferred.promise;
  }

  set id(v) {
    if (v && (typeof v === 'string') && v !== '') {
      this._id = v;
      return true;
    } else {
      return false;
    }
  }

  get id() {
    return this._id || null;
  }

  toString() {
    return '<IonicUser [\'' + this.id + '\']>';
  }

  set(key, value) {
    delete this._unset[key];
    return this.data.set(key, value);
  }

  get(key, defaultValue) {
    return this.data.get(key, defaultValue);
  }

  unset(key) {
    this._unset[key] = true;
    return this.data.unset(key);
  }
}
