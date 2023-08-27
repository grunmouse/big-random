
module.exports = {
	AbstractRandom: require('./abstract-random.js'),
	...require('./rc4.js'),
	...require('./random.js')
}