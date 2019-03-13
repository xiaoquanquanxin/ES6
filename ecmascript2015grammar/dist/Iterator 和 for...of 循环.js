'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 模拟next方法
 * */
{
    var makeIterator = function makeIterator(arr) {
        "use strict";

        var nextIndex = 0;
        return {
            //next: function () {
            //    return nextIndex < arr.length ? {value: arr[nextIndex++], done: false} : {value: undefined, done: true};
            //},
            next: function next() {
                return nextIndex < arr.length ? { value: arr[nextIndex++] } : { done: true };
            }
        };
    };

    var it = makeIterator(['a', 'b']);
    var a = it.next();
    var b = it.next();
    var c = it.next();
    //console.log(a, b, c, it);
}

/**
 *  array的原生遍历器
 * */
{
    var arr = ['a', 'b', 'c'];
    var iter = arr[Symbol.iterator]();
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
    var range = function range(start, stop) {
        "use strict";

        return new RangeIterator(start, stop);
    };

    var RangeIterator = function () {
        function RangeIterator(start, stop) {
            _classCallCheck(this, RangeIterator);

            this.value = start;
            this.stop = stop;
        }

        _createClass(RangeIterator, [{
            key: Symbol.iterator,
            value: function value() {
                return this;
            }
        }, {
            key: 'next',
            value: function next() {
                var value = this.value;
                if (value < this.stop) {
                    this.value++;
                    return { done: false, value: value };
                }
                return { done: true, value: undefined };
            }
        }]);

        return RangeIterator;
    }();

    var obj = range(0, 3);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = obj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            //console.log(value);

            var value = _step.value;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}
/**
 * 通过遍历器实现指针结构的例子。
 * */
{
    var Obj = function Obj(value) {
        this.value = value;
        this.next = null;
    };

    Obj.prototype[Symbol.iterator] = function () {
        var iterator = { next: next };
        var current = this;

        function next() {
            if (current) {
                var value = current.value;
                current = current.next;
                return { done: false, value: value };
            } else {
                return { done: true };
            }
        }

        return iterator;
    };

    var one = new Obj(1);
    var two = new Obj(2);
    var three = new Obj(3);
    one.next = two;
    two.next = three;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = one[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            //console.log(i); // 1, 2, 3

            var i = _step2.value;
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
}
//  我的
{
    var _obj = { count: 3 };
    _obj[Symbol.iterator] = function () {
        var _this = this;
        return {
            next: function next() {
                if (_this.count--) {
                    return { value: 'james' };
                } else {
                    return { done: true };
                }
            }
        };
    };
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = _obj[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            //console.log(value)

            var _value = _step3.value;
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }
}

/**
 * 对于类数组对象
 * */
{
    {
        var li = [].concat(_toConsumableArray(document.querySelectorAll('li')));
        var liIt = li[Symbol.iterator]();
        //console.log(liIt.next());
    }
    {
        NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
        var _li = document.querySelectorAll('li');
        var _liIt = _li[Symbol.iterator]();
        //console.log(liIt.next());
    }
}

/**
 * 字符串的Iterator接口
 * */
{
    var str = new String("james");
    var strIterator = str[Symbol.iterator]();
    //console.log(strIterator.next());
    str[Symbol.iterator] = function () {
        return {
            isThird: false,
            index: 0,
            next: function next() {
                this.index++;
                if (this.index === 3) {
                    this.isThird = true;
                }
                if (this.isThird) {
                    return { done: true };
                }
                return { value: '?' };
            }
        };
    };
    var newStrIterator = str[Symbol.iterator]();
    //console.log(newStrIterator.next());
    console.log([].concat(_toConsumableArray(str)));

    //  对于字符串来说，for...of循环还有一个特点，就是会正确识别 32 位 UTF-16 字符。
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = '\uD83D\uDC0A\uD83D\uDC0B\uD83D\uDC0C\uD83D\uDC0D\uD83D\uDC0E\uD83D\uDC0F'[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            //console.log(x);

            var x = _step4.value;
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }
}

/**
 *  return 和 throw
 * */
{
    var readLinesSync = function readLinesSync(file) {
        return _defineProperty({}, Symbol.iterator, function () {
            return {
                next: function next() {
                    return { done: false };
                },
                return: function _return() {
                    file.close();
                    return { done: true };
                }
            };
        });
    };

    var _obj2 = readLinesSync({
        close: function close() {
            console.log('调用结束了');
        }
    });
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        james: for (var _iterator5 = _obj2[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var line = _step5.value;

            break james;
        }
    } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
            }
        } finally {
            if (_didIteratorError5) {
                throw _iteratorError5;
            }
        }
    }
}

/**
 * for...of
 * */
{
    //  证明array已经部署了Symbol.iterator
    var _arr = ['red', 'green', 'blue'];
    var _obj3 = {};
    _obj3[Symbol.iterator] = _arr[Symbol.iterator].bind(_arr);
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
        for (var _iterator6 = _obj3[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            //console.log(v); // red green blue

            var v = _step6.value;
        }
    } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
            }
        } finally {
            if (_didIteratorError6) {
                throw _iteratorError6;
            }
        }
    }
}

{
    //  set
    var setObj = new Set(['xx', 'yy']);
    setObj.add('james');
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
        for (var _iterator7 = setObj[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var key = _step7.value;
        }
        //console.log(key);

        //  map
    } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
            }
        } finally {
            if (_didIteratorError7) {
                throw _iteratorError7;
            }
        }
    }

    var mapObj = new Map();
    mapObj.set('?', 'xx');
    mapObj.set({}, 'yy');
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
        for (var _iterator8 = mapObj[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            //console.log(key);

            var _key = _step8.value;
        }
    } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                _iterator8.return();
            }
        } finally {
            if (_didIteratorError8) {
                throw _iteratorError8;
            }
        }
    }
}

{
    //  计算生成的数据结构
    var _arr2 = [1, 2, 33];
    //console.log(arr.entries());
    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
        for (var _iterator9 = _arr2.entries()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            //console.log(pair);

            var pair = _step9.value;
        }
    } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion9 && _iterator9.return) {
                _iterator9.return();
            }
        } finally {
            if (_didIteratorError9) {
                throw _iteratorError9;
            }
        }
    }
}

{
    //  类数组对象
    var printArgs = function printArgs() {
        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
            for (var _iterator10 = arguments[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                //console.log(x);

                var _x = _step10.value;
            }
        } catch (err) {
            _didIteratorError10 = true;
            _iteratorError10 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion10 && _iterator10.return) {
                    _iterator10.return();
                }
            } finally {
                if (_didIteratorError10) {
                    throw _iteratorError10;
                }
            }
        }
    };

    printArgs('a', 'b');
}

{
    //  对象,使用Reflect.ownKeys
    var _iteratorNormalCompletion11 = true;
    var _didIteratorError11 = false;
    var _iteratorError11 = undefined;

    try {
        for (var _iterator11 = Reflect.ownKeys({ 'xx': 1 })[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            //console.log(key);

            var _key2 = _step11.value;
        }
    } catch (err) {
        _didIteratorError11 = true;
        _iteratorError11 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion11 && _iterator11.return) {
                _iterator11.return();
            }
        } finally {
            if (_didIteratorError11) {
                throw _iteratorError11;
            }
        }
    }
}