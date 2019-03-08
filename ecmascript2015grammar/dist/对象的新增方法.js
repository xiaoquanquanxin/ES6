'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//  Object.is
{
    console.log(Object.is(NaN, NaN)); //  相等
    console.log(Object.is(+0, -0)); //  不等
    Object.isEqual = function (a, b) {
        if (a === b) {
            return a !== 0 || 1 / a === 1 / b;
        }
        return a !== a && b !== b;
    };
}

//  Object.assign,只拷贝【自身可枚举属性以及symbol】,复制到目标对象[第一个参数]
{
    //第一个参数是null,或undefined的时候报错
    var obj = Object.assign({ name: 1 }, undefined, [3]);
    console.log(obj);
    //只有字符串的包装对象，会产生可枚举属性,字符串会转成数组
    var str = Object('abc');
    console.log(str);
    Object.assign(obj, 'str');
    console.log(obj);
    //  如果非字符串的基本数据类型作为target
    var num = 2;
    Object.assign(num); //  表达式的返回值是 Number{2},num === 2
    //  assign只能进行值赋值,如果值是一个取值函数,则取出其值
    var o = {
        get f() {
            return 1;
        }
    };
    Object.assign(obj, o);
    console.log(obj);
}
//  作用
{
    //1.指定默认值
    var Default = { a: 1, b: 1 };
    var obj1 = Object.assign({}, Default, { b: 2 });
    console.log(obj1);
    //2.克隆对象
    var obj2 = Object.assign({}, Default, Object.getPrototypeOf(Default));
    console.log(obj2);
}

//  Object.getOwnPropertyDescriptors , 返回指定对象所有自身属性及Symbol（非继承属性）的描述对象。
{
    var _obj2 = _defineProperty({ name: 1, getOwn: 'getOwnPropertyDescriptors' }, Symbol(), 123);
    var des1 = Object.getOwnPropertyDescriptors(_obj2);
    console.log(des1);
}
//  Object.getOwnPropertyDescriptor实现Object.getOwnPropertyDescriptors
//  主要是为了解决Object.assign()无法正确拷贝get属性和set属性的问题。
{
    var getOwnPropertyDescriptors = function getOwnPropertyDescriptors(obj) {
        var _obj = {};
        Reflect.ownKeys(obj).forEach(function (t, i) {
            _obj[t] = Object.getOwnPropertyDescriptor(obj, t);
        });
        return _obj;
    };

    var a = { name: 1 };
    Object.defineProperty(a, 'n', {
        enumerable: true, get: function get() {
            return this.name;
        },
        set: function set(x) {
            this.name = x;
        }
    });
    var b = getOwnPropertyDescriptors(a);
    console.log(a);
    console.log(b);
}
//  实现对属性的完全拷贝
{
    var copy = function copy(origin) {
        var obj = {};
        Reflect.ownKeys(origin).map(function (t, i) {
            Object.defineProperty(obj, t, Object.getOwnPropertyDescriptor(origin, t));
        });
        return obj;
    };

    var _a = Object.defineProperty({}, 'name', {
        get: function get() {
            "use strict";

            return this.n;
        },
        set: function set(x) {
            "use strict";

            this.n = x;
        }
    });
    _a.name = 12;
    var _b = copy(_a);
    console.log(_b);
    console.log(Object.getOwnPropertyDescriptor(_b, 'name'));

    //  简单实现
    copy1 = function copy1(origin) {
        return Object.defineProperties({}, Object.getOwnPropertyDescriptors(origin));
    };

    var c = copy1(_b);
    console.log(c);
}

//  Object.setPrototypeOf,Object.getPrototypeOf
{
    //   ES6 正式推荐的设置原型对象的方法
    var proto = { name: 1 };
    var _obj4 = Object.setPrototypeOf({}, proto);
    console.log(_obj4);
}

//  Object.keys,Object.values,Object.entries
{
    var _obj6;

    //  Object.keys, 返回自身所有可枚举属性,不含symbol,不含继承
    //  遍历顺序即 数字,字母加入的顺序
    var keys = Object.keys,
        values = Object.values,
        entries = Object.entries;

    var _obj5 = (_obj6 = { a: 1, c: 3, b: 2 }, _defineProperty(_obj6, Symbol(), 'symbol'), _defineProperty(_obj6, "1", 'james'), _obj6);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = keys(_obj5)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            console.log(key);
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

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = values(_obj5)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var value = _step2.value;

            console.log(value);
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

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = entries(_obj5)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _step3$value = _slicedToArray(_step3.value, 2),
                _key = _step3$value[0],
                _value = _step3$value[1];

            console.log(_key, _value);
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

    console.log(keys('123456'));
    console.log(values('123456'));
    console.log(entries('123456'));
}

//  Object.fromEntries 是 Object.entries的逆运算
{
    Object.fromEntries = Object.fromEntries || function (arr) {
        var obj = {};
        arr.forEach(function (t, i) {
            obj[t[0]] = t[1];
        });
        return obj;
    };
    var _obj7 = Object.fromEntries([['foo', 'bar'], ['baz', 42]]);
    console.log(_obj7);
}