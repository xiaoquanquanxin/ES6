"use strict";

function a(a, b) {
    var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

    return a + b + c;
}
var sum = a(1, 2);
console.log(sum);