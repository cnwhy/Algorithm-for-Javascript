var Benchmark = require('benchmark');

var suite = new Benchmark.Suite("Array 尾部插入");

suite.add('String#+', function () {
	var str = '';
	for (var i = 0; i < 10000; i++) {
		str += '' + i;
	}
})
	.add('String#join', function () {
		var arr = [''];
		for (var i = 0; i < 10000; i++) {
			arr[arr.length] = i;
		}
		arr.join('');
	})
	.add('String#concat', function () {
		var arr = [];
		for (var i = 0; i < 10000; i++) {
			arr = arr.concat(''+i);
		}
	})
	// add listeners
	.on('cycle', function (event) {
		console.log(String(event.target));
	})
	.on('complete', function () {
		console.log('Fastest is ' + this.filter('fastest').map('name'));
	})
	// run async
	.run({ 'async': false });