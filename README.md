# binary-base64

This is a base64 encoding/decoding library.

## Install

```sh
$ npm install binary-base64 --save
```

## Usage

```javascript
import base64 from 'binary-base64';

async function getDataUri(uri) {
  const response = await fetch(uri);
  const buffer = new Uint8Array(await response.arrayBuffer());
  const type = response.headers.get('content-type');
  return `data:${type};base64,${base64.encode(buffer)}`;
}

function getBlobFromDataUri(uri) {
  return new Promise(function(resolve, reject) {
    const [ , type, base64EncodedString ] = uri.match('data:([^;]+);base64,(.+)') || [];
    if (typeof type === 'undefined' && typeof base64EncodedString === 'undefined') {
      return reject(new TypeError('Invalid data URI.'));
    }
    return resolve(new Blob([base64.decode(base64EncodedString)], { type }));
  });
}

(async function() {
  const dataUri = await getDataUri('https://www.gravatar.com/avatar/b9025074d487cd0328f1dc816e5ac50a.jpg');
  console.log(dataUri);
  const blob = await getBlobFromDataUri(dataUri);
  console.log(URL.createObjectURL(blob));
})();
```
