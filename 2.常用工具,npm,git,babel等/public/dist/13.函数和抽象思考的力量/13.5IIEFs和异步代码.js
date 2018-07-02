'use strict';

var _loop = function _loop(_i) {
    setTimeout(function () {
        console.log(_i);
    }, 555 * _i);
};

//  let 相当于创建了一个作用域
for (var _i = 0; _i < 4; _i++) {
    _loop(_i);
}

//  这里的i会报错 , 已经离开作用域了
//console.log(i);

var i = '111111111';
a();
function a() {
    console.log(i);
}