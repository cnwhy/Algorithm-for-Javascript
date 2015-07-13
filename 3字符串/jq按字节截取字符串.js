String.getBlength = function(str) {
    for (var i = str.length, n = 0; i--;) {
        n += str.charCodeAt(i) > 255 ? 2 : 1;
    }
    return n;
}

String.cutByte = function(str, len, endstr) {
    var len = +len,
        endstr = typeof(endstr) == 'undefined' ? "..." : endstr.toString(),
        lenB = this.getBlength(endstr);
    //用于二分法查找
    function n2(a) {
        var n = a / 2 | 0;
        return (n > 0 ? n : 1);
    }
    if (!(str + "").length || !len || len <= 0) {
        return "";
    }
    if (str.length * 2 <= len || this.getBlength(str) <= len) {
        return str;
    }
    var strlength = str.length,
        lenS = len - lenB,
        i = 0,
        _lenS = 0;
    while (_lenS <= lenS) {
        _lenS += str.charCodeAt(i++) > 255 ? 2 : 1;
    }
    return str.substr(0, i - 1) + endstr
}

//按指定字节截取字符串(直接算)
String.cutByte1 = function(str, len, endstr) {
    var len = +len,
        endstr = typeof(endstr) == 'undefined' ? "..." : endstr.toString(),
        lenB = this.getBlength(endstr);
    //用于二分法查找
    function n2(a) {
        var n = a / 2 | 0;
        return (n > 0 ? n : 1);
    }
    if (!(str + "").length || !len || len <= 0) {
        return "";
    }
    if (str.length * 2 <= len || this.getBlength(str) <= len) {
        return str;
    }
    var strlength = str.length,
        lenS = len - lenB,
        i = n2(lenS),
        _lenS = String.getBlength(str.substr(0, i));
    while (_lenS <= lenS) {
        _lenS += str.charCodeAt(i++) > 255 ? 2 : 1;
    }
    return str.substr(0, i - 1) + endstr
}

//按指定字节截取字符串(直接算)
String.cutByte2 = function(str, len, endstr) {
    var len = +len,
        endstr = typeof(endstr) == 'undefined' ? "..." : endstr.toString(),
        lenB = this.getBlength(endstr),
        strlength = str.length
        //用于二分法查找
    function n2(a) {
        var n = a / 2 | 0;
        return (n > 0 ? n : 1);
    }
    if (!strlength || !len || len <= 0) {
        return "";
    }
    if (strlength * 2 <= len || this.getBlength(str) <= len) {
        return str;
    }
    var lenS = len - lenB,
        i = 0,
        _lenS = 0;
    while (_lenS <= lenS) {
        var _i = i;
        if (i >= strlength) {
            return str;
        }
        i += n2(lenS - _lenS)
        _lenS += String.getBlength(str.substr(_i, i))
    }
    return str.substr(0, i - 1) + endstr
}

String.cutByte3 = function(str, len, endstr) {
    var len = +len,
        endstr = typeof(endstr) == 'undefined' ? "..." : endstr.toString();

    function n2(a) {
            var n = a / 2 | 0;
            return (n > 0 ? n : 1)
        } //用于二分法查找
    if (!(str + "").length || !len || len <= 0) {
        return "";
    }
    if (str.length * 2 <= len || this.getBlength(str) <= len) {
        return str;
    }
    var lenS = len - this.getBlength(endstr),
        _lenS = 0,
        _strl = 0
    while (_strl <= lenS) {
        var _lenS1 = n2(lenS - _strl)
        _strl += this.getBlength(str.substr(_lenS, _lenS1))
        _lenS += _lenS1
    }
    return str.substr(0, _lenS - 1) + endstr
}

String.cutByte4 = function(str, len, endstr) {
    function n2(a) {
        var n = a / 2 | 0;
        return (n > 0 ? n : 1)
    }
    var len = +len,
        endstr = typeof(endstr) == 'undefined' ? "..." : endstr.toString(),
        endstrBl = this.getBlength(endstr);
    if (!(str + "").length || !len || len <= 0) {
        return "";
    }
    if (len < endstrBl) {
        endstr = "";
        endstrBl = 0;
    }
    var lenS = len - endstrBl,
        _lenS = 0,
        _strl = 0;
    while (_strl <= lenS) {
        var _lenS1 = n2(lenS - _strl),
            addn = this.getBlength(str.substring(_lenS, _lenS1));
        if (addn == 0) {
            return str;
        }
        _strl += addn
        _lenS += _lenS1
    }
    if (str.length - _lenS > endstrBl || this.getBlength(str.substring(_lenS - 1)) > endstrBl) {
        return str.substring(0, _lenS - 1) + endstr
    } else {
        return str;
    }
}

String.cutByte4 = function(str, len, endstr) {
    function n2(a) {
        var n = a / 2 | 0;
        return (n > 0 ? n : 1)
    }
    var len = +len,
        endstr = typeof(endstr) == 'undefined' ? "..." : endstr.toString(),
        endstrBl = this.getBlength(endstr);
    if (!(str + "").length || !len || len <= 0) {
        return "";
    }
    if (len < endstrBl) {
        endstr = "";
        endstrBl = 0;
    }
    var lenS = len - endstrBl,
        _lenS = 0,
        _strl = 0;
    console.log("b", _strl, lenS);
    while (_strl <= lenS) {
        var _lenS1 = n2(lenS - _strl),
            addn = this.getBlength(str.substr(_lenS, _lenS1));
        console.log(_strl, lenS, _lenS, _lenS1, addn);
        if (addn == 0 && _lenS > str.length) {
            return str;
        }
        _strl += addn
        _lenS += _lenS1
    }
    console.log(str.length, _lenS, endstrBl);
    if (str.length - _lenS > endstrBl || this.getBlength(str.substring(_lenS - 1)) > endstrBl) {
        return str.substr(0, _lenS - 1) + endstr
    } else {
        return str;
    }
}

var str = "javascript 高效按字节截取字符串方法 getBlengthjavascript 高效按字节截取字符串方法 getBlength高效按字节截取字符串方法 getBlength";
str = str.replace(/./g, str).replace(/./g, str).replace(/.{3}/g, str);
console.log("创造的字符串长度为：", str.length, "字节长度为", String.getBlength(str));
var numb = 200000
var time1 = new Date();
for (var i = 0; i < 100; i++) {
    String.cutByte(str, numb, '...')
}
console.log("耗时：", new Date() - time1, String.cutByte(str, numb, '...').length);
var time2 = new Date();
for (var i = 0; i < 100; i++) {
    String.cutByte1(str, numb, '...')
}
console.log("耗时：", new Date() - time2, String.cutByte1(str, numb, '...').length);
var time3 = new Date();
for (var i = 0; i < 100; i++) {
    String.cutByte2(str, numb, '...')
}
console.log("耗时：", new Date() - time3, String.cutByte2(str, numb, '...').length);
var time4 = new Date();
for (var i = 0; i < 100; i++) {
    String.cutByte3(str, numb, '...')
}
console.log("耗时：", new Date() - time4, String.cutByte3(str, numb, '...').length);
var time5 = new Date();
for (var i = 0; i < 100; i++) {
    String.cutByte4(str, numb, '...')
}
console.log("耗时：", new Date() - time5, String.cutByte4(str, numb, '...').length);
