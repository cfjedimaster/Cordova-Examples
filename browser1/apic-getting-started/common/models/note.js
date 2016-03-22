module.exports = function(Note) {
  Note.greet = function(msg, cb) {
    process.nextTick(function() {
      msg = msg || 'world';
      cb(null, 'Hello ' + msg);
    });
  };
};
