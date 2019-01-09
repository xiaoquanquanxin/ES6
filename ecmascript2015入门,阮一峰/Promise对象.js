{
    const timeout = new Promise((resolve, reject)=> {
        if (Math.random() > 0.5) {
            resolve('√√√');
        } else {
            reject('xxx')
        }
    });
    timeout.then(value=> console.log(value), err=>console.log(err));
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

    });
    const p2 = new Promise(function (resolve, reject) {
        resolve(p1);
        console.log('p2')

    });
    p2.then(result => console.log(result))
        .catch(error => console.log(error));
}

{
    new Promise(function (resolve, reject) {
    }).then(val=>console.log(val));
    //  resolved是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。

    //  一般来说,调用完resolve或reject之后,Promise的使命就完成了,后续操作应该放在then里.
    new Promise(function (resolve) {
        resolve(111);
    })
}

/**
 * Promise.prototype.then
 * */
{
    new Promise(function (resolve) {
        resolve(1);
    }).then(function (resolve) {
        console.log(resolve);
        return 2;
    }).then(function (resolve) {
        console.log(resolve)
    })
}

/**
 * Promise.prototype.catch
 * */
{
    function getJSON(url) {
        return new Promise(function (resolve, reject) {
            reject(url);
        })
    }

    getJSON('/posts.json').then(function (posts) {
        // ...
    }).catch(function (error) {
        // 处理 getJSON 和 前一个回调函数运行时发生的错误
        console.log('发生错误！', error);
    });
}

{
    new Promise(function (resolve, reject) {
        //  普通地抛出错误,没问题
        throw new Error('xxx');

    }).catch(function (err) {
        console.log(err);
    });
    new Promise(function (resolve, reject) {
        resolve('ok');
        //  但如果resolve指向了,promise会认为他的状态变成了成功,这时会冻结这个状态.
        //  抛出错误是不会触发catch的,只不过这个例子模拟不出来,用reject可以模拟出
        //throw new Error('xxx');
        reject('false');

    }).then(function (value) {
        console.log(value)
    }).catch(function (error) {
        console.log(error)
    });
}

{
    new Promise(function (resolve, reject) {
        // 下面一行会报错，因为x没有声明
        throw new Error('xxx');
    });
    console.log('xxx报错不会影响外层代码');
}

/**
 * Promise.all
 * 用于将多个Promise实例包装成一个新的Promise实例
 * */
{
    setTimeout(function () {
        console.clear();
        return;
        const p1 = new Promise(function (resolve, reject) {
            "use strict";
            setTimeout(function () {
                reject('errrrrrrrrrr');
            }, 1);
        }).catch(function (err) {
            console.log('p1自己的catch', err);
            return err;
        });
        const p2 = new Promise(function (resolve, reject) {
            resolve('p2');
        });
        const p3 = new Promise(function (resolve, reject) {
            resolve('p3');
        });
        const p = Promise.all([p1, p2, p3]).catch(function (err) {
            console.log('all的catch\n', err);
            return 123
        }).finally(function () {
            console.log('**********Promise.all  finally***************');
            console.log(p, p1, p2, p3);
            setTimeout(function () {
                console.log(p);
            }, 2)
        });

    }, 100);
}

/**
 * Promise.race
 * 如果说.all是等待全部实例完成,那么race就是等待第一个实例完成
 * */
{
    setTimeout(function () {
        console.clear();
        return;
        const p1 = new Promise(function (resolve, reject) {

        });
        const p2 = new Promise(function (resolve, reject) {
            resolve('p2成功了');
        }).then(function (result) {
            var str = 'p2的then:' + result;
            console.log(str);
            return str;
        });
        const p = Promise.race(new Set([p1, p2]));
        p.then(function (result) {
            console.log(result);
        }).finally(function () {
            setTimeout(function () {
                console.log(p);
                console.log(p1, p2);
            }, 1)
        })
    }, 100);
}


/**
 *  Promise.resolve
 *  返回一个Promise实例
 * */
{
    setTimeout(function () {
        console.clear();
        return;
        let obj = {
            then: function (resolve, reject) {
                reject(1);
            }
        };
        const p = Promise.resolve(obj).catch(function (err) {
            console.log(err);
            return err;
        });
        setTimeout(function () {
            console.log(p);
        }, 11)
    }, 100)
}


/**
 *  Promise.reject
 *  返回一个状态为reject的实例,值为Promise.reject方法的参数
 * */



/**
 * 应用 加载图片
 * */
{
    setTimeout(function () {
        console.clear();
        const preLoadImage = function (path) {
            return new Promise(function (resolve, reject) {
                const image = new Image();
                image.onload = resolve;
                image.onerror = reject;
                image.src = path;
            })
        };
        preLoadImage('ht1tps://www.baidu.com/img/bd_logo1.png?where=super').then(function (resolve) {
            console.log(this, resolve);
        }).catch(function (err) {
            console.log(err);
        });
    }, 100);
}

/**
 * Promise.try
 * */

{

}










