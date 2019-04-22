/**
 * Unicode Utf8 编码
 *
 * @param {number} codePoint Unicode 码点
 * @returns {Uint8Array} 返回字节数据
 */
function u2utf8(codePoint: number): Uint8Array {
	if (codePoint < 0x80) {
		return new Uint8Array([codePoint]);
	}
	if (codePoint > 0x7fffffff) throw new SyntaxError('Undefined Unicode code-point');
	let n = 11;
	while (codePoint > 2 ** n) {
		n += 5;
	}
	let length = Math.ceil(n / 6);
	let u8 = new Uint8Array(length);
	let i = 0;
	u8[0] = (0xff ^ (2 ** (8 - length) - 1)) | (codePoint >> (6 * (length - 1)));
	while (i < length - 1) {
		u8[length - 1 - i] = 0x80 | ((codePoint >> (i * 6)) & 0x3f);
		i++;
	}
	return u8;
}

/**
 * Unicode Utf16 编码 (字节序默认)
 *
 * @param {number} codePoint Unicode 码点
 * @returns {Uint8Array} 返回字节数据
 */
function u2utf16(codePoint: number): Uint8Array {
	if (codePoint > 0x10ffff) throw new SyntaxError('Undefined Unicode code-point');
	if (codePoint < 0x10000) {
		return new Uint8Array(new Uint16Array([codePoint]).buffer);
	} else {
		let _code = codePoint - 0x10000;
		return new Uint8Array(new Uint16Array([0xd800 | (_code >> 10), 0xdc00 | (_code & 0x3ff)]).buffer);
	}
}

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
 * 字符串 UCS2/UTF16 编码
 * @param str
 */
function ucs2Encode(str: string) {
	//javascript 字符串本身是 UCS2 直接转出即可
	let buffer = new Uint16Array(str.length);
	for (var i = 0; i < str.length; i++) {
		buffer[i] = str.charCodeAt(i);
	}
	return new Uint8Array(buffer.buffer);
}

/**
 * UCS2/UTF16 编码 转字符串
 * @param u8arr
 */
function ucs2Decode(u8arr: ArrayBuffer | Uint8Array) {
	let u16: { length: number };
	if (u8arr instanceof ArrayBuffer) {
		u16 = new Uint16Array(u8arr);
	} else if (isTypeArray(u8arr)) {
		u16 = new Uint16Array(u8arr.buffer, u8arr.byteOffset, u8arr.byteLength);
	} else if (Array.isArray(u8arr)) {
		// 先转字节数组 , 防超出一个字节的值
		u16 = new Uint16Array(new Uint8Array(u8arr).buffer);
	} else {
		return '';
	}
	let str = '';
	for (let i = 0; i < u16.length; i++) {
		str += String.fromCharCode(u16[i]);
	}
	return str;
}

/**
 * 字符串 UTF8 编码
 * @param str
 */
function utf8Encode(str) {
	let utf8 = [];
	let codePoints = [];

	//先转为Unicode
	for (var i = 0; i < str.length; i++) {
		let code = str.charCodeAt(i);
		let cod1;
		if (code < 0xd800) {
			codePoints.push(code);
		} else if (code < 0xdc00 && (cod1 = str.charCodeAt(i + 1)) >= 0xdc00 && cod1 < 0xe000) {
			i++;
			codePoints.push(0x10000 + (((code & 0x3ff) << 10) | (cod1 & 0x3ff)));
		} else {
			//编码不正常处理
			// 1. 不处理, 转base64, 可无损转回原始字符串
			codePoints.push(code);

			// 2. 处理为占位符 , new Buffer(str) 默认认处理方式
			// codePoints.push(0xfffd) //处理为 �
		}
	}

	codePoints.forEach(v => {
		utf8.push.apply(utf8, Array.from(u2utf8(v)));
	});
	return new Uint8Array(utf8);
}
/**
 * UTF8 编码 转字符串
 * @param str
 */
function utf8Decode(buffer: ArrayBuffer | Uint8Array | any): string {
	let u8: Uint8Array;
	if (isTypeArray(buffer)) {
		u8 = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
	} else if (buffer instanceof ArrayBuffer || Array.isArray(buffer)) {
		u8 = new Uint8Array(buffer);
	} else {
		return '';
	}
	let str = '';
	function setChar(i): number {
		let _i = i;
		let c0 = u8[_i++];
		try {
			if (c0 < 0x80) {
				str += String.fromCharCode(c0);
				return _i;
			} else if (c0 < 0xc2) {
				//  多字节 `u+0080` 转第一位最小值是 1100 0010 , 0000 0000
				throw 'code err';
			} else {
				let mk = 0xc0;
				let w = 5;
				let cs = [u8[_i++]];
				let code = 0;
				while (c0 >= (mk | (2 ** w))) {
					cs.push(u8[_i++]);
					mk = mk | (2 ** w);
					w--;
				}
				if (w < 1) throw 'code err';
				cs = cs.reverse();
				for (let k = 0; k < cs.length; k++) {
					let _c = cs[k] & 0x3f;
					code |= _c << (k * 6);
				}
				code |= (c0 & (2 ** w - 1)) << (cs.length * 6);
				if (code > 0x10000) {
					let _code = code - 0x10000;
					str += String.fromCharCode(0xd800 | (_code >> 10));
					str += String.fromCharCode(0xdc00 | (_code & 0x3ff));
				} else {
					str += String.fromCharCode(code & 0xffff);
				}
				return _i;
			}
		} catch (e) {
			str += String.fromCharCode(c0);
			return i + 1;
		}
	}
	let index = 0;
	while (index < u8.length) {
		index = setChar(index);
	}
	return str;
}

export { u2utf8, u2utf16, utf8Encode, utf8Decode, ucs2Encode, ucs2Decode };
