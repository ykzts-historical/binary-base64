'use strict';

const ENCODE_BASE64_TABLE = [];
const DECODE_BASE64_TABLE = [];
(function(characters) {
  for (let index = characters.length - 1; index >= 0; --index) {
    let code = characters.charCodeAt(index);
    ENCODE_BASE64_TABLE[index] = code & 0xff;
    DECODE_BASE64_TABLE[code] = index;
  }
  DECODE_BASE64_TABLE['='.charCodeAt(0)] = 0;
})('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/');

function encode(source) {
  let sourceLength = source.length;
  let padding = 3 - (sourceLength % 3 || 3);
  let length = Math.floor((sourceLength + 2) / 3) * 4 + Math.floor(sourceLength / 72);
  let result = new Uint8Array(length);
  let cursor = 0;
  for (let i = 0; i < sourceLength; cursor += 4, i += 3) {
    let bits = (source[i] & 0xff) << 16
      | (source[i + 1] & 0xff) << 8
      | (source[i + 2] & 0xff);
    result[cursor] = ENCODE_BASE64_TABLE[bits >> 18 & 0x3f];
    result[cursor + 1] = ENCODE_BASE64_TABLE[bits >> 12 & 0x3f];
    result[cursor + 2] = ENCODE_BASE64_TABLE[bits >> 6 & 0x3f];
    result[cursor + 3] = ENCODE_BASE64_TABLE[bits & 0x3f]
  }
  while (padding--) {
    result[--cursor] = 61;
  }
  return String.fromCharCode.apply(null, result);
}

function decode(source) {
  let sourceLength = source.length;
  let padding = source.slice(sourceLength - 2).split('=').length - 1;
  let length = Math.floor((sourceLength + 3) / 4) * 3 - padding;
  let result = new Uint8Array(length);
  for (let cursor = 0, i = 0; i < sourceLength; cursor += 3, i += 4) {
    let bits = DECODE_BASE64_TABLE[source[i].charCodeAt(0)] << 18
      | DECODE_BASE64_TABLE[source[i + 1].charCodeAt(0)] << 12
      | DECODE_BASE64_TABLE[source[i + 2].charCodeAt(0)] << 6
      | DECODE_BASE64_TABLE[source[i + 3].charCodeAt(0)];
    result[cursor] = (bits >> 16) & 0xff;
    result[cursor + 1] = (bits >> 8) & 0xff;
    result[cursor + 2] = bits & 0xff;
  }
  return result;
}

module.exports = { encode, decode };
