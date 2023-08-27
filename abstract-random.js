
function makeMaskUint8(val){
	if(val >= 16){
		if(val >= 64){
			if(val >= 128){
				return 255;
			}
			else{
				return 127;
			}
		}
		else{
			if(val >= 32){
				return 63;
			}
			else{
				return 31;
			}
		}
	}
	else{
		if(val >= 4){
			if(val >= 8){
				return 15;
			}
			else{
				return 7;
			}
		}
		else{
			if(val >= 2){
				return 3;
			}
			else{
				return 1;
			}
		}
	}
}

function makeMaskUint32(val){
	if(val>=65536){
		if(val>=16777216){
			return (makeMaskUint8(val>>24)<<24) | 16777215;
		}
		else{
			return (makeMaskUint8(val>>16)<<16) | 65535;
		}
	}
	else{
		if(val>=256){
			return (makeMaskUint8(val>>8)<<8) | 255;
		}
		else{
			return makeMaskUint8(val);
		}
	}
}

const bigint = require('./convert.js');

/*
Абстрактный класс, содержащий общие функции и требующий метод randomByte, который должен быть определён в наследниках
 */
class AbstractRandom {
	
	randomUInt32(){
		const [a, b, c, d] = Array.from({length:4}, ()=>this.randomByte());
		
		return (((((a<<8) | b)<<8) | c)<<8)|d;
	}

	randomByteLim(max){
		if(max === 0){
			return 0; //Это число выбрано совершенно случайно на отрезке [0,0]
		}
		let mask = makeMaskUint8(max);
		while(true){
			let val = (this.randomByte() & mask);
			if(val<=max){
				return val;
			}
		}
	}

	randomUint32Lim(max){
		if(max === 0){
			return 0; //Это число выбрано совершенно случайно на отрезке [0,0]
		}
		let mask = makeMaskUint32(max);
		while(true){
			let val = (this.randomUInt32() & mask);
			if(val<=max){
				return val;
			}
		}
	}
	
	randomBigUint(size){
		const buffer = new ArrayBuffer(size);
		
		const dv = new DataView(buffer);
		
		for(let offset = size; offset--; ){
			let val = this.randomByte();
			dv.setUint8(offset, val);
		}
		
		const result = bigint.fromBuffer(buffer);
		
		return result;
	}

	randomBigUintLim(lim){
		if(lim === 0n){
			return 0n; //Это число выбрано совершенно случайно на отрезке [0,0]
		}
		const limBuffer = bigint.toBuffer(lim);
		const len = limBuffer.byteLength;
		const buffer = new ArrayBuffer(len);
		
		const dvLim = new DataView(limBuffer);
		const dv = new DataView(buffer);
		
		let accept = false;
		while(!accept){
			let first = true;
			for(let offset = len; offset--; ){
				if(accept){
					let val = this.randomByte();
					dv.setUint8(offset, val);
				}
				else{
					let limit = dvLim.getUint8(offset);
					let val;
					
					if(first){
						//До появления старшего значимого байта limit
						if(limit>0){
							//Старший значимый байт появился
							val = this.randomByte() & makeMaskUint8(limit);
							first = false;
						}
						else{
							val = 0;
						}
					}
					else{
						val = this.randomByte();
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
}

module.exports = AbstractRandom;