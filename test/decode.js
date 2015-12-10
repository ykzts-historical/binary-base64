const assert = require('assert');
const base64 = require('../base64');
const Buffer = require('buffer').Buffer;

describe('decode', function() {
  it('returns a ascii string from a base64 encoded string.', function() {
    const string = new Buffer(base64.decode('ZW5nbGlzaA==')).toString();
    assert.equal('english', string);
  });

  it('returns a UTF-8 string string from a base64 encoded.', function() {
    const string = new Buffer(base64.decode('5pel5pys6Kqe')).toString();
    assert.equal('\u65e5\u672c\u8a9e', string);
  });
});
