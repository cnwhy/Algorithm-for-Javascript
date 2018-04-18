var Benchmark = require('benchmark');

var suite = new Benchmark.Suite("Array 尾部插入");

suite.add('Array#push', function () {
	var arr = [];
	for (var i = 0; i < 10000; i++) {
		arr.push(i);
	}
})
	.add('Array#length ', function () {
		var arr = [];
		for (var i = 0; i < 10000; i++) {
			arr[arr.length] = i;
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

var suite = new Benchmark.Suite("Array 头部插入");

suite.add('Array#unshift', function () {
	var arr = [];
	for (var i = 0; i < 10000; i++) {
		arr.unshift(i);
	}
})
	.add('Array#concat ', function () {
		var arr = [];
		for (var i = 0; i < 10000; i++) {
			arr = [i].concat(arr);
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