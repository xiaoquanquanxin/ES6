"use strict";

//  promise 确保回调始终被可以预期的方式处理
//  创建promise
function countDown(seconds) {
    return new Promise(function (resolve, reject) {
        var _loop = function _loop(i) {
            setTimeout(function () {
                if (i === 4) {
                    return reject(new Error("报错"));
                } else if (i > 0) {
                    console.log(i);
                } else {
                    resolve(console.log("GO " + i));
                }
            }, i * 222);
        };

        for (var i = seconds; i >= 0; i--) {
            _loop(i);
        }
    });
}
//  使用promise
var cou2 = countDown(12);
cou2.then(function () {
    console.log("countDown 完整成功");
});
cou2.catch(function (err) {
    console.log("countDown 出错了" + err);
});