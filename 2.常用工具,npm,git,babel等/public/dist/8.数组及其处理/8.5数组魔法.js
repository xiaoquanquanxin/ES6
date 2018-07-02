"use strict";

Array.prototype.myReduce = function (f, i) {
    var x = i;
    var len = this.length;
    var j = 0;
    if (typeof i === "undefined") {
        x = this[0];
        j++;
    }
    for (; j < len; j++) {
        x = f(x, this[j]);
    }
    return x;
};

var arr = [5, 7, 2];
//const asum  = arr.myReduce();

var brr = [{ id: 1 }, { id: 3 }, { id: 42 }, { id: 12 }, { id: 23 }];
var sum = brr.reduce(function (a, x) {
    return a += x.id;
}, 0);
console.log(sum);

var fIndex = brr.findIndex(function (t, i) {
    return t.id == 12;
});
console.log(fIndex);