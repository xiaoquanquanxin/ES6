var i = 0;
function createPromise(param) {
    //console.log(param);
    i++;
    //console.log(`执行 的是${i}`);
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (i >= 10) {
                reject();
                return;
            }
            resolve(_i);
        }, Math.random() * 1000);
        var _i = i;
    }).then(function (x) {
        console.log(`执行完了${x}`);
        createPromise(param);
    }).catch(function () {
    });
}
createPromise('a');
createPromise('b');
createPromise('c');

const a = (x)=>x;