"use strict";

var currentTemp = 10;
//  模板字符串可以加变量，不用+号拼接
var message = "aaaaaaaaaa" + currentTemp + " is okey";
console.log(message);

//  人家模板字符串可以自动换行，而且自带缩进666
var multiline = "line1\nline2\n          line3";
console.log(multiline);

//  符号，不能用new关键字创建
var RED = Symbol();
var ORANGE = Symbol("The color of sunset");
console.log(RED);

var obj = {};
obj[RED] = 8;
console.log(obj);

//  for of语法
var hand = [1, 2, 3, 4, 5];
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = hand[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var value = _step.value;

        console.log("\u8FD9\u4E2A\u662F" + value);
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally {
    try {
        if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
        }
    } finally {
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}