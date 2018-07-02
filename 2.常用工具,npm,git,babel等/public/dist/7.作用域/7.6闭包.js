"use strict";

var getName = void 0;
{
    var name = 1234;
    getName = function getName() {
        console.log(name);
    };
}
getName();

var f = function () {
    var num = 0;
    return function () {
        console.log("\u88AB\u8C03\u7528\u4E86" + ++num + "\u6B21");
    };
}();
f();
f();
f();

//  es6只有函数可以声明提升
ff();
function ff() {}

//  临时死区    在es6中才会存在
if (typeof x === "undefined") {
    console.log(1);
} else {
    console.log(x);
}
var x = 1234567890;