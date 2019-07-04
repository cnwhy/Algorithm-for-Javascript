// 递归1
var k =0;
var isMatch0 = function(s, p) {
	// console.log(s, p);
	if (s === p) return true;
	var s_length = s.length;
	var p_length = p.length;
	var s0 = s.charAt(0);
	var p0 = p.charAt(0);
	var p0Any = p0 === '.';
	var s0pass = s && (p0Any || p0 === s0);
	// if(s0pass && isMatch(s.substr(1),p.substr(1))){
	// 	return true;
	// }
	// if(p.charAt(1) === '*'){
	// 	return isMatch(s, p.substr(2)) || (s0pass && isMatch(s.substr(1), p));
	// }

	if (s0pass) {
		if (s_length == 1 && p_length == 1) {
			return true; // 'a' 'a' | 'x' '.' 的情况
		} else if (isMatch(s.substr(1), p.substr(1))) {
			return true;
		}
	}
	if (p.charAt(1) === '*') {
		var _l = 0;
		while (_l <= s_length && (_l === 0 || p0Any || p0 === s.charAt(_l - 1))) {
			if (s_length == _l && p_length == 2) {
				return true; // 'x' 'x*' , '' 'a*' , 'xxx' 'x*' 的情况
			}
			if (isMatch(s.substr(_l), p.substr(2))) {
				return true;
			}
			_l++;
		}
	}
	return false;
};

// 递归2
var isMatch1 = function(text, pattern) {
	k++;
	if (text === pattern || pattern === '.*') return true;
	else if (!pattern) return !text;
	let first_match = text && (pattern[0] === text[0] || pattern[0] === '.');
	if (pattern.length >= 2 && pattern[1] === '*') {
		return isMatch(text, pattern.slice(2)) || (first_match && isMatch(text.slice(1), pattern));
	}
	return first_match && isMatch(text.slice(1), pattern.slice(1));
};


const isEqual = (sc, pc) => {
	return sc === pc || pc === '.';
};
// Time: O(m*n), Space: O(m*n)
var isMatch2 = function(s, p) {
	if (s == null || p == null) return false;
	let sl = s.length,
		pl = p.length;
	let d = Array.from({ length: sl + 1 }, _ => Array.from({ length: pl + 1 }, _ => false));
	d[0][0] = true;

	//记录 '' 情况
	for (let j = 1; j <= pl; ++j) {
		if (p[j - 1] === '*') d[0][j] = d[0][j - 2];
	}

	for (let i = 1; i <= sl; ++i) {
		for (let j = 1; j <= pl; ++j) {
			let sc = s[i - 1],
				pc = p[j - 1];
			if (isEqual(sc, pc)) {
				d[i][j] = d[i - 1][j - 1];
			} else if (pc === '*') {
				let preChar = p[j - 2];
				if (isEqual(sc, preChar)) {
					d[i][j] = d[i][j - 2] || d[i][j - 1] || d[i - 1][j];
				} else {
					// * 取 0
					d[i][j] = d[i][j - 2];
				}
			}
		}
	}
	return d[sl][pl];
};

let  isMatch = isMatch1;
console.time('a')
console.log(isMatch('', '') == true);
console.log(isMatch('a', 'a') == true);
console.log(isMatch('aa', 'aa') == true);
console.log(isMatch('a', 'aa') == false);
console.log(isMatch('aa', 'a') == false);
console.log(isMatch('aa', '') == false);
console.log(isMatch('', 'a') == false);

console.log('== 通配符 "." 测试 == ');
console.log(isMatch('x', '.') == true);
console.log(isMatch('xx', '..') == true);
console.log(isMatch('xb', '.b') == true);
console.log(isMatch('xb', 'x.') == true);
console.log(isMatch('xba', 'x.') == false);
console.log(isMatch('xb', 'x..') == false);
console.log(isMatch('xb', '..b') == false);
console.log(isMatch('', '.') == false);

console.log('== 通配符 "*" 测试 == ');
console.log(isMatch('a', 'a*') == true);
console.log(isMatch('a', '.*') == true);
console.log(isMatch('', 'a*') == true);
console.log(isMatch('', '.*') == true);
console.log(isMatch('aaab', 'a*ab') == true);
console.log(isMatch('aaab', 'a*b') == true);
console.log(isMatch('aaab', 'b*a*b') == true);
console.log(isMatch('.', 'a*.') == true);
console.log(isMatch('', 'a*b*') == true);
console.log(isMatch('ab', '.*c') == false);
console.timeEnd('a');
console.log(k);

/*
 "a" "a"
 "x" "."

 "a" "a*"
 "a" ".*"
 "aaa" 'a*'
 "xxx" '.*'


 */
