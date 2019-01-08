{
    function timeout(ms) {
        return new Promise((resolve, reject)=> {
            setTimeout(function () {
                if (Math.random() > 0.5) {
                    resolve('√√√');
                } else {
                    reject('xxx')
                }
            }, ms);
        })
    }

    timeout(100).then(value=> console.log(value), err=>console.log(err));
}

{
    const getJSON = function (url) {
        return new Promise(function (resolve, reject) {
            const handler = function () {
                if (this.readyState !== 4) {
                    return;
                }
                if (this.status === 200) {
                    resolve(this.response);
                } else {
                    reject(this.statusText);
                }
            };
            const client = new XMLHttpRequest();
            client.open("GET", url);
            client.onreadystatechange = handler;
            client.responseType = "json";
            client.setRequestHeader("Accept", "application/json");
            client.send();
        });
    };

    getJSON("./Promise对象.html").then(function (json, promise) {
        console.log('Contents: ' + json);
        console.log(promise)
    }, function (error) {
        console.error('出错了', error);
    });
}

{
    const p1 = new Promise(function (resolve, reject) {
        // ...
    });

    const p2 = new Promise(function (resolve, reject) {
        // ...
        resolve(p1);
    });
    p2.then(val=>console.log(val));

    /**
     * 注意，这时p1的状态就会传递给p2，也就是说，p1的状态决定了p2的状态.
     * 如果p1的状态是pending，那么p2的回调函数就会等待p1的状态改变.
     * 如果p1的状态已经是resolved或者rejected，那么p2的回调函数将会立刻执行.
     * */
}

{
    const p1 = new Promise(function (resolve, reject) {
        setTimeout(() => reject(new Error('p1报错')), 100)
    });
    const p2 = new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve(p1);
            console.log('p2')
        }, 100);
    });
    p2.then(result => console.log(result))
        .catch(error => console.log(error));
}

{
    new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('异步');
            console.log('同步')
        }, 100)
    }).then(val=>console.log(val));
    //  resolved是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。

    //  一般来说,调用完resolve或reject之后,Promise的使命就完成了,后续操作应该放在then里.
    new Promise(function (resolve) {
        setTimeout(function () {
            resolve(111);
        }, 0)
    })
}

/**
 * Promise.prototype.then
 * */
{

}