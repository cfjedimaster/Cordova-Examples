// Add Angular integrations if Angular is available
if ((typeof angular === 'object') && angular.module) {
  angular.module('ionic.service.core', [])

  /**
   * @private
   * Provides a safe interface to store objects in persistent memory
   */
  .provider('persistentStorage', function() {
    return {
      '$get': [function() {
        var storage = Ionic.getService('Storage');
        if (!storage) {
          storage = new Ionic.IO.Storage();
          Ionic.addService('Storage', storage, true);
        }
        return storage;
      }]
    };
  })

  .factory('$ionicCoreSettings', [
    function() {
      return new Ionic.IO.Settings();
    }
  ])

  .factory('$ionicUser', [
    function() {
      return Ionic.User;
    }
  ])

  .run([function() {
    Ionic.io();
  }]);
}

