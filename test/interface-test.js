const assert = require('assert');

describe('import', ()=>{
	it('AbstractRandom', function(){
		let cls = require('../index.js').AbstractRandom;
		assert.ok(typeof cls == 'function');
		
		class exp extends cls{
			randomByte(){
				return Math.floor(Math.random()*256);
			}
		}
		let inst = new exp();
		assert.ok(inst instanceof cls);
	});	
	it('RC4', function(){
		let cls = require('../index.js').RC4;
		assert.ok(typeof cls == 'function');
		let inst = new cls();
		assert.ok(inst instanceof cls);
	});
	it('RC4small', function(){
		let cls = require('../index.js').RC4small;
		assert.ok(typeof cls == 'function');
		let inst = new cls();
		assert.ok(inst instanceof cls);
	});	
	
	[	
		'currentStateString',
		'setStateString',
		'randomByte',
		'randomUInt32',
		'randomByteLim',
		'randomUint32Lim',
		'randomBigUint',
		'randomBigUintLim'
	].forEach((name)=>{
		it(name, function(){
			let cls = require('../index.js')[name];
			assert.ok(typeof cls == 'function');
		});
	});
});