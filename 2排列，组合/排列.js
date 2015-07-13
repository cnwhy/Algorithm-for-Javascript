//递归排列函数
function permutation(arr, left) {
    var pl = [],
        left = left || "";
    if (arr.length <= 1) {
        return [left + arr.join('')];
    }
    var pass = []; //去重
    for (var i = 0; i < arr.length; i++) {
        var _arr = arr.slice(0),
            _s = _arr[i],
            _l = left + "" + _s;
        _arr.splice(i, 1)
        if (pass.indexOf(_s) != -1) continue;
        pass.push(_s)
        //console.log(_arr,_l,pass.join());
        pl = pl.concat(permutation(_arr, _l))
    }
    return pl;
}
var log = console.log;
log(permutation([1,2,3]))
log(permutation([1,2,1]))
