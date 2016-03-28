var fs = require('fs');
var pkg = require('../package.json');

var src = {
  'core': [
    'src/core/promise.js',
    'src/core/request.js',
    'src/core/events.js',
    'src/core/logger.js',
    'src/core/storage.js',
    'src/core/settings.js',
    'src/core/data-types.js',
    'src/core/core.js',
    'src/core/user.js',
    'src/core/app.js',
    'src/core/es5.js',
    'src/core/angular.js'
  ],

  'auth': [
    'src/auth/auth.js',
    'src/auth/es5.js',
    'src/auth/angular.js'
  ],

  'push': [
    'src/push/push-token.js',
    'src/push/push-message.js',
    'src/push/push-dev.js',
    'src/push/push.js',
    'src/push/es5.js',
    'src/push/angular.js'
  ],

  'deploy': [
    'src/deploy/deploy.js',
    'src/deploy/es5.js',
    'src/deploy/angular.js'
  ],

  'analytics': [
    'src/analytics/storage.js',
    'src/analytics/serializers.js',
    'src/analytics/analytics.js',
    'src/analytics/es5.js',
    'src/analytics/angular.js'
  ]
};

module.exports = {
  banner:
    '/**\n' +
    ' * Ionic Core Module\n' +
    ' * Copyright 2015 Ionic http://ionicframework.com/\n' +
    ' * See LICENSE in this repository for license information\n' +
    ' */\n\n',

  dist: './dist',

  sourceFiles: {
    'core': src.core,
    'push': src.push,
    'deploy': src.deploy,
    'analytics': src.analytics,
    'bundle': [].concat(
      src.core,
      src.auth,
      src.push,
      src.deploy,
      src.analytics
    )
  },

  versionData: {
    version: pkg.version
  }
};
