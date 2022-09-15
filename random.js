const rc4 = new (require("rc4").RC4small);

const currentStateString = rc4.currentStateString.bind(rc4);
const setStateString = rc4.setStateString.bind(rc4);
const randomByte = rc4.randomByte.bind(rc4);
const randomUInt32 = rc4.randomUInt32.bind(rc4);

const {bigint} = require('@grunmouse/binary');

const over2 = (a)=>(Math.floor(Math.log2(a))+1);
const makeMask = (a)=>((1<<over2(a)) - a);

function randomByteLim(max){
	if(max === 0){
		return 0; //Это число выбрано совершенно случайно на отрезке [0,0]
	}
	while(true){
		let val = randomByte();
		if(val<=max){
			return val;
		}
	}
}

function randomUint32Lim(max){
	if(max === 0){
		return 0; //Это число выбрано совершенно случайно на отрезке [0,0]
	}
	while(true){
		let val = randomUInt32();
		if(val<=max){
			return val;
		}
	}
}

function randomBigUint(size){
	const buffer = new ArrayBuffer(size);
	
	const dvLim = new DataView(limBuffer);
	const dv = new DataView(buffer);
	
	for(let offset = size; offset--; ){
		let val = randomByte();
		dv.setUint8(offset, val);
	}
	
	const result = bigint.fromBuffer(bufer);
	
	return result;
}

function randomBigUintLim(lim){
	const limBuffer = bigint.toBuffer(lim);
	const len = limBuffer.byteLength;
	const buffer = new ArrayBuffer(len);
	
	const dvLim = new DataView(limBuffer);
	const dv = new DataView(buffer);
	
	let accept = false;
	let first = true;
	while(!accept){
		for(let offset = len; offset--; ){
			if(accept){
				let val = randomByte();
				dv.setUint8(offset, val);
			}
			else{
				let limit = dvLim.getUint8(offset);
				let val = limit > 0 ? randomByte() : 0;
				
				if(limit>0 && first){
					let mask = makeMask(limit);
					val = val & mask;
					first = false;
				}
				
				if(val>limit){
					break; //Перезапуск генерации числа
				}
				else{
					dv.setUint8(offset, val);
					
					accept = (val < limit || offset ===0);
				}
			}
		}
	}
	
	const result = bigint.fromBuffer(buffer);
	
	return result;
}

module.exports = {
	currentStateString,
	setStateString,
	randomByte,
	randomUInt32,
	randomByteLim,
	randomUint32Lim,
	randomBigUint,
	randomBigUintLim
};