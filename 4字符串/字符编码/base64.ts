import { utf8Encode, utf8Decode, ucs2Encode, ucs2Decode } from './Unicode';

const table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
const getV = function(char): number {
	if (char == '=') return 0;
	let index = table.indexOf(char);
	if (index == -1) throw new Error(`"${char}" not base64 char`);
	return index;
};
/**
 * 判断是否为TypeArray对像
 */
function isTypeArray(obj: any) {
	return (
		obj &&
		obj.buffer instanceof ArrayBuffer &&
		typeof obj.byteOffset === 'number' &&
		typeof obj.byteLength === 'number'
	);
}

/**
 * base64编码
 * @param u8arr {ArrayBuffer | Uint8Array | string}
 * @param encoding {string} 字符串编码方式 utf8 | utf16le/ucs2
 */
function encode(str: string, encoding?: string): string;
function encode(u8arr: ArrayBuffer | Uint8Array | string | any, encoding?: string): string {
	let _u8arr: { length: number };
	if (isTypeArray(u8arr)) {
		_u8arr = new Uint8Array(u8arr.buffer.slice(u8arr.byteOffset, u8arr.byteLength));
	} else if (u8arr instanceof ArrayBuffer || Array.isArray(u8arr)) {
		_u8arr = new Uint8Array(u8arr);
	} else {
		_u8arr = encoding == 'utf16le' ||  encoding == 'ucs2' ? ucs2Encode(u8arr.toString()) : utf8Encode(u8arr.toString());
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
	let _str64 = base64Str.replace(/=*$/, '');
	let mc4 = _str64.length % 4;
	if (mc4 === 1) throw new TypeError('The parameter is not a base64 string!');
	let bitLength = Math.floor((_str64.length * 6) / 8);
	_str64 += mc4 ? (mc4 === 2 ? 'AA' : 'A') : '';
	let buffer = new Uint8Array(bitLength);
	let index = 0;
	for (let i = 0; i < base64Str.length; ) {
		let c0 = getV(base64Str.charAt(i++));
		let c1 = getV(base64Str.charAt(i++));
		let c2 = getV(base64Str.charAt(i++));
		let c3 = getV(base64Str.charAt(i++));
		buffer[index++] = (c0 << 2) | (c1 >> 4);
		buffer[index++] = (c1 << 4) | (c2 >> 2);
		buffer[index++] = (c2 << 6) | c3;
	}
	return buffer;
}

function decodeIsUtf8(base64Str: string): string {
	var buffer = decode(base64Str);
	return utf8Decode(buffer);
}

function decodeIsUcs2(base64Str: string): string {
	var buffer = decode(base64Str);
	return ucs2Decode(buffer);
}

export { encode, decode, decodeIsUtf8, decodeIsUcs2 };
