"use strict";

var obj = { b: 2, c: 3, d: 4 };
//let {a,b,c} = obj;
//console.log(a, b, c);


//  如果你先let 了 a,b,c,那么在解构的时候必须带括号
var obj1 = { b: 2, c: 3, d: 4 };
//let a, b, c;
//({a, b, c} = obj);
//console.log(a, b, c);

//  可以解构数组
var arr = [1, 2, 1, 4, 5, 6];
//let [x,y] = arr;
//console.log(x, y);

//  ...语法标识剩下的所有元素 , 如果没有就是[]
var q = arr[0],
    w = arr[1],
    rest = arr.slice(2);

console.log(q, w, rest);

//  数组换位
var a = 5;
var b = 10;
var _ref = [b, a];
a = _ref[0];
b = _ref[1];

console.log(a, b);