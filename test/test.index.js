'use strict';

process.env.NODE_ENV = 'test';

var should = require('should');
var child = require('child_process');
var LevelDualMessage = require('../index');

var m = new LevelDualMessage('jane', {
  db: './test/db',
  frequency: 1
});

var ttl = 10;

var message = {
  text: 'hi'
};

describe('LevelDualMessage', function () {
  after(function () {
    child.exec('rm -rf ./test/db');
  });

  it('should not add a message', function (done) {
    m.add('bob', false, false, {}, function (err) {
      should.exist(err);
      done();
    });
  });

  it('should add a public message', function (done) {
    m.add('bob', message, true, {}, function (err, created) {
      should.exist(created);
      m.getRecent('bob', true, false, function (err, msgs) {
        should.exist(msgs);
        done();
      });
    });
  });

  it('should add a private message', function (done) {
    m.add('bob', message, false, {}, function (err, created) {
      should.exist(created);
      m.getRecent('bob', false, false, function (err, msgs) {
        should.exist(msgs);
        done();
      });
    });
  });
});