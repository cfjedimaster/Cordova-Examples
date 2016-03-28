import { APIRequest } from "../core/request";
import { DeferredPromise } from "../core/promise";
import { Settings } from "../core/settings";
import { PlatformLocalStorageStrategy, LocalSessionStorageStrategy } from "../core/storage";
import { User } from "../core/user";

var settings = new Settings();
var storage = new PlatformLocalStorageStrategy();
var sessionStorage = new LocalSessionStorageStrategy();

var __authModules = {};
var __authToken = null;

var authAPIBase = settings.getURL('platform-api') + '/auth';
var authAPIEndpoints = {
  'login': function(provider) {
    if (provider) {
      return authAPIBase + '/login/' + provider;
    }
    return authAPIBase + '/login';
  },
  'signup': function() {
    return authAPIBase + '/users';
  }
};

export class TempTokenContext {

  static get label() {
    return "ionic_io_auth_" + settings.get('app_id');
  }

  static delete() {
    sessionStorage.remove(TempTokenContext.label);
  }

  static store() {
    sessionStorage.set(TempTokenContext.label, __authToken);
  }

  static getRawData() {
    return sessionStorage.get(TempTokenContext.label) || false;
  }
}

export class TokenContext {
  static get label() {
    return "ionic_io_auth_" + settings.get('app_id');
  }

  static delete() {
    storage.remove(TokenContext.label);
  }

  static store() {
    storage.set(TokenContext.label, __authToken);
  }

  static getRawData() {
    return storage.get(TokenContext.label) || false;
  }
}

function storeToken(options, token) {
  __authToken = token;
  if (typeof options === 'object' && options.remember) {
    TokenContext.store();
  } else {
    TempTokenContext.store();
  }
}

class InAppBrowserFlow {
  constructor(authOptions, options, data) {

    var deferred = new DeferredPromise();

    if (!window || !window.cordova || !window.cordova.InAppBrowser) {
      deferred.reject("Missing InAppBrowser plugin");
    } else {
      new APIRequest({
        'uri': authAPIEndpoints.login(options.provider),
        'method': options.uri_method || 'POST',
        'json': {
          'app_id': settings.get('app_id'),
          'callback': options.callback_uri || window.location.href,
          'data': data
        }
      }).then(function(data) {
        var loc = data.payload.data.url;
        var tempBrowser = window.cordova.InAppBrowser.open(loc, '_blank', 'location=no');
        tempBrowser.addEventListener('loadstart', function(data) {
          if (data.url.slice(0, 20) === 'http://auth.ionic.io') {
            var queryString = data.url.split('#')[0].split('?')[1];
            var paramParts = queryString.split('&');
            var params = {};
            for (var i = 0; i < paramParts.length; i++) {
              var part = paramParts[i].split('=');
              params[part[0]] = part[1];
            }
            storeToken(authOptions, params.token);
            tempBrowser.close();
            deferred.resolve(true);
          }
        });
      }, function(err) {
        deferred.reject(err);
      });
    }

    return deferred.promise;
  }
}

function getAuthErrorDetails(err) {
  var details = [];
  try {
    details = err.response.body.error.details;
  } catch (e) { e; }
  return details;
}

export class Auth {

  static isAuthenticated() {
    var token = TokenContext.getRawData();
    var tempToken = TempTokenContext.getRawData();
    if (tempToken || token) {
      return true;
    }
    return false;
  }

  static login(moduleId, options, data) {
    var deferred = new DeferredPromise();
    var context = __authModules[moduleId] || false;
    if (!context) {
      throw new Error("Authentication class is invalid or missing:" + context);
    }
    context.authenticate.apply(context, [options, data]).then(function() {
      User.self().then(function(user) {
        deferred.resolve(user);
      }, function(err) {
        deferred.reject(err);
      });
    }, function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }

  static signup(data) {
    var context = __authModules.basic || false;
    if (!context) {
      throw new Error("Authentication class is invalid or missing:" + context);
    }
    return context.signup.apply(context, [data]);
  }

  static logout() {
    TokenContext.delete();
    TempTokenContext.delete();
  }

  static register(moduleId, module) {
    if (!__authModules[moduleId]) {
      __authModules[moduleId] = module;
    }
  }

  static getUserToken() {
    var usertoken = TokenContext.getRawData();
    var temptoken = TempTokenContext.getRawData();
    var token = temptoken || usertoken;
    if (token) {
      return token;
    }
    return false;
  }

}


class BasicAuth {

  static authenticate(options, data) {
    var deferred = new DeferredPromise();

    new APIRequest({
      'uri': authAPIEndpoints.login(),
      'method': 'POST',
      'json': {
        'app_id': settings.get('app_id'),
        'email': data.email,
        'password': data.password
      }
    }).then(function(data) {
      storeToken(options, data.payload.data.token);
      deferred.resolve(true);
    }, function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  static signup(data) {
    var deferred = new DeferredPromise();

    var userData = {
      'app_id': settings.get('app_id'),
      'email': data.email,
      'password': data.password
    };

    // optional details
    if (data.username) { userData.username = data.username; }
    if (data.image) { userData.image = data.image; }
    if (data.name) { userData.name = data.name; }
    if (data.custom) { userData.custom = data.custom; }

    new APIRequest({
      'uri': authAPIEndpoints.signup(),
      'method': 'POST',
      'json': userData
    }).then(function() {
      deferred.resolve(true);
    }, function(err) {
      var errors = [];
      var details = getAuthErrorDetails(err);
      if (details instanceof Array) {
        for (var i = 0; i < details.length; i++) {
          var detail = details[i];
          if (typeof detail === 'object') {
            if (detail.error_type) {
              errors.push(detail.error_type + "_" + detail.parameter);
            }
          }
        }
      }
      deferred.reject({ "errors": errors });
    });

    return deferred.promise;
  }
}

class CustomAuth {
  static authenticate(options, data) {
    return new InAppBrowserFlow(options, { 'provider': 'custom' }, data);
  }
}

class TwitterAuth {
  static authenticate(options, data) {
    return new InAppBrowserFlow(options, { 'provider': 'twitter' }, data);
  }
}

class FacebookAuth {
  static authenticate(options, data) {
    return new InAppBrowserFlow(options, { 'provider': 'facebook' }, data);
  }
}

class GithubAuth {
  static authenticate(options, data) {
    return new InAppBrowserFlow(options, { 'provider': 'github' }, data);
  }
}

class GoogleAuth {
  static authenticate(options, data) {
    return new InAppBrowserFlow(options, { 'provider': 'google' }, data);
  }
}

class InstagramAuth {
  static authenticate(options, data) {
    return new InAppBrowserFlow(options, { 'provider': 'instagram' }, data);
  }
}

class LinkedInAuth {
  static authenticate(options, data) {
    return new InAppBrowserFlow(options, { 'provider': 'linkedin' }, data);
  }
}

Auth.register('basic', BasicAuth);
Auth.register('custom', CustomAuth);
Auth.register('facebook', FacebookAuth);
Auth.register('github', GithubAuth);
Auth.register('google', GoogleAuth);
Auth.register('instagram', InstagramAuth);
Auth.register('linkedin', LinkedInAuth);
Auth.register('twitter', TwitterAuth);
