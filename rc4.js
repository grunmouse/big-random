"use strict";

// Based on RC4 algorithm, as described in
// http://en.wikipedia.org/wiki/RC4

/**
 * Меняет местами элементы массива
 */
  function swap(s, i, j){
      var tmp = s[i];
      s[i] = s[j];
      s[j] = tmp;
  }

class AbstractRC4 {
	constructor(){
		const N = this.N;
		let s = Array.from({length:N}, (x, i)=>(i)); //Тождественная перестановка

		//Просто перемешиваю массив
		for (let i = 0; i < N; i++) {
			let j = i + Math.floor(Math.random()*(N-i));
			swap(s, i, j);
		}		
		
		this.i = 0;
		this.j = 0;
		this.s = s;
		
	}
	
	currentState(){
		const {i, j, s} = this;
		return {i, j, s:s.slice(0)};
	}
	
	setState(state){
		const {i, j, s} = state;
		
		
		this.i = i;
		this.j = j;
		this.s = s.slice(0);
	}
	
	randomNative() {
		let {i, j, s, N} = this;
	  
		i = (i + 1) % N; 
		j = (j + s[i]) % N; 

		swap(s, i, j);

		let k = s[(s[i] + s[j]) % N];

		this.i = i;
		this.j = j;
	
		return k;
	}
	
	randomUInt32(){
		const [a, b, c, d] = Array.from({length:4}, ()=>this.randomByte());
		
		return (((((a<<8) | b)<<8) | c)<<8)|d;
	}
}

class RC4 extends AbstractRC4{
	
	randomByte(){
		return this.randomNative();
	}
}

RC4.prototype.N = 256;

class RC4small extends AbstractRC4{
	
	randomByte(){
		var a = this.randomNative();
		var b = this.randomNative();

		return (a << 4) | b;
	}
	
	currentStateString() {
		var {i, j, s} = this.currentState();

		var res = [i,j].concat(s).map(x=>x.toString(16)).join("");
		return res;
	};

	setStateString(stateString) {
		if (!stateString.match(/^[0-9a-f]{18}$/)) {
			throw new TypeError("RC4small stateString should be 18 hex character string");
		}
		
		var [i, j, ...s] = stateString.split("").map((x)=>parseInt(x, 16));

		this.setState({i, j, s});
	}
	
}

RC4small.prototype.N = 16;

RC4.RC4small = RC4small;

module.exports = RC4;
