## level-dual-message

Allows one-to-one messaging to save between a public or private stream.

## Usage

    var LevelDualMessage = require('level-dual-message');

    var m = new LevelDualMessage('alice', {
      db: '/path/to/db'
    });

    // Parameters are: receiver name, message content, is public?, start key (or false), options (currently unused)
    m.add('bob', 'hi random text', true, false, {}, function (err, created) {

      // Parameters are: reciever name, is public?, reverse message order?
      m.getRecent('bob', true, false, function (err, msgs) {
        should.exist(msgs);
        done();
      });
    });
