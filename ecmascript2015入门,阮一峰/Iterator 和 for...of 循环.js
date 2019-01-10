/**
 * 模拟next方法
 * */
{
    function makeIterator(arr) {
        "use strict";
        let nextIndex = 0;
        return {
            //next: function () {
            //    return nextIndex < arr.length ? {value: arr[nextIndex++], done: false} : {value: undefined, done: true};
            //},
            next: function () {
                return nextIndex < arr.length ? {value: arr[nextIndex++]} : {done: true};
            }
        }
    }

    let it = makeIterator(['a', 'b']);
    let a = it.next();
    let b = it.next();
    let c = it.next();
    //console.log(a, b, c, it);
}

/**
 *  array的原生遍历器
 * */
{
    let arr = ['a', 'b', 'c'];
    let iter = arr[Symbol.iterator]();
    //console.log(iter);
    //console.log(iter.next());
    //console.log(iter.next());
    //console.log(iter.next());
    //console.log(iter.next());
}

/**
 * 给对象部署Iterator接口
 * */
{
    class RangeIterator {
        constructor(start, stop) {
            this.value = start;
            this.stop = stop;
        }

        [Symbol.iterator]() {
            return this;
        }

        next() {
            var value = this.value;
            if (value < this.stop) {
                this.value++;
                return {done: false, value: value};
            }
            return {done: true, value: undefined};
        }
    }
    function range(start, stop) {
        "use strict";
        return new RangeIterator(start, stop);
    }

    let obj = range(0, 3);
    for (var value of obj) {
        //console.log(value);
    }
}
/**
 * 通过遍历器实现指针结构的例子。
 * */
{
    function Obj(value) {
        this.value = value;
        this.next = null;
    }

    Obj.prototype[Symbol.iterator] = function () {
        var iterator = {next: next};
        var current = this;

        function next() {
            if (current) {
                var value = current.value;
                current = current.next;
                return {done: false, value: value};
            } else {
                return {done: true};
            }
        }

        return iterator;
    };

    var one = new Obj(1);
    var two = new Obj(2);
    var three = new Obj(3);
    one.next = two;
    two.next = three;
    for (var i of one) {
        //console.log(i); // 1, 2, 3
    }
}
//  我的
{
    let obj = {count: 3};
    obj[Symbol.iterator] = function () {
        let _this = this;
        return {
            next(){
                if (_this.count--) {
                    return {value: 'james'}
                } else {
                    return {done: true}
                }
            }
        }
    };
    for (let value of obj) {
        //console.log(value)
    }
}

/**
 * 对于类数组对象
 * */
{
    {
        let li = [...document.querySelectorAll('li')];
        var liIt = li[Symbol.iterator]();
        //console.log(liIt.next());
    }
    {
        NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
        let li = document.querySelectorAll('li');
        let liIt = li[Symbol.iterator]();
        //console.log(liIt.next());
    }
}

/**
 * 字符串的Iterator接口
 * */
{
    let str = new String("james");
    let strIterator = str[Symbol.iterator]();
    //console.log(strIterator.next());
    str[Symbol.iterator] = function () {
        return {
            isThird: false,
            index: 0,
            next(){
                this.index++;
                if (this.index === 3) {
                    this.isThird = true;
                }
                if (this.isThird) {
                    return {done: true};
                }
                return {value: '?'};
            }
        }
    };
    let newStrIterator = str[Symbol.iterator]();
    //console.log(newStrIterator.next());
    console.log([...str]);

    //  对于字符串来说，for...of循环还有一个特点，就是会正确识别 32 位 UTF-16 字符。
    for (let x of '\uD83D\uDC0A\uD83D\uDC0B\uD83D\uDC0C\uD83D\uDC0D\uD83D\uDC0E\uD83D\uDC0F') {
        //console.log(x);
    }

}


/**
 *  return 和 throw
 * */
{
    function readLinesSync(file) {
        return {
            [Symbol.iterator]() {
                return {
                    next() {
                        return {done: false};
                    },
                    return() {
                        file.close();
                        return {done: true};
                    }
                };
            }
        };
    }

    let obj = readLinesSync({
        close: function () {
            console.log('调用结束了');
        }
    });
    james:
        for (let line of obj) {
            break james;
        }

}


/**
 * for...of
 * */
{
    //  证明array已经部署了Symbol.iterator
    const arr = ['red', 'green', 'blue'];
    const obj = {};
    obj[Symbol.iterator] = arr[Symbol.iterator].bind(arr);
    for (let v of obj) {
        //console.log(v); // red green blue
    }
}

{
    //  set
    const setObj = new Set(['xx', 'yy']);
    setObj.add('james');
    for (let key of setObj) {
        //console.log(key);
    }
    //  map
    const mapObj = new Map();
    mapObj.set('?', 'xx');
    mapObj.set({}, 'yy');
    for (let key of mapObj) {
        //console.log(key);
    }
}

{
    //  计算生成的数据结构
    let arr = [1, 2, 33];
    //console.log(arr.entries());
    for (let pair of arr.entries()) {
        //console.log(pair);
    }
}

{
    //  类数组对象
    function printArgs() {
        for (let x of arguments) {
            //console.log(x);
        }
    }

    printArgs('a', 'b');
}

{
    //  对象,使用Reflect.ownKeys
    for (let key of Reflect.ownKeys({'xx': 1})) {
        //console.log(key);
    }
}

{
    var arr = [1, 2, 34, 44];
    for (var a in arr) {
        console.log(arr[a])
    }
}