## level-dual-message

Allows one-to-one messaging to save between a public or private stream.

## Usage

    var LevelDualMessage = require('level-dual-message');

    var m = new LevelDualMessage('alice', {
      db: '/path/to/db'
    });

    // Parameters are: receiver name, message content, is public?, callback
    m.add('bob', 'hi random text', true, function (err, created) {

      // Parameters are: reciever name, is public?, reverse message order?, callback
      m.getRecent('bob', true, false, function (err, msgs) {
        should.exist(msgs);
        done();
      });
    });
