"use strict";

//  copyWithin,分割替换，参数示意：
//  第一个参数：粘贴的开始位置
//  第二个参数：复制的起始index
//  第三个参数(可选)：复制的终止index

var arr = [1, 2, 3, 4];
arr.copyWithin(1, 2);
console.log(arr);
//  1,3,4,4
arr.copyWithin(2, 0, 2);
console.log(arr);
//  1,3,1,3
arr.copyWithin(0, -3, -1);
console.log(arr);
//  3,1,1,3


//  fill, 指定数组填充
//  第一个参数：填充的值是什么
//  第二个参数：填充起始位置
//  第三个参数(可选)：填充的终止位置
var brr = new Array(5).fill(3);
console.log(brr);
brr.fill(5, 1);
console.log(brr);
brr.fill(8, 2, -1);
console.log(brr);

var crr = [11, 2, 3, 8, 3, 1, 5, 8, 1];
crr.sort(function (a, b) {
    return a - b;
});
console.log(crr);
crr.reverse();
console.log(crr);

var drr = [];
for (var i = 0; i < 26; i++) {
    drr.push(String.fromCharCode(65 + i));
}

drr.sort(function (a, b) {
    if (a.charCodeAt() === 66 || b.charCodeAt() === 66) {
        return 1;
    }
    return a.charCodeAt() - b.charCodeAt();
});
//console.log(drr);
drr.reverse();
//console.log(drr);

var err = [{ id: 1, name: 2 }, { id: 2, name: 2 }];
var findIndexerrResult = err.findIndex(function (o) {
    return o.id === 2;
});
var finderrResult = err.find(function (o) {
    return o.id === 2;
});
console.log(findIndexerrResult);
console.log(finderrResult);

//  fliter
var cards = [];
var _arr = ["a", "b", "c", "d"];
for (var _i = 0; _i < _arr.length; _i++) {
    var suit = _arr[_i];
    for (var value = 1; value < 13; value++) {
        cards.push({ suit: suit, value: value });
    }
}

console.log(cards.length);
console.log(cards.filter(function (c) {
    return c.value === 2;
}));
console.log(cards.length);