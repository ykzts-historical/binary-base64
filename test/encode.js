const assert = require('assert');
const base64 = require('../base64');
const Buffer = require('buffer').Buffer;
const fs = require('fs');

describe('encode', function() {
  it('returns a base64 encoded string from a ascii string.', function() {
    const buffer = new Buffer('english');
    const binary = new Uint8Array(buffer);
    assert.equal('ZW5nbGlzaA==', base64.encode(binary));
  });

  it('returns a base64 encoded string from a UTF-8 string.', function() {
    const buffer = new Buffer('\u65e5\u672c\u8a9e');
    const binary = new Uint8Array(buffer);
    assert.equal('5pel5pys6Kqe', base64.encode(binary));
  });

  it('returns a base64 encoded string from a image binary.', function() {
    const buffer = fs.readFileSync(`${__dirname}/image.png`);
    const binary = new Uint8Array(buffer);
    assert.equal('iVBORw0KGgoAAAANSUhEUgAAADwAAA', base64.encode(binary).slice(0, 30));
  });
});
