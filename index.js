'use strict';

var level = require('level');
var Sublevel = require('level-sublevel');
var concat = require('concat-stream');

var LevelDualMessage = function (user, options) {
  var setTime = function () {
    return Date.now();
  };

  if (!options) {
    options = {};
  }

  this.user = user;
  this.dbPath = options.db || './db';
  this.limit = options.limit || 10;
  this.db = Sublevel(level(this.dbPath, {
    createIfMissing: true,
    valueEncoding: 'json'
  }));

  var self = this;

  var setMessageType = function (receiver, isPublic) {
    if (isPublic) {
      self.messagesLevel = self.db.sublevel(self.user + '!' + receiver + '!public');
    } else {
      self.messagesLevel = self.db.sublevel(self.user + '!' + receiver + '!private');
    }
  };

  this.getRecent = function (user, isPublic, key, reverse, next) {
    setMessageType(user, isPublic);

    if (!key) {
      key = 0;
    }

    var rs = this.messagesLevel.createReadStream({
      start: key,
      reverse: reverse || false,
      limit: self.limit
    });

    rs.pipe(concat(function (messages) {
      next(null, {
        messages: messages || []
      });
    }));

    rs.on('error', function (err) {
      next(err);
    });
  };

  this.add = function (receiver, message, isPublic, next) {
    if (!message) {
      next(new Error('message cannot be empty'));
      return;
    }

    setMessageType(receiver, isPublic);

    var created = setTime();
    message.created = Math.floor(created / 1000);
    var content = {
      message: message
    };

    this.messagesLevel.put(created, content, function (err) {
      if (err) {
        next(err);
        return;
      }

      next(null, created);
      self.messagesLevel = null;
    });
  };

  this.del = function (key, receiver, isPublic, next) {
    setMessageType(receiver, isPublic);

    this.messagesLevel.del(key, function (err) {
      if (err) {
        next(err);
        return;
      }

      next(null, true);
    });
  };
};

module.exports = LevelDualMessage;
