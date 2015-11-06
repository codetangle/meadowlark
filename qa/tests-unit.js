var fortune = require('../lib/fortune.js');
var expect = require('chai').expect;

suite('Fortue cookie test', function() {

	test('getFortune() should return a fortune', function() {
		expect(typeof fortune.getFortune() === 'string');
	});
});