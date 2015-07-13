function push_2f(arr, fun) {
    if (arr.length <= 1) {
        return arr;
    }
    var l = arr.length;
    var fun = typeof fun == "function" ? fun : function(a, b) {
        return a < b;
    }
    var fun2f = function(a, b) {
        return a + Math.floor((b - a) / 2)
    }
    for (var i = 1; i < l; i++) {
        var v = arr[i]
        if (fun(arr[i - 1], v)) {
            continue;
        }
        if (fun(v, arr[0])) {
            arr.splice(0, 0, arr.splice(i, 1)[0]);
            continue;
        }
        var b = 0,
            e = i,
            z = fun2f(b, e);
        while (z != b) {
            if (fun(v, arr[z])) {
                e = z;
            } else {
                b = z;
            }
            z = fun2f(b, e);
        }
        z += fun(v, arr[z]) ? 0 : 1;
        arr.splice(z, 0, arr.splice(i, 1)[0]);
    }
    return arr;
}

function zhpx_fun(arr, fun, _n) {
    var _l;
    if ((_l = arr.length) <= 1) {
        return arr;
    };
    _n = typeof(_n) == 'undefined' ? Math.log(_l) : _n;
    var fun = typeof fun == "function" ? fun : function(a, b) {
        return a < b;
    };
    if (_l < 8 || _n <= 0) return push_2f(arr, fun); //长度小于8 或堆栈层级到达设定的最大值时，转为插入排序 , 防止溢出;
    var n = arr.shift();
    _l--;
    var arrL = [],
        arrR = [];
    for (var i = 0; i < _l; i++) {
        if (fun(arr[i], n)) {
            arrL.push(arr[i]);
        } else {
            arrR.push(arr[i]);
        }
    }
    _n--;
    arr.splice.apply(arr, [0, _l].concat(zhpx_fun(arrL, fun, _n).concat([n], zhpx_fun(arrR, fun, _n))))
    return arr;
}
