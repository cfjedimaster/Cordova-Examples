import { DeferredPromise } from "./promise";

export class PlatformLocalStorageStrategy {
  constructor() {

  }

  get(key) {
    return window.localStorage.getItem(key);
  }

  remove(key) {
    return window.localStorage.removeItem(key);
  }

  set(key, value) {
    return window.localStorage.setItem(key, value);
  }
}

export class LocalSessionStorageStrategy {
  get(key) {
    return window.sessionStorage.getItem(key);
  }

  remove(key) {
    return window.sessionStorage.removeItem(key);
  }

  set(key, value) {
    return window.sessionStorage.setItem(key, value);
  }
}

var objectCache = {};
var memoryLocks = {};

export class Storage {
  constructor() {
    this.strategy = new PlatformLocalStorageStrategy();
  }

  /**
   * Stores an object in local storage under the given key
   * @param {string} key Name of the key to store values in
   * @param {object} object The object to store with the key
   * @return {void}
   */
  storeObject(key, object) {
    // Convert object to JSON and store in localStorage
    var json = JSON.stringify(object);
    this.strategy.set(key, json);

    // Then store it in the object cache
    objectCache[key] = object;
  }

  deleteObject(key) {
    this.strategy.remove(key);
    delete objectCache[key];
  }

  /**
   * Either retrieves the cached copy of an object,
   * or the object itself from localStorage.
   * @param {string} key The name of the key to pull from
   * @return {mixed} Returns the previously stored Object or null
   */
  retrieveObject(key) {
    // First check to see if it's the object cache
    var cached = objectCache[key];
    if (cached) {
      return cached;
    }

    // Deserialize the object from JSON
    var json = this.strategy.get(key);

    // null or undefined --> return null.
    if (json === null) {
      return null;
    }

    try {
      return JSON.parse(json);
    } catch (err) {
      return null;
    }
  }

  /**
   * Locks the async call represented by the given promise and lock key.
   * Only one asyncFunction given by the lockKey can be running at any time.
   *
   * @param {string} lockKey should be a string representing the name of this async call.
   *        This is required for persistence.
   * @param {function} asyncFunction Returns a promise of the async call.
   * @returns {Promise} A new promise, identical to the one returned by asyncFunction,
   *          but with two new errors: 'in_progress', and 'last_call_interrupted'.
   */
  lockedAsyncCall(lockKey, asyncFunction) {

    var self = this;
    var deferred = new DeferredPromise();

    // If the memory lock is set, error out.
    if (memoryLocks[lockKey]) {
      deferred.reject('in_progress');
      return deferred.promise;
    }

    // If there is a stored lock but no memory lock, flag a persistence error
    if (this.strategy.get(lockKey) === 'locked') {
      deferred.reject('last_call_interrupted');
      deferred.promise.then(null, function() {
        self.strategy.remove(lockKey);
      });
      return deferred.promise;
    }

    // Set stored and memory locks
    memoryLocks[lockKey] = true;
    self.strategy.set(lockKey, 'locked');

    // Perform the async operation
    asyncFunction().then(function(successData) {
      deferred.resolve(successData);

      // Remove stored and memory locks
      delete memoryLocks[lockKey];
      self.strategy.remove(lockKey);
    }, function(errorData) {
      deferred.reject(errorData);

      // Remove stored and memory locks
      delete memoryLocks[lockKey];
      self.strategy.remove(lockKey);
    }, function(notifyData) {
      deferred.notify(notifyData);
    });

    return deferred.promise;
  }
}
