const assert = require('assert');
const random = require('../random.js');

describe('big-random', function(){
	describe('randomBigUint', function(){
		function itLimit(size){
			it('size '+size, function(){
				const limit = 1n<<(BigInt(size)<<3n);
				for(let i=100; --i;){
					let value = random.randomBigUint(size);
					assert.ok(value<limit);
				}
			});
		}
		
		itLimit(4);
		itLimit(8);
		itLimit(16);
		itLimit(32);
		itLimit(64);
		itLimit(256);
	});
	
	describe('randomBigUintLim', function(){
		function itLimit(size){
			it('size '+size, function(){
				for(let i=100; --i;){
					const limit = random.randomBigUint(size);
					let value = random.randomBigUintLim(limit);
					assert.ok(value<limit);
				}
			});
		}
		
		itLimit(4);
		itLimit(8);
		itLimit(16);
		itLimit(32);
		itLimit(64);
		itLimit(256);
	});
	
	
});