"use strict";

var o = {
    a: 1,
    b: function b(c) {
        return c;
    }
};
var s = o.b(123);
console.log(s);

//  this指向被调用函数的对象
var a = {
    name: "james", getName: function getName() {
        return this.name;
    }
};
var aName = a.getName();
console.log(aName);
var b = { name: "pierce" };
var bName = a.getName.call(b);
console.log(bName);