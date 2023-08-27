const rc4 = new (require("./rc4.js").RC4small);

const currentStateString = rc4.currentStateString.bind(rc4);
const setStateString = rc4.setStateString.bind(rc4);
const randomByte = rc4.randomByte.bind(rc4);
const randomUInt32 = rc4.randomUInt32.bind(rc4);
const randomByteLim    = rc4.randomByteLim.bind(rc4);
const randomUint32Lim  = rc4.randomUint32Lim.bind(rc4);
const randomBigUint    = rc4.randomBigUint.bind(rc4);
const randomBigUintLim = rc4.randomBigUintLim.bind(rc4);
	
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