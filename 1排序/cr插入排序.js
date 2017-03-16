function push_2f(arr, fun) {
    if (arr.length <= 1) {
        return arr;
    }
    var l = arr.length;
    var fun = typeof fun == "function" ? fun : function(a, b) {
        return a < b;
    }
    var fun2f = function(a, b) {
        return Math.floor((a + b) / 2)
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