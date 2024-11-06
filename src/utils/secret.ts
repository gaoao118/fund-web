import CryptoJS from 'crypto-js/crypto-js';
import {JSEncrypt} from "jsencrypt";

const aes_key = '4543132b12f9048f4546329993b0ba74'; // 密钥后端提供
const xor_key = 'ht3QCXh#L!Er7ube8x4vtDx&Knu9EC*6j$N^fPqkB^QHvWJgXBPEzTTY9UyexVU4'; // 密钥后端提供
const public_key = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCNX9pxMHcWBoCYgrPzLXB6Ks/rfLQtp6ZSoUsaXAM7AcDTIUyfxeKLHTCoyZm/EyQh+Z7Xad/13xOYs0XGqakb2iRNvUPOgi0eU7MO0nV0EqNIGuf5tf5GLge3R0RI+uU18EvDELR40P1zTlS2wrU3jjbqgTy3wcCOJlR6IV0nZQIDAQAB'; // 密钥后端提供
const encryptor = new JSEncrypt();  // 创建加密对象实例
encryptor.setPublicKey(public_key)//设置公钥

/**
 * AES加密 ：字符串 key iv  返回base64
 */
export function Encrypt(word, key) {
  if (!key) {
    key = xor_key;
  }
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, CryptoJS.enc.Hex.parse(aes_key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  let aesStr = CryptoJS.enc.Hex.stringify(encrypted.ciphertext);
  //异或加密
  let data = encrypto(aesStr, key);
  return rsaEncrypt(data);
}

/**
 * encrypto 加密程序
 */
export function encrypto(word, key) {
  let data = '';
  for (let i = 0, j = 0; i < word.length; i++, j++) {
    if (j == key.length) {
      j = 0;
    }
    let number = word.charCodeAt(i) ^ key.charCodeAt(j);
    let strCipher = number.toString(16);
    if (strCipher.length == 1) {
      data = data + "0" + strCipher;
    } else {
      data += strCipher;
    }
  }
  return data;
}


/**
 * 最长加密长度
 */
const MAX_ENCRYPT_BLOCK = 117

/**
 * 最长解码长度
 */
const MAX_DECRYPT_BLOCK = 128

/**
 * RSA加密
 */
export function rsaEncrypt(Encstr) {
  return encryptor.encryptLong2(Encstr);
}

const b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const b64pad = "=";
JSEncrypt.prototype.encryptLong2 = function (string) {
  const k = this.getKey();
  try {
    const lt = "";
    let ct = "";
    //RSA每次加密117bytes，需要辅助方法判断字符串截取位置
    //1.获取字符串截取点
    const bytes = new Array();
    bytes.push(0);
    let byteNo = 0;
    let len, c;
    // eslint-disable-next-line prefer-const
    len = string.length;
    let temp = 0;
    // eslint-disable-next-line no-var
    for (var i = 0; i < len; i++) {
      c = string.charCodeAt(i);
      if (c >= 0x010000 && c <= 0x10FFFF) {
        byteNo += 4;
      } else if (c >= 0x000800 && c <= 0x00FFFF) {
        byteNo += 3;
      } else if (c >= 0x000080 && c <= 0x0007FF) {
        byteNo += 2;
      } else {
        byteNo += 1;
      }
      if ((byteNo % 117) >= 114 || (byteNo % 117) == 0) {
        if (byteNo - temp >= 114) {
          bytes.push(i);
          temp = byteNo;
        }
      }
    }
    //2.截取字符串并分段加密
    if (bytes.length > 1) {
      // eslint-disable-next-line no-var
      for (var i = 0; i < bytes.length - 1; i++) {
        // eslint-disable-next-line no-var
        var str;
        if (i == 0) {
          str = string.substring(0, bytes[i + 1] + 1);
        } else {
          str = string.substring(bytes[i] + 1, bytes[i + 1] + 1);
        }
        const t1 = k.encrypt(str);
        ct += addPreZero(t1, 256);
      }
      ;
      if (bytes[bytes.length - 1] != string.length - 1) {
        const lastStr = string.substring(bytes[bytes.length - 1] + 1);
        const rsaStr = k.encrypt(lastStr)
        ct += addPreZero(rsaStr, 256);
      }
      //console.log("加密完的数据："+ct);
      return hex2b64(ct);
    }
    const t = k.encrypt(string);
    const y = hex2b64(t);
    return y;
  } catch (ex) {
    return false;
  }
}

//  在JsEncrypt原型上写了分段加密方法 encryptLong 使用时替换encrypt方法即可
function hex2b64(h) {
  let i;
  let c;
  let ret = "";
  for (i = 0; i + 3 <= h.length; i += 3) {
    c = parseInt(h.substring(i, i + 3), 16);
    ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
  }
  if (i + 1 == h.length) {
    c = parseInt(h.substring(i, i + 1), 16);
    ret += b64map.charAt(c << 2);
  } else if (i + 2 == h.length) {
    c = parseInt(h.substring(i, i + 2), 16);
    ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
  }
  while ((ret.length & 3) > 0) ret += b64pad;
  return ret;
}

function hexToBytes(hex: string) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

function bytesToHex(bytes: string | any[]) {
  for (var hex = [], i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] >>> 4).toString(16));
    hex.push((bytes[i] & 0xF).toString(16));
  }
  return hex.join("");
}

function b64tohex(str: string) {
  for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
    var tmp = bin.charCodeAt(i).toString(16);
    if (tmp.length === 1) tmp = "0" + tmp;
    hex[hex.length] = tmp;
  }
  return hex.join("");
}

function addPreZero(num, length) {
  var t = (num + '').length,
    s = '';
  for (var i = 0; i < length - t; i++) {
    s += '0';
  }

  return s + num;
}


