import { encode, decode, decodeIsUcs2, decodeIsUtf8 } from './base64';

let str = "火车头";
let b64u8 = encode(str);
let b64u16 = encode(str,'ucs2');

let buffer1 = Buffer.from(decode(b64u8));
let buffer2 = Buffer.from(decode(b64u16));

console.log('utf8',buffer1);
console.log('utf16',buffer2);

console.log(decodeIsUtf8(b64u8));
console.log(decodeIsUcs2(b64u16));

console.log(buffer1.toString('utf8'));
console.log(buffer2.toString('ucs2'));
