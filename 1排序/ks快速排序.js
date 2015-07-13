function kspx(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    var n = arr.shift(),
        z = arr.length;
    var arrL = [],
        arrR = []
    for (var i = 0; i < z; i++) {
        if (arr[i] < n) {
            arrL.push(arr[i]);
        } else {
            arrR.push(arr[i]);
        }
    }
    arr.splice.apply(arr, [0, z].concat(kspx1(arrL).concat([n], kspx1(arrR))))
        //arr = kspx1(arrL).concat([n],kspx1(arrR))
    return arr;
}

function kspx_fun(arr, fun) {
    if (arr.length <= 1) {
        return arr;
    }
    var n = arr.shift(),
        z = arr.length;
    var fun = typeof fun == "function" ? fun : function(a, b) {
        return a < b;
    }
    var arrL = [],
        arrR = []
    for (var i = 0; i < z; i++) {
        if (fun(arr[i], n)) {
            arrL.push(arr[i]);
        } else {
            arrR.push(arr[i]);
        }
    }
    arr.splice.apply(arr, [0, z].concat(kspx_fun(arrL, fun).concat([n], kspx_fun(arrR, fun))))
        //arr = kspx1(arrL).concat([n],kspx1(arrR))
    return arr;
}
