'use strict';

var base64 = (function() {
  var ENCODE_BASE64_TABLE = [
     65,  66,  67,  68,  69,  70,  71,  72,
     73,  74,  75,  76,  77,  78,  79,  80,
     81,  82,  83,  84,  85,  86,  87,  88,
     89,  90,  97,  98,  99, 100, 101, 102,
    103, 104, 105, 106, 107, 108, 109, 110,
    111, 112, 113, 114, 115, 116, 117, 118,
    119, 120, 121, 122,  48,  49,  50,  51,
     52,  53,  54,  55,  56,  57,  43,  47
  ];
  var DECODE_BASE64_TABLE = [
     0,  0,  0,  0,  0,  0,  0,  0,
     0,  0,  0,  0,  0,  0,  0,  0,
     0,  0,  0,  0,  0,  0,  0,  0,
     0,  0,  0,  0,  0,  0,  0,  0,
     0,  0,  0,  0,  0,  0,  0,  0,
     0,  0,  0, 62,  0,  0,  0, 63,
    52, 53, 54, 55, 56, 57, 58, 59,
    60, 61,  0,  0,  0,  0,  0,  0,
     0,  0,  1,  2,  3,  4,  5,  6,
     7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22,
    23, 24, 25,  0,  0,  0,  0,  0,
     0, 26, 27, 28, 29, 30, 31, 32,
    33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48,
    49, 50, 51,  0,  0,  0,  0,  0
  ];

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
