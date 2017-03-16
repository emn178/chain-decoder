/**
 * [chain-decoder]{@link https://github.com/emn178/chain-decoder}
 *
 * @version 0.1.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2017
 */
(function () {
  var METHOD_ID = '0x2a2ee811';

  function extractNumber(data, block) {
    return parseInt('0x'+ extractBlock(data, block));
  }

  function extractBlock(data, block) {
    return data.substr(block * 64, 64);
  }

  function extractString(data, offset) {
    var length = parseInt('0x' + data.substr(offset * 2, 64));
    return convertToString(data.substr(offset * 2 + 64, length * 2));
  }

  function convertToString(hex) {
    var str = '', followingChars = 0, b, c, i = 0;
    hex.length
    while (i < hex.length) {
      b = parseInt(hex.substr(i, 2), 16);
      i += 2
      if (b <= 0x7F) {
        str += String.fromCharCode(b);
        continue;
      } else if (b > 0xBF && b <= 0xDF) {
        c = b & 0x1F;
        followingChars = 1;
      } else if (b <= 0xEF) {
        c = b & 0x0F;
        followingChars = 2;
      } else if (b <= 0xF7) {
        c = b & 0x07;
        followingChars = 3;
      } else {
        throw 'not a UTF-8 string';
      }

      for (var j = 0; j < followingChars; ++j) {
        b = parseInt(hex.substr(i, 2), 16);
        i += 2
        if (b < 0x80 || b > 0xBF) {
          throw 'not a UTF-8 string';
        }
        c <<= 6;
        c += b & 0x3F;
      }
      if (c >= 0xD800 && c <= 0xDFFF) {
        throw 'not a UTF-8 string';
      }
      if (c > 0x10FFFF) {
        throw 'not a UTF-8 string';
      }

      if (c <= 0xFFFF) {
        str += String.fromCharCode(c);
      } else {
        c -= 0x10000;
        str += String.fromCharCode((c >> 10) + 0xD800);
        str += String.fromCharCode((c & 0x3FF) + 0xDC00);
      }
    }
    return str;
  }


  window.chainDecode = function chainDecode(inputData) {
    if (inputData.indexOf(METHOD_ID) !== 0) {
      throw 'it is not chainchain data.';
    }
    inputData = inputData.substring(10);
    var nameOffset = extractNumber(inputData, 0);
    var descOffset = extractNumber(inputData, 1);
    return {
      durationInDays: extractNumber(inputData, 2),
      target: extractNumber(inputData, 3),
      ownerAddress: extractBlock(inputData, 4).substring(24),
      name: extractString(inputData, nameOffset),
      description: extractString(inputData, descOffset)
    };
  };
})();
