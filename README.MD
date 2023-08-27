# @grunmouse/big-random

Модуль для генерации случайного BigInt
```
const {
	AbstractRandom,
	RC4,
	RC4small,
	currentStateString,
	setStateString,
	randomByte,
	randomUInt32,
	randomByteLim,
	randomUint32Lim,
	randomBigUint,
	randomBigUintLim
} = require('@grunmouse/big-random');
```

## AbstractRandom

Абстрактный класс, реализующий методы генерации большого случайного числа.

@abstract @method randomByte() : Number - должен быть реализован в наследниках, должен генерировать равномерно распределённое случайное UInt8

@method randomUInt32() : Number - случайное UInt32

@method randomByteLim(max : Number) : Number - случайное UInt8<=max

@method randomUint32Lim(max : Number) : Number - случайное UInt32<=max

@method randomBigUint(size : Number) : BigInt - случайное BigInt размером не более size байт

@method randomBigUintLim(max : BigInt) : BigInt - случайное BigInt<=max



## RC4 extends AbstractRandom

Класс, реализующий RC4, N=256

@property N = 256

@method currentState() : Object - возвращает состояние генератора
@return {i : Number, j : Number, s : Array<Number>}
	
@method setState(state) - устанавливает состояние генератора
@param state.i : Number 0..255
@param state.j : Number 0..255
@param state.s : Array(256)<Number 0..255>
	
@method randomNative() : Number - генерирует случайное число алгоритмом RC4.
@return Number 0..255

## RC4small extends AbstractRandom

Класс, реализующий RC4, N=16

@property N = 16

@method currentState() : Object - возвращает состояние генератора
@return {i : Number, j : Number, s : Array<Number>}
	
@method setState(state) - устанавливает состояние генератора
@param state.i : Number 0..15
@param state.j : Number 0..15
@param state.s : Array(16)<Number 0..15>
	
@method randomNative() : Number - генерирует случайное число алгоритмом RC4.
@return Number 0..15

@method currentStateString() : String - возвращает строковое представление состояния генератора
@return String /^[0-9a-f]{18}$/ - строковое представление состояния генератора

@method setStateString(stateString : String) - принимает строковое представление состояния генератора и устанавливает состояние

## Функции

* currentStateString,
* setStateString,
* randomByte,
* randomUInt32,
* randomByteLim,
* randomUint32Lim,
* randomBigUint,
* randomBigUintLim

оборачивают методы глобально определённого экземпляра RC4small