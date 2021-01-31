
// Use a lookup table to find the index.
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

var lookup = new Uint8Array(256);
for (var i = 0; i < chars.length; ++i) {
    lookup[chars.charCodeAt(i)] = i;
}


function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

// todo: fix me ArrayBuffer és UInt8Array usage
function base64encode(string) {
    const bytes = stringToArrayBuffer(string);

    const len = bytes.length;
    let base64 = "";

    for (let i = 0; i < len; i += 3) {
        base64 += chars[bytes[i] >> 2];
        base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
        base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
        base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
        base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
}

    function stringToArrayBuffer(str) {
        'use strict'
        let Len = str.length,
          resPos = -1
        // The Uint8Array's length must be at least 3x the length of the string because an invalid UTF-16
        //  takes up the equivalent space of 3 UTF-8 characters to encode it properly.
        let resArr = new Uint8Array(Len * 3)
        for (let point = 0, nextcode = 0, i = 0; i !== Len; ) {
          point = str.charCodeAt(i)
          i += 1
          if (point >= 0xd800 && point <= 0xdbff) {
            if (i === Len) {
              resArr[(resPos += 1)] = 0xef /*0b11101111*/
              resArr[(resPos += 1)] = 0xbf /*0b10111111*/
              resArr[(resPos += 1)] = 0xbd /*0b10111101*/
              break
            }
            // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            nextcode = str.charCodeAt(i)
            if (nextcode >= 0xdc00 && nextcode <= 0xdfff) {
              point = (point - 0xd800) * 0x400 + nextcode - 0xdc00 + 0x10000
              i += 1
              if (point > 0xffff) {
                resArr[(resPos += 1)] = (0x1e /*0b11110*/ << 3) | (point >>> 18)
                resArr[(resPos += 1)] =
                  (0x2 /*0b10*/ << 6) | ((point >>> 12) & 0x3f) /*0b00111111*/
                resArr[(resPos += 1)] =
                  (0x2 /*0b10*/ << 6) | ((point >>> 6) & 0x3f) /*0b00111111*/
                resArr[(resPos += 1)] =
                  (0x2 /*0b10*/ << 6) | (point & 0x3f) /*0b00111111*/
                continue
              }
            } else {
              resArr[(resPos += 1)] = 0xef /*0b11101111*/
              resArr[(resPos += 1)] = 0xbf /*0b10111111*/
              resArr[(resPos += 1)] = 0xbd /*0b10111101*/
              continue
            }
          }
          if (point <= 0x007f) {
            resArr[(resPos += 1)] = (0x0 /*0b0*/ << 7) | point
          } else if (point <= 0x07ff) {
            resArr[(resPos += 1)] = (0x6 /*0b110*/ << 5) | (point >>> 6)
            resArr[(resPos += 1)] =
              (0x2 /*0b10*/ << 6) | (point & 0x3f) /*0b00111111*/
          } else {
            resArr[(resPos += 1)] = (0xe /*0b1110*/ << 4) | (point >>> 12)
            resArr[(resPos += 1)] =
              (0x2 /*0b10*/ << 6) | ((point >>> 6) & 0x3f) /*0b00111111*/
            resArr[(resPos += 1)] =
              (0x2 /*0b10*/ << 6) | (point & 0x3f) /*0b00111111*/
          }
        }
        return resArr.subarray(0, resPos + 1)
      }

function removeWhitespaces(s) {
    return s.replace(/[\s]/g, "");
}

function lookupBase64Char(charCode) {
    if (charCode === undefined || isNaN(charCode)) throw new Error(`Invalid base64 -- ${charCode}`);
    if (charCode > 256) throw new Error("Invalid base64 -- 2");
    const val = lookup[charCode];
    if (val === undefined) throw new Error("Invalid base64 -- 3");
    return val;
}

function base64decode(base64String) {
    const base64 = removeWhitespaces(base64String);

    let bufferLength = base64.length * 0.75;
    const len = base64.length;

    if (base64[base64.length - 1] === "=") {
        --bufferLength;

        if (base64[base64.length - 2] === "=") {
            --bufferLength;

        }
    }

    const arraybuffer = new ArrayBuffer(bufferLength);
    const bytes = new Uint8Array(arraybuffer);

    let p = 0;
    for (let i = 0; i < len; i += 4) {
        const encoded1 = lookupBase64Char(base64.charCodeAt(i));
        const encoded2 = lookupBase64Char(base64.charCodeAt(i + 1));
        const encoded3 = lookupBase64Char(base64.charCodeAt(i + 2));
        const encoded4 = lookupBase64Char(base64.charCodeAt(i + 3));

        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
}

exports.base64decode = base64decode
exports.base64encode = base64encode
exports.isEmpty = isEmpty