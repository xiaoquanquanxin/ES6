'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//  set
{
    var _s = new Set();
    [1, 2, 3, 1, 2, 3].forEach(function (x) {
        return _s.add(x);
    });
    console.log(_s, _s.size);
    //  数组去重
    console.log([].concat(_toConsumableArray(new Set([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 7]))));
    console.log(Array.from(new Set([1, 23, 4, 56, 1, 2, 3, 4, 5, 6])));
    //  set认为 +0 和 -0 ，NaN和NaN相等
}

//  Set的方法包括 操作方法 和 遍历方法 两大类
//  操作方法
{
    var s = new Set([1, 2, 3]);
    s.add(4);
    s.delete(3);
    s.has(2);
    s.clear();
}

//  遍历方法
{
    var _s2 = new Set([3, 2, 1, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]);
    //  Set 结构没有键名，只有键值,所以keys和values的返回值相同
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = _s2.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            //console.log(item);

            var item = _step.value;
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

    _s2.forEach(function (val, key) {});
}
//  遍历的应用
{
    var arr = [1,,,, 2, 1, 22, 3, 31];
    var _s3 = new Set(arr.filter(function (x) {
        return x !== undefined;
    }).map(function (x) {
        return x * x;
    }));
    console.log(_s3);
}
//  两个set的并集,交集,差集
{
    var a = new Set([1, 2, 3]);
    var b = new Set([2, 3, 4]);
    var c = new Set([].concat(_toConsumableArray(a), _toConsumableArray(b)));
    console.log('并集', c);
    var d = new Set([].concat(_toConsumableArray(a)).filter(function (x) {
        return b.has(x);
    }));
    console.log('交集', d);
    var e = new Set([].concat(_toConsumableArray(c)).filter(function (x) {
        return !(a.has(x) && b.has(x));
    }));
    console.log('差集', e);
}

//  WeakSet
{
    var ws = new WeakSet();
    console.log(ws);
    //  任何有Iterable接口的对象都可以作为WeakSet的参数
    var ws1 = new WeakSet([[], [1], [3, 4]]);
    console.log(ws1);
}
{
    var _b = { b: 3 };
    var _arr = [_b, { a: 1 }];
    var _ws = new WeakSet(_arr);
    console.log(_ws.has(_b));
    console.log(_ws.delete(_b));
    console.log(_ws.add(_b));
}

//  Map
{
    var o = { n: 1 };
    var m = new Map([['key', 'value'], [o, 'j']]);
    m.set(o, 'james');
    console.log(m.get(o));
    m.has(o);
    console.log(m);
    m.delete(o);
}

//  WeakMap
//  部署私有属性。
{
    var _counter = new WeakMap();
    var _action = new WeakMap();

    var Countdown = function () {
        function Countdown(counter, action) {
            _classCallCheck(this, Countdown);

            _counter.set(this, counter);
            _action.set(this, action);
        }

        _createClass(Countdown, [{
            key: 'dec',
            value: function dec() {
                var counter = _counter.get(this);
                if (counter < 1) {
                    return;
                }
                counter--;
                console.log(counter);
                _counter.set(this, counter);
                if (counter === 0) {
                    _action.get(this)();
                }
            }
        }]);

        return Countdown;
    }();

    var _c = new Countdown(3, function () {
        return console.log('DONE');
    });
    _c.dec();
    _c.dec();
    _c.dec();
    _c.dec();
}