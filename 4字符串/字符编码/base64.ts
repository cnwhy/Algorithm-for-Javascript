import {utf8Encode, utf8Decode} from './Unicode'

const table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * base64编码
 * @param u8arr {ArrayBuffer | Uint8Array | string}
 */
function encode(u8arr: ArrayBuffer | Uint8Array | string):string {
	let _u8arr: { length: number };
	if (u8arr instanceof ArrayBuffer) {
		_u8arr = new Uint8Array(u8arr);
	} else if (u8arr['buffer'] && u8arr['buffer'] instanceof ArrayBuffer) {
		_u8arr = new Uint8Array(u8arr['buffer']);
	} else if (Array.isArray(u8arr)) {
		_u8arr = new Uint8Array(new Uint8Array(u8arr).buffer);
	}else if(typeof u8arr === 'string'){
		_u8arr = utf8Encode(u8arr);
	}else if(Array.isArray(u8arr)){
		_u8arr = new Uint8Array(u8arr)
	} else {
		return '';
	}
	let bitLength = Math.ceil((_u8arr.length * 8) / 6);
	let str64Length = Math.ceil(_u8arr.length / 3) * 4;
	let codes = new Uint8Array(str64Length);
	let index = 0;
	for (let i = 0; i < _u8arr.length; ) {
		let a0 = _u8arr[i++];
		let a1 = _u8arr[i++];
		let a2 = _u8arr[i++];
		codes[index++] = a0 >> 2;
		codes[index++] = ((a0 << 4) | (a1 >> 4)) & 63;
		codes[index++] = ((a1 << 2) | (a2 >> 6)) & 63;
		codes[index++] = a2 & 63;
	}
	return codes.reduce((d, code, i) => {
		return (d += i > bitLength - 1 ? '=' : table[code]);
	}, '');
}

/**
 * 将base64字符串解码为二进制数据
 *
 * @param {string} base64Str
 * @returns {Uint8Array}
 */
function decode(base64Str: string): Uint8Array {
	base64Str = base64Str.trim();
	if (base64Str.length % 4) throw new TypeError('传入的参数不是有效的base64字符串');
	base64Str = base64Str.replace(/=*$/, '');
	let bitLength = Math.floor((base64Str.length * 6) / 8);
	let buffer = new Uint8Array(bitLength);
	let index = 0;
	for (let i = 0; i < base64Str.length; ) {
		let c0 = table.indexOf(base64Str.charAt(i++));
		let c1 = table.indexOf(base64Str.charAt(i++));
		let c2 = table.indexOf(base64Str.charAt(i++));
		let c3 = table.indexOf(base64Str.charAt(i++));
		buffer[index++] = (c0 << 2) | (c1 >> 4);
		buffer[index++] = (c1 << 4) | (c2 >> 2);
		buffer[index++] = (c2 << 6) | c3;
	}
	return buffer;
}

function decodeIsUtf8(base64Str: string):string {
	var buffer = decode(base64Str);
	return utf8Decode(buffer);
}

export {
	encode,
	decode,
	decodeIsUtf8
}