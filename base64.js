'use strict';

var base64 = (function() {
  var ENCODE_BASE64_TABLE = [];
  var DECODE_BASE64_TABLE = [];
  (function(characters) {
    var index, code;
    for (index = characters.length - 1; index >= 0; --index) {
      code = characters.charCodeAt(index);
      ENCODE_BASE64_TABLE[index] = code & 0xff;
      DECODE_BASE64_TABLE[code] = index;
    }
    DECODE_BASE64_TABLE['='.charCodeAt(0)] = 0;
  })('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/');

  function encode(source) {
    var sourceLength = source.length;
    var padding = 3 - (sourceLength % 3 || 3);
    var length = Math.floor((sourceLength + 2) / 3) * 4;
    var result = new Uint8Array(length);
    var cursor = 0;
    var i, bits;
    for (i = 0; i < sourceLength; cursor += 4, i += 3) {
      bits = (source[i] & 0xff) << 16
        | (source[i + 1] & 0xff) << 8
        | (source[i + 2] & 0xff);
      result[cursor] = ENCODE_BASE64_TABLE[bits >> 18 & 0x3f];
      result[cursor + 1] = ENCODE_BASE64_TABLE[bits >> 12 & 0x3f];
      result[cursor + 2] = ENCODE_BASE64_TABLE[bits >> 6 & 0x3f];
      result[cursor + 3] = ENCODE_BASE64_TABLE[bits & 0x3f];
    }
    while (padding--) {
      result[--cursor] = 61;
    }
    return String.fromCharCode.apply(null, result);
  }

  function decode(source) {
    var sourceLength = source.length;
    var padding = source.slice(sourceLength - 2).split('=').length - 1;
    var length = Math.floor((sourceLength + 3) / 4) * 3 - padding;
    var result = new Uint8Array(length);
    var cursor, i, bits;
    for (cursor = 0, i = 0; i < sourceLength; cursor += 3, i += 4) {
      bits = DECODE_BASE64_TABLE[source[i].charCodeAt(0)] << 18
        | DECODE_BASE64_TABLE[source[i + 1].charCodeAt(0)] << 12
        | DECODE_BASE64_TABLE[source[i + 2].charCodeAt(0)] << 6
        | DECODE_BASE64_TABLE[source[i + 3].charCodeAt(0)];
      result[cursor] = (bits >> 16) & 0xff;
      result[cursor + 1] = (bits >> 8) & 0xff;
      result[cursor + 2] = bits & 0xff;
    }
    return result;
  }

  return {
    encode: encode,
    decode: decode
  };
})();

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = base64;
}
