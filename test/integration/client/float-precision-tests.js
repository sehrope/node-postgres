var async = require('async');
var helper = require(__dirname + '/../test-helper');
var exec = require('child_process').exec;

var floatTestVals = [
  '0',
  '1',
  '100',
  '123.456',
  '123456.123456',
  '2099999997689999',
  '2099999997690000',
  '2099999997690001'
]

helper.pg.connect(helper.config, function(err, client, done) {
  assert.isNull(err);

  function testFloatRoundTrip(val, cb) {
    test('float round trip val=' + val, function() {
      var sql = 'SELECT $1::float8 AS val'
      client.query(sql, [val], function(err, result){
        assert.isNull(err);
        assert.equal(result.rows[0].val, val);
        cb(null);
      });
    });
  };

  async.eachSeries(floatTestVals, testFloatRoundTrip, function(err, results){
    assert.isNull(err || null);
    done();
    helper.pg.end();
  });
});
