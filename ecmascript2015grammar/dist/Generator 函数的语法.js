'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

{
    var hello = /*#__PURE__*/regeneratorRuntime.mark(function hello() {
        "use strict";

        return regeneratorRuntime.wrap(function hello$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return 'hello';

                    case 2:
                        _context.next = 4;
                        return function () {
                            alert('惰性求值,暂时不执行');
                            return 'word';
                        }();

                    case 4:
                        console.log('允许执行了end');
                        return _context.abrupt('return', 'ending');

                    case 6:
                    case 'end':
                        return _context.stop();
                }
            }
        }, hello, this);
    });


    var h = hello();
    //console.log(h);
    //console.log(h.next());
    //console.log(h.next());
    //console.log(h.next());
}

{
    var arr = [1, [[2, 3], 4], [5, 6]];
    var flat = /*#__PURE__*/regeneratorRuntime.mark(function flat(a) {
        var length, i, item;
        return regeneratorRuntime.wrap(function flat$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        length = a.length;
                        i = 0;

                    case 2:
                        if (!(i < length)) {
                            _context2.next = 13;
                            break;
                        }

                        item = a[i];

                        if (!(typeof item !== 'number')) {
                            _context2.next = 8;
                            break;
                        }

                        return _context2.delegateYield(flat(item), 't0', 6);

                    case 6:
                        _context2.next = 10;
                        break;

                    case 8:
                        _context2.next = 10;
                        return item;

                    case 10:
                        i++;
                        _context2.next = 2;
                        break;

                    case 13:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, flat, this);
    });

    var fl = flat(arr);
    fl.next();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = fl[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            //console.log(f);

            var f = _step.value;
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

{
    var myIterable = {};
    myIterable[Symbol.iterator] = /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return 1;

                    case 2:
                        _context3.next = 4;
                        return 12;

                    case 4:
                        _context3.next = 6;
                        return 3;

                    case 6:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee, this);
    });

    //console.log([...myIterable]);
    var _gen = myIterable[Symbol.iterator]();
    //console.log(gen.next());
}

{
    var _gen2 = /*#__PURE__*/regeneratorRuntime.mark(function _gen2() {
        return regeneratorRuntime.wrap(function _gen2$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _gen2, this);
    });

    var g = _gen2();
    //  Generator函数指向返回的遍历器对象的Symbol.iterator属性执行后返回的对象===这个遍历器对象
    //console.log(g, g[Symbol.iterator]() === g);
}

/**
 * next方法,可以向函数内传递参数,作为上一次执行yield表达式的值
 * */
{
    var _f = /*#__PURE__*/regeneratorRuntime.mark(function _f() {
        "use strict";

        var i, reset;
        return regeneratorRuntime.wrap(function _f$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        i = 0;

                    case 1:
                        if (!true) {
                            _context5.next = 9;
                            break;
                        }

                        _context5.next = 4;
                        return i;

                    case 4:
                        reset = _context5.sent;

                        if (reset) {
                            i = -11;
                        }

                    case 6:
                        i++;
                        _context5.next = 1;
                        break;

                    case 9:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _f, this);
    });

    var _g = _f();
    //console.log(g.next());
    //console.log(g.next());
    //console.log(g.next());
    //console.log(g.next(1));
    //console.log(g.next());
}

{
    var foo = /*#__PURE__*/regeneratorRuntime.mark(function foo(x) {
        "use strict";

        var y, z;
        return regeneratorRuntime.wrap(function foo$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return x + 1;

                    case 2:
                        _context6.t0 = _context6.sent;
                        y = 2 * _context6.t0;
                        _context6.next = 6;
                        return y / 3;

                    case 6:
                        z = _context6.sent;
                        return _context6.abrupt('return', x + y + z);

                    case 8:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, foo, this);
    });


    var a = foo(3);
    a.next();
    a.next(3);
    //console.log(a.next(2));
}

{
    var dataConsumer = /*#__PURE__*/regeneratorRuntime.mark(function dataConsumer() {
        "use strict";
        //console.log('Started');

        return regeneratorRuntime.wrap(function dataConsumer$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.t0 = console;
                        _context7.next = 3;
                        return;

                    case 3:
                        _context7.t1 = _context7.sent;
                        _context7.t2 = '1.' + _context7.t1;

                        _context7.t0.log.call(_context7.t0, _context7.t2);

                        _context7.t3 = console;
                        _context7.next = 9;
                        return;

                    case 9:
                        _context7.t4 = _context7.sent;
                        _context7.t5 = '2.' + _context7.t4;

                        _context7.t3.log.call(_context7.t3, _context7.t5);

                        return _context7.abrupt('return', 'result');

                    case 13:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, dataConsumer, this);
    });


    var genObj = dataConsumer();
    genObj.next();
    //console.log(genObj.next('a'));
    //console.log(genObj.next('b'));
}

/**
 *  由于第一个next的参数会被忽略,所以只要在传参之前预调用一个next就行了
 * */
{
    var wrapper = function wrapper(generatorFunction) {
        return function () {
            var generatorObject = generatorFunction.apply(undefined, arguments);
            generatorObject.next();
            return generatorObject;
        };
    };

    //console.log(wr.next('hello!'));
    //console.log(wr.next('hello!'));


    //  我的
    var _gen3 = function _gen3(x) {
        var obj = /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            return regeneratorRuntime.wrap(function _callee3$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            _context9.t0 = console;
                            _context9.next = 3;
                            return '??';

                        case 3:
                            _context9.t1 = _context9.sent;
                            _context9.t2 = '\u7B2C' + _context9.t1;
                            _context9.t3 = _context9.t2 + '[1]\u662F:';
                            _context9.t4 = x;
                            _context9.t5 = _context9.t3 + _context9.t4;

                            _context9.t0.log.call(_context9.t0, _context9.t5);

                            _context9.t6 = console;
                            _context9.next = 12;
                            return 'ffff';

                        case 12:
                            _context9.t7 = _context9.sent;
                            _context9.t8 = '\u7B2C' + _context9.t7;
                            _context9.t9 = _context9.t8 + '[2]\u662F:';
                            _context9.t10 = x;
                            _context9.t11 = _context9.t9 + _context9.t10;

                            _context9.t6.log.call(_context9.t6, _context9.t11);

                        case 18:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, _callee3, this);
        })();
        obj.next();
        return obj;
    };

    var wrapped = wrapper( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.t0 = console;
                        _context8.next = 3;
                        return;

                    case 3:
                        _context8.t1 = _context8.sent;
                        _context8.t2 = 'First input: ' + _context8.t1;

                        _context8.t0.log.call(_context8.t0, _context8.t2);

                        _context8.t3 = console;
                        _context8.next = 9;
                        return;

                    case 9:
                        _context8.t4 = _context8.sent;
                        _context8.t5 = 'Second input: ' + _context8.t4;

                        _context8.t3.log.call(_context8.t3, _context8.t5);

                        return _context8.abrupt('return', 'DONE');

                    case 13:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee2, this);
    }));

    var wr = wrapped();

    var b = _gen3('james');
    //console.log(b.next(1));
    //console.log(b.next(2))
}

/**
 * for...of
 * */
{
    var _gen4 = /*#__PURE__*/regeneratorRuntime.mark(function _gen4() {
        return regeneratorRuntime.wrap(function _gen4$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        _context10.next = 2;
                        return 1;

                    case 2:
                        _context10.next = 4;
                        return 2;

                    case 4:
                        return _context10.abrupt('return', 3);

                    case 5:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _gen4, this);
    });
    var obj = _gen4();
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = obj[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var key = _step2.value;
        }
        //console.log(key);

        //console.log(obj.next());
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
/**
 * for...of generator 的 斐波那契
 * */
{
    var fib = /*#__PURE__*/regeneratorRuntime.mark(function fib(x) {
        var p, n, _ref;

        return regeneratorRuntime.wrap(function fib$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        p = 1, n = 0;

                    case 1:
                        if (!x) {
                            _context11.next = 10;
                            break;
                        }

                        _ref = [n, n + p];
                        p = _ref[0];
                        n = _ref[1];
                        _context11.next = 7;
                        return n;

                    case 7:
                        x--;
                        _context11.next = 1;
                        break;

                    case 10:
                        return _context11.abrupt('return', false);

                    case 11:
                    case 'end':
                        return _context11.stop();
                }
            }
        }, fib, this);
    });


    var fi = fib(20);
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = fi[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            //console.log(key);

            var _key = _step3.value;
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
 * for...of 循环对象
 * */
{
    var _gen5 = /*#__PURE__*/regeneratorRuntime.mark(function _gen5(x) {
        "use strict";

        var propKeys, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _key2;

        return regeneratorRuntime.wrap(function _gen5$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        propKeys = Reflect.ownKeys(x);
                        _iteratorNormalCompletion4 = true;
                        _didIteratorError4 = false;
                        _iteratorError4 = undefined;
                        _context12.prev = 4;
                        _iterator4 = propKeys[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                            _context12.next = 13;
                            break;
                        }

                        _key2 = _step4.value;
                        _context12.next = 10;
                        return { 'key': _key2, 'value': x[_key2] };

                    case 10:
                        _iteratorNormalCompletion4 = true;
                        _context12.next = 6;
                        break;

                    case 13:
                        _context12.next = 19;
                        break;

                    case 15:
                        _context12.prev = 15;
                        _context12.t0 = _context12['catch'](4);
                        _didIteratorError4 = true;
                        _iteratorError4 = _context12.t0;

                    case 19:
                        _context12.prev = 19;
                        _context12.prev = 20;

                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }

                    case 22:
                        _context12.prev = 22;

                        if (!_didIteratorError4) {
                            _context12.next = 25;
                            break;
                        }

                        throw _iteratorError4;

                    case 25:
                        return _context12.finish(22);

                    case 26:
                        return _context12.finish(19);

                    case 27:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, _gen5, this, [[4, 15, 19, 27], [20,, 22, 26]]);
    });

    var _obj = _defineProperty({ name: 'james' }, Symbol('ncaa'), '??');
    var _g2 = _gen5(_obj);
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = _g2[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            //console.log(key);

            var _key3 = _step5.value;
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

{
    //  将Generator部署到Symbol.iterator属性上
    var objectEntries = /*#__PURE__*/regeneratorRuntime.mark(function objectEntries() {
        "use strict";

        var propKeys, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, propKey;

        return regeneratorRuntime.wrap(function objectEntries$(_context13) {
            while (1) {
                switch (_context13.prev = _context13.next) {
                    case 0:
                        propKeys = Object.keys(this);
                        _iteratorNormalCompletion6 = true;
                        _didIteratorError6 = false;
                        _iteratorError6 = undefined;
                        _context13.prev = 4;
                        _iterator6 = propKeys[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                            _context13.next = 13;
                            break;
                        }

                        propKey = _step6.value;
                        _context13.next = 10;
                        return [propKey, this[propKey]];

                    case 10:
                        _iteratorNormalCompletion6 = true;
                        _context13.next = 6;
                        break;

                    case 13:
                        _context13.next = 19;
                        break;

                    case 15:
                        _context13.prev = 15;
                        _context13.t0 = _context13['catch'](4);
                        _didIteratorError6 = true;
                        _iteratorError6 = _context13.t0;

                    case 19:
                        _context13.prev = 19;
                        _context13.prev = 20;

                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }

                    case 22:
                        _context13.prev = 22;

                        if (!_didIteratorError6) {
                            _context13.next = 25;
                            break;
                        }

                        throw _iteratorError6;

                    case 25:
                        return _context13.finish(22);

                    case 26:
                        return _context13.finish(19);

                    case 27:
                    case 'end':
                        return _context13.stop();
                }
            }
        }, objectEntries, this, [[4, 15, 19, 27], [20,, 22, 26]]);
    });


    var jane = { first: 'jane', last: 'james' };
    jane[Symbol.iterator] = objectEntries;

    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
        for (var _iterator7 = jane[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            //console.log(key, value);

            var _step7$value = _slicedToArray(_step7.value, 2),
                _key4 = _step7$value[0],
                value = _step7$value[1];
        }
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
}

/**
 *  扩展运算符\解构赋值\Array.from
 * */
{
    //console.log(x, y, z, w);

    var num = /*#__PURE__*/regeneratorRuntime.mark(function num() {
        "use strict";

        return regeneratorRuntime.wrap(function num$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        _context14.next = 2;
                        return 1;

                    case 2:
                        _context14.next = 4;
                        return 2;

                    case 4:
                        _context14.next = 6;
                        return 3;

                    case 6:
                        return _context14.abrupt('return', 4);

                    case 7:
                    case 'end':
                        return _context14.stop();
                }
            }
        }, num, this);
    });

    //  扩展运算符
    //console.log([...num()]);
    //  Array.from
    //console.log(Array.from(num()));

    //  对象的Symbol.iterator

    //  解构
    var _num = num(),
        _num2 = _slicedToArray(_num, 4),
        x = _num2[0],
        y = _num2[1],
        z = _num2[2],
        w = _num2[3];

    var _obj3 = {};
    _obj3[Symbol.iterator] = num;
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
        for (var _iterator8 = _obj3[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            //console.log(key)

            var _key5 = _step8.value;
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

/**
 * Generator.prototype.throw
 * */
{
    var _g3 = /*#__PURE__*/regeneratorRuntime.mark(function _g3() {
        "use strict";

        return regeneratorRuntime.wrap(function _g3$(_context15) {
            while (1) {
                switch (_context15.prev = _context15.next) {
                    case 0:
                        _context15.prev = 0;
                        _context15.next = 3;
                        return 1;

                    case 3:
                        _context15.next = 5;
                        return 1;

                    case 5:
                        _context15.next = 7;
                        return 1;

                    case 7:
                        _context15.next = 12;
                        break;

                    case 9:
                        _context15.prev = 9;
                        _context15.t0 = _context15['catch'](0);

                        console.log('\u5185\u90E8\u6355\u83B7' + _context15.t0, '\n\u7531\u4E8E Generator \u51FD\u6570\u5185\u90E8\u7684catch\u8BED\u53E5\u5DF2\u7ECF\u6267\u884C\u8FC7\u4E86\uFF0C\u518D\u6B21\u629B\u51FA\u9519\u8BEF\u4E0D\u4F1A\u518D\u6355\u6349\u5230\u8FD9\u4E2A\u9519\u8BEF\u4E86\uFF0C\u6240\u4EE5\u8FD9\u4E2A\u9519\u8BEF\u5C31\u88AB\u629B\u51FA\u4E86 Generator \u51FD\u6570\u4F53\uFF0C\u88AB\u51FD\u6570\u4F53\u5916\u7684catch\u8BED\u53E5\u6355\u83B7\u3002');

                    case 12:
                        _context15.next = 14;
                        return 2;

                    case 14:
                        _context15.next = 16;
                        return 3;

                    case 16:
                    case 'end':
                        return _context15.stop();
                }
            }
        }, _g3, this, [[0, 9]]);
    });

    var i = _g3();
    //  执行next是必要的
    i.next();
    try {
        //console.log(i.throw('a'));
        //console.log(i.throw('b'));
    } catch (err) {
        console.log('\u5916\u90E8\u6355\u83B7' + err);
    }
    //console.log(i.next())
}

/**
 *  Generator.prototype.return
 * */
{
    var _num3 = /*#__PURE__*/regeneratorRuntime.mark(function _num3() {
        "use strict";

        return regeneratorRuntime.wrap(function _num3$(_context16) {
            while (1) {
                switch (_context16.prev = _context16.next) {
                    case 0:
                        _context16.next = 2;
                        return 1;

                    case 2:
                        _context16.prev = 2;
                        _context16.next = 5;
                        return 2;

                    case 5:
                        _context16.next = 7;
                        return 3;

                    case 7:
                        _context16.prev = 7;
                        _context16.next = 10;
                        return 4;

                    case 10:
                        _context16.next = 12;
                        return 5;

                    case 12:
                        return _context16.finish(7);

                    case 13:
                        _context16.next = 15;
                        return 6;

                    case 15:
                    case 'end':
                        return _context16.stop();
                }
            }
        }, _num3, this, [[2,, 7, 13]]);
    });

    var _g4 = _num3();
    _g4.next();
    _g4.next();
    //console.log(g.return());
    //console.log(g.next());
}

//  *********
/**
 * yield *
 * */
{
    var _foo = /*#__PURE__*/regeneratorRuntime.mark(function _foo() {
        return regeneratorRuntime.wrap(function _foo$(_context17) {
            while (1) {
                switch (_context17.prev = _context17.next) {
                    case 0:
                        _context17.next = 2;
                        return 'a';

                    case 2:
                        _context17.next = 4;
                        return 'b';

                    case 4:
                    case 'end':
                        return _context17.stop();
                }
            }
        }, _foo, this);
    });

    var bar = /*#__PURE__*/regeneratorRuntime.mark(function bar() {
        return regeneratorRuntime.wrap(function bar$(_context18) {
            while (1) {
                switch (_context18.prev = _context18.next) {
                    case 0:
                        _context18.next = 2;
                        return 'x';

                    case 2:
                        return _context18.delegateYield(_foo(), 't0', 3);

                    case 3:
                        _context18.next = 5;
                        return 'y';

                    case 5:
                    case 'end':
                        return _context18.stop();
                }
            }
        }, bar, this);
    });

    // *********************等同于

    {
        var _bar = /*#__PURE__*/regeneratorRuntime.mark(function _bar() {
            return regeneratorRuntime.wrap(function _bar$(_context19) {
                while (1) {
                    switch (_context19.prev = _context19.next) {
                        case 0:
                            _context19.next = 2;
                            return 'x';

                        case 2:
                            _context19.next = 4;
                            return 'a';

                        case 4:
                            _context19.next = 6;
                            return 'b';

                        case 6:
                            _context19.next = 8;
                            return 'y';

                        case 8:
                        case 'end':
                            return _context19.stop();
                    }
                }
            }, _bar, this);
        });
    }

    // ***********************等同于
    {
        var _bar2 = /*#__PURE__*/regeneratorRuntime.mark(function _bar2() {
            var _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, v;

            return regeneratorRuntime.wrap(function _bar2$(_context20) {
                while (1) {
                    switch (_context20.prev = _context20.next) {
                        case 0:
                            _context20.next = 2;
                            return 'x';

                        case 2:
                            _iteratorNormalCompletion9 = true;
                            _didIteratorError9 = false;
                            _iteratorError9 = undefined;
                            _context20.prev = 5;
                            _iterator9 = _foo()[Symbol.iterator]();

                        case 7:
                            if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
                                _context20.next = 14;
                                break;
                            }

                            v = _step9.value;
                            _context20.next = 11;
                            return v;

                        case 11:
                            _iteratorNormalCompletion9 = true;
                            _context20.next = 7;
                            break;

                        case 14:
                            _context20.next = 20;
                            break;

                        case 16:
                            _context20.prev = 16;
                            _context20.t0 = _context20['catch'](5);
                            _didIteratorError9 = true;
                            _iteratorError9 = _context20.t0;

                        case 20:
                            _context20.prev = 20;
                            _context20.prev = 21;

                            if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                _iterator9.return();
                            }

                        case 23:
                            _context20.prev = 23;

                            if (!_didIteratorError9) {
                                _context20.next = 26;
                                break;
                            }

                            throw _iteratorError9;

                        case 26:
                            return _context20.finish(23);

                        case 27:
                            return _context20.finish(20);

                        case 28:
                            _context20.next = 30;
                            return 'y';

                        case 30:
                        case 'end':
                            return _context20.stop();
                    }
                }
            }, _bar2, this, [[5, 16, 20, 28], [21,, 23, 27]]);
        });
    }

    var _iteratorNormalCompletion10 = true;
    var _didIteratorError10 = false;
    var _iteratorError10 = undefined;

    try {
        for (var _iterator10 = bar()[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
            //console.log(v);

            var v = _step10.value;
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
}
{
    var inner = /*#__PURE__*/regeneratorRuntime.mark(function inner() {
        return regeneratorRuntime.wrap(function inner$(_context21) {
            while (1) {
                switch (_context21.prev = _context21.next) {
                    case 0:
                        _context21.next = 2;
                        return 2;

                    case 2:
                    case 'end':
                        return _context21.stop();
                }
            }
        }, inner, this);
    });
    var outer1 = /*#__PURE__*/regeneratorRuntime.mark(function outer1() {
        return regeneratorRuntime.wrap(function outer1$(_context22) {
            while (1) {
                switch (_context22.prev = _context22.next) {
                    case 0:
                        _context22.next = 2;
                        return 1;

                    case 2:
                        _context22.next = 4;
                        return inner();

                    case 4:
                        _context22.next = 6;
                        return 3;

                    case 6:
                    case 'end':
                        return _context22.stop();
                }
            }
        }, outer1, this);
    });

    //console.log(gen.next().value);
    //console.log(gen.next().value.next().value);  // 返回一个遍历器对象
    //console.log(gen.next().value);

    //  相当于
    var outer2 = /*#__PURE__*/regeneratorRuntime.mark(function outer2() {
        return regeneratorRuntime.wrap(function outer2$(_context23) {
            while (1) {
                switch (_context23.prev = _context23.next) {
                    case 0:
                        _context23.next = 2;
                        return 1;

                    case 2:
                        return _context23.delegateYield(inner(), 't0', 3);

                    case 3:
                        _context23.next = 5;
                        return 3;

                    case 5:
                    case 'end':
                        return _context23.stop();
                }
            }
        }, outer2, this);
    });


    var gen = outer1();

    var gen = outer2();
    //console.log(gen.next().value);
    //console.log(gen.next().value);
    //console.log(gen.next().value);
}
{
    var _a = /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context24) {
            while (1) {
                switch (_context24.prev = _context24.next) {
                    case 0:
                        _context24.next = 2;
                        return 2;

                    case 2:
                        _context24.next = 4;
                        return 3;

                    case 4:
                    case 'end':
                        return _context24.stop();
                }
            }
        }, _callee4, this);
    })();
    var delegatingIterator = /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context25) {
            while (1) {
                switch (_context25.prev = _context25.next) {
                    case 0:
                        _context25.next = 2;
                        return 1;

                    case 2:
                        return _context25.delegateYield(_a, 't0', 3);

                    case 3:
                        _context25.next = 5;
                        return 4;

                    case 5:
                    case 'end':
                        return _context25.stop();
                }
            }
        }, _callee5, this);
    })();

    var _iteratorNormalCompletion11 = true;
    var _didIteratorError11 = false;
    var _iteratorError11 = undefined;

    try {
        for (var _iterator11 = delegatingIterator[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            //console.log(value);

            var value = _step11.value;
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
//  在内部调用的Generator函数有return语句时
{
    var _a2 = /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context26) {
            while (1) {
                switch (_context26.prev = _context26.next) {
                    case 0:
                        _context26.next = 2;
                        return 2;

                    case 2:
                        _context26.next = 4;
                        return 3;

                    case 4:
                        return _context26.abrupt('return', 4);

                    case 5:
                    case 'end':
                        return _context26.stop();
                }
            }
        }, _callee6, this);
    })();
    var _b = /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var _temp;

        return regeneratorRuntime.wrap(function _callee7$(_context27) {
            while (1) {
                switch (_context27.prev = _context27.next) {
                    case 0:
                        _context27.next = 2;
                        return 1;

                    case 2:
                        return _context27.delegateYield(_a2, 't0', 3);

                    case 3:
                        _temp = _context27.t0;
                        _context27.next = 6;
                        return _temp;

                    case 6:
                        _context27.next = 8;
                        return 5;

                    case 8:
                        return _context27.abrupt('return', 6);

                    case 9:
                    case 'end':
                        return _context27.stop();
                }
            }
        }, _callee7, this);
    })();
    var _iteratorNormalCompletion12 = true;
    var _didIteratorError12 = false;
    var _iteratorError12 = undefined;

    try {
        for (var _iterator12 = _b[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
            //console.log(key);

            var _key6 = _step12.value;
        }
    } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion12 && _iterator12.return) {
                _iterator12.return();
            }
        } finally {
            if (_didIteratorError12) {
                throw _iteratorError12;
            }
        }
    }
}

{
    var _foo2 = /*#__PURE__*/regeneratorRuntime.mark(function _foo2() {
        "use strict";

        return regeneratorRuntime.wrap(function _foo2$(_context28) {
            while (1) {
                switch (_context28.prev = _context28.next) {
                    case 0:
                        _context28.next = 2;
                        return 1;

                    case 2:
                        return _context28.abrupt('return', 2);

                    case 3:
                    case 'end':
                        return _context28.stop();
                }
            }
        }, _foo2, this);
    });

    var _bar3 = /*#__PURE__*/regeneratorRuntime.mark(function _bar3() {
        "use strict";

        var f;
        return regeneratorRuntime.wrap(function _bar3$(_context29) {
            while (1) {
                switch (_context29.prev = _context29.next) {
                    case 0:
                        return _context29.delegateYield(_foo2(), 't0', 1);

                    case 1:
                        f = _context29.t0;
                        _context29.next = 4;
                        return f;

                    case 4:
                        _context29.next = 6;
                        return 3;

                    case 6:
                    case 'end':
                        return _context29.stop();
                }
            }
        }, _bar3, this);
    });

    var _gen6 = _bar3();
    var _iteratorNormalCompletion13 = true;
    var _didIteratorError13 = false;
    var _iteratorError13 = undefined;

    try {
        for (var _iterator13 = _gen6[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
            //console.log(key);

            var _key7 = _step13.value;
        }
    } catch (err) {
        _didIteratorError13 = true;
        _iteratorError13 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion13 && _iterator13.return) {
                _iterator13.return();
            }
        } finally {
            if (_didIteratorError13) {
                throw _iteratorError13;
            }
        }
    }
}

{
    var genFuncWithReturn = /*#__PURE__*/regeneratorRuntime.mark(function genFuncWithReturn() {
        return regeneratorRuntime.wrap(function genFuncWithReturn$(_context30) {
            while (1) {
                switch (_context30.prev = _context30.next) {
                    case 0:
                        _context30.next = 2;
                        return 'a';

                    case 2:
                        _context30.next = 4;
                        return 'b';

                    case 4:
                        return _context30.abrupt('return', 'The result');

                    case 5:
                    case 'end':
                        return _context30.stop();
                }
            }
        }, genFuncWithReturn, this);
    });
    var logReturned = /*#__PURE__*/regeneratorRuntime.mark(function logReturned(genObj) {
        var result;
        return regeneratorRuntime.wrap(function logReturned$(_context31) {
            while (1) {
                switch (_context31.prev = _context31.next) {
                    case 0:
                        return _context31.delegateYield(genObj, 't0', 1);

                    case 1:
                        result = _context31.t0;

                        console.log(result);

                    case 3:
                    case 'end':
                        return _context31.stop();
                }
            }
        }, logReturned, this);
    });

    //let a = [...logReturned(genFuncWithReturn())];
}

//  数组的深度遍历
{
    var getArr = /*#__PURE__*/regeneratorRuntime.mark(function getArr(item) {
        var _iteratorNormalCompletion14, _didIteratorError14, _iteratorError14, _iterator14, _step14, _key8;

        return regeneratorRuntime.wrap(function getArr$(_context32) {
            while (1) {
                switch (_context32.prev = _context32.next) {
                    case 0:
                        if (!Array.isArray(item)) {
                            _context32.next = 28;
                            break;
                        }

                        _iteratorNormalCompletion14 = true;
                        _didIteratorError14 = false;
                        _iteratorError14 = undefined;
                        _context32.prev = 4;
                        _iterator14 = item[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done) {
                            _context32.next = 12;
                            break;
                        }

                        _key8 = _step14.value;
                        return _context32.delegateYield(getArr(_key8), 't0', 9);

                    case 9:
                        _iteratorNormalCompletion14 = true;
                        _context32.next = 6;
                        break;

                    case 12:
                        _context32.next = 18;
                        break;

                    case 14:
                        _context32.prev = 14;
                        _context32.t1 = _context32['catch'](4);
                        _didIteratorError14 = true;
                        _iteratorError14 = _context32.t1;

                    case 18:
                        _context32.prev = 18;
                        _context32.prev = 19;

                        if (!_iteratorNormalCompletion14 && _iterator14.return) {
                            _iterator14.return();
                        }

                    case 21:
                        _context32.prev = 21;

                        if (!_didIteratorError14) {
                            _context32.next = 24;
                            break;
                        }

                        throw _iteratorError14;

                    case 24:
                        return _context32.finish(21);

                    case 25:
                        return _context32.finish(18);

                    case 26:
                        _context32.next = 30;
                        break;

                    case 28:
                        _context32.next = 30;
                        return item;

                    case 30:
                    case 'end':
                        return _context32.stop();
                }
            }
        }, getArr, this, [[4, 14, 18, 26], [19,, 21, 25]]);
    });


    var _arr = [1, [2, [3, 4, 5], 6]];
    var _iteratorNormalCompletion15 = true;
    var _didIteratorError15 = false;
    var _iteratorError15 = undefined;

    try {
        for (var _iterator15 = getArr(_arr)[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
            //console.log(key);

            var _key9 = _step15.value;
        }
    } catch (err) {
        _didIteratorError15 = true;
        _iteratorError15 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion15 && _iterator15.return) {
                _iterator15.return();
            }
        } finally {
            if (_didIteratorError15) {
                throw _iteratorError15;
            }
        }
    }
}

/**
 * 作为对象属性的Generator函数
 * */
{
    var o = {
        foo: /*#__PURE__*/regeneratorRuntime.mark(function foo() {
            return regeneratorRuntime.wrap(function foo$(_context33) {
                while (1) {
                    switch (_context33.prev = _context33.next) {
                        case 0:
                        case 'end':
                            return _context33.stop();
                    }
                }
            }, foo, this);
        })
    };
}

/**
 * 让Generator函数返回一个正常的对象实例,既可以用next方法,又可以获得正常的this?
 * */
//  没求用****************************
{
    var F = /*#__PURE__*/regeneratorRuntime.mark(function F() {
        "use strict";

        return regeneratorRuntime.wrap(function F$(_context34) {
            while (1) {
                switch (_context34.prev = _context34.next) {
                    case 0:
                        this.a = 1;
                        _context34.next = 3;
                        return this.b = 2;

                    case 3:
                        _context34.next = 5;
                        return this.c = 3;

                    case 5:
                    case 'end':
                        return _context34.stop();
                }
            }
        }, F, this);
    });


    var _obj4 = {};
    var _f2 = F.call(_obj4);

    //console.log(f.next());
    //  这时的f是遍历器对象,obj是实例
    //console.log(f, obj);
}

/**
 * Generator实现状态机
 * */
{
    var toggle = /*#__PURE__*/regeneratorRuntime.mark(function toggle() {
        "use strict";

        return regeneratorRuntime.wrap(function toggle$(_context35) {
            while (1) {
                switch (_context35.prev = _context35.next) {
                    case 0:
                        if (!1) {
                            _context35.next = 11;
                            break;
                        }

                        _context35.next = 3;
                        return 1;

                    case 3:
                        _context35.next = 5;
                        return 2;

                    case 5:
                        _context35.next = 7;
                        return 3;

                    case 7:
                        if (!_context35.sent) {
                            _context35.next = 9;
                            break;
                        }

                        return _context35.abrupt('break', 11);

                    case 9:
                        _context35.next = 0;
                        break;

                    case 11:
                    case 'end':
                        return _context35.stop();
                }
            }
        }, toggle, this);
    });


    var _g5 = toggle();
    var _i = 10;
    while (_i) {
        //console.log(g.next().value);
        _i--;
    }

    var button = document.createElement('button');
    button.innerHTML = 'james';
    document.body.appendChild(button);
    button.onclick = function () {
        //              这个true会改变yield表达式的值
        var value = _g5.next(true).value;
        console.log(value);
    };
}