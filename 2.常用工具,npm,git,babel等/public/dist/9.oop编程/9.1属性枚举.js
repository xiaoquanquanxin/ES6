"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SYM = Symbol();
var o = _defineProperty({ a: 1, b: 2, c: 3 }, SYM, 4);
for (var prop in o) {
    if (o.hasOwnProperty(prop)) {
        console.log(o[prop]);
    }
}
console.log("------------");
console.log(Object.keys(o));
Object.keys(o).forEach(function (prop) {
    return console.log(o[prop]);
});
console.log("筛出对象的键的首字母为k的值");

var nameObj = { "james": 21, "kg": 32, "kevin": 32, "ky": 1 };
var n = Object.keys(nameObj).filter(function (o) {
    return o.match(/^k/);
}).map(function (o) {
    return nameObj[o];
});
console.log(n);