function mppx(arr) {
    for (var i = 0, max = arr.length; i < max; i++) {
        for (var n = 0; n < max - i - 1; n++) {
            if (arr[n] > arr[n + 1]) {
                var x = arr[n];
                arr[n] = arr[n + 1];
                arr[n + 1] = x;
            }
        }
    }
    return arr;
}

console.log(mppx([1,0,2,2,1,3,6,4]))
