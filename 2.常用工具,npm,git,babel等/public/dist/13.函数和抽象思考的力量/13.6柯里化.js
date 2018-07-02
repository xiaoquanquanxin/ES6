"use strict";

function sum(arr, f) {
    if (typeof f === "undefined") {
        f = function f(x) {
            return x;
        };
    }
    return arr.reduce(function (a, x) {
        return a += f(x);
    }, 0);
}
function ff(x) {
    return x * 100;
}

var arr = [1, 2, 3, 4];
var result = sum(arr, ff);
console.log(result);

//  将传入多个参数的函数转换为传入一个参数的过程叫柯里化 ,curry
function newSummer(f) {
    return function (arr) {
        return sum(arr, f);
    };
}

var brr = [1, 2, 3, 4, 5];
var theNewSummer = newSummer(ff);
result = theNewSummer(brr);
console.log(result);