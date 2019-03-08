'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

{
    var A = function A() {
        _classCallCheck(this, A);
    };

    var B = function (_A) {
        _inherits(B, _A);

        function B() {
            _classCallCheck(this, B);

            return _possibleConstructorReturn(this, (B.__proto__ || Object.getPrototypeOf(B)).apply(this, arguments));
        }

        return B;
    }(A);
    //console.log(new B(1));

}

//  子类的constructor中必须通过super方法去调用父类的构造函数,否则子类无法得到this对象
//  子类调用super后,才会创建this对象,所以必须先super
{
    var _A2 = function () {
        function _A2(x, y) {
            _classCallCheck(this, _A2);

            this.x = x;
            this.y = y;
        }

        _createClass(_A2, [{
            key: 'toString',
            value: function toString() {
                return '这是A';
            }
        }]);

        return _A2;
    }();

    var _B = function (_A3) {
        _inherits(_B, _A3);

        function _B(x, y, color) {
            _classCallCheck(this, _B);

            var _this2 = _possibleConstructorReturn(this, (_B.__proto__ || Object.getPrototypeOf(_B)).call(this, x, y));

            _this2.color = color;
            return _this2;
        }

        _createClass(_B, [{
            key: 'toString',
            value: function toString() {
                return this.color + ',' + _get(_B.prototype.__proto__ || Object.getPrototypeOf(_B.prototype), 'toString', this).call(this);
            }
        }]);

        return _B;
    }(_A2);

    var b = new _B(2, 3, 'red');
    //console.log(b, b.toString(), b instanceof A, b instanceof B);
}

//  父类的静态方法也会被子类继承
{
    var _A4 = function () {
        function _A4() {
            _classCallCheck(this, _A4);
        }

        _createClass(_A4, null, [{
            key: 'a',
            value: function a() {
                return 1;
            }
        }]);

        return _A4;
    }();

    var _B2 = function (_A5) {
        _inherits(_B2, _A5);

        function _B2() {
            _classCallCheck(this, _B2);

            return _possibleConstructorReturn(this, (_B2.__proto__ || Object.getPrototypeOf(_B2)).apply(this, arguments));
        }

        return _B2;
    }(_A4);
    //console.log(B.a());

}

/**
 * Object.getPrototypeOf()
 * */
{
    var _A6 = function _A6() {
        _classCallCheck(this, _A6);
    };

    var _B3 = function (_A7) {
        _inherits(_B3, _A7);

        function _B3() {
            _classCallCheck(this, _B3);

            return _possibleConstructorReturn(this, (_B3.__proto__ || Object.getPrototypeOf(_B3)).apply(this, arguments));
        }

        return _B3;
    }(_A6);
    //console.log(Object.getPrototypeOf(new A), Object.getPrototypeOf(new B));

}

/**
 *super关键字
 * */
//  super作为函数
{
    var _A8 = function _A8() {
        _classCallCheck(this, _A8);

        //  this指向子类实例
        console.log(this, new.target.name);
    };

    var _B4 = function (_A9) {
        _inherits(_B4, _A9);

        function _B4() {
            _classCallCheck(this, _B4);

            return _possibleConstructorReturn(this, (_B4.__proto__ || Object.getPrototypeOf(_B4)).call(this));
        }

        return _B4;
    }(_A8);

    //console.log(new B);

}
//  super作为对象
{
    var _A10 = function _A10() {
        _classCallCheck(this, _A10);
    };

    var _B5 = function (_A11) {
        _inherits(_B5, _A11);

        function _B5() {
            _classCallCheck(this, _B5);

            return _possibleConstructorReturn(this, (_B5.__proto__ || Object.getPrototypeOf(_B5)).apply(this, arguments));
        }

        _createClass(_B5, [{
            key: 'way',
            value: function way() {
                console.log('指向父类原型');
                return _get(_B5.prototype.__proto__ || Object.getPrototypeOf(_B5.prototype), 'constructor', this);
            }
        }], [{
            key: 'way',
            value: function way() {
                console.log('指向父类');
                return _get(_B5.__proto__ || Object.getPrototypeOf(_B5), 'constructor', this);
            }
        }]);

        return _B5;
    }(_A10);
    //console.log(B.way());
    //console.log(new B().way());

}
//  无法通过super调用父类实例的属性或方法.
{
    var _A12 = function () {
        function _A12() {
            _classCallCheck(this, _A12);

            this.p = 'p';
        }

        _createClass(_A12, [{
            key: 'q',
            get: function get() {
                return 'q';
            }
        }], [{
            key: 't',
            get: function get() {
                return 't';
            }
        }]);

        return _A12;
    }();

    var _B6 = function (_A13) {
        _inherits(_B6, _A13);

        function _B6() {
            _classCallCheck(this, _B6);

            return _possibleConstructorReturn(this, (_B6.__proto__ || Object.getPrototypeOf(_B6)).apply(this, arguments));
        }

        _createClass(_B6, [{
            key: 'm',
            get: function get() {
                return _get(_B6.prototype.__proto__ || Object.getPrototypeOf(_B6.prototype), 'p', this);
            }
        }, {
            key: 'n',
            get: function get() {
                return _get(_B6.prototype.__proto__ || Object.getPrototypeOf(_B6.prototype), 'q', this);
            }
        }], [{
            key: 's',
            get: function get() {
                return _get(_B6.__proto__ || Object.getPrototypeOf(_B6), 't', this);
            }
        }]);

        return _B6;
    }(_A12);

    var _b = new _B6();
    //console.log(`m:${b.m},n:${b.n},s:${B.s}`);
}
//  通过super调用父类方法时,父类的this指向子类实例
{
    var _A14 = function () {
        function _A14() {
            _classCallCheck(this, _A14);

            this.a = 'a';
        }

        _createClass(_A14, [{
            key: 'getA',
            value: function getA() {
                return this.a;
            }
        }]);

        return _A14;
    }();

    var _B7 = function (_A15) {
        _inherits(_B7, _A15);

        function _B7() {
            _classCallCheck(this, _B7);

            var _this8 = _possibleConstructorReturn(this, (_B7.__proto__ || Object.getPrototypeOf(_B7)).call(this));

            _this8.a = 'b';
            return _this8;
        }

        _createClass(_B7, [{
            key: 'getB',
            value: function getB() {
                return _get(_B7.prototype.__proto__ || Object.getPrototypeOf(_B7.prototype), 'getA', this).call(this);
            }
        }]);

        return _B7;
    }(_A14);
    //console.log(new B);
    //console.log(new A().getA(), new B().getB());

}

/**
 * 类的.__proto__
 * */
{
    var _A16 = function _A16() {
        _classCallCheck(this, _A16);
    };

    var _B8 = function (_A17) {
        _inherits(_B8, _A17);

        function _B8() {
            _classCallCheck(this, _B8);

            return _possibleConstructorReturn(this, (_B8.__proto__ || Object.getPrototypeOf(_B8)).apply(this, arguments));
        }

        return _B8;
    }(_A16);
    //console.log(B.__proto__, A);
    //console.log(B.prototype, B.prototype.__proto__, A.prototype);

}
//  相当于
{
    var _A18 = function _A18() {
        _classCallCheck(this, _A18);
    };

    var _B9 = function _B9() {
        _classCallCheck(this, _B9);
    };

    Object.setPrototypeOf(_B9, _A18);
    Object.setPrototypeOf(_B9.prototype, _A18.prototype);
    //console.log(B.__proto__, A);
    //console.log(B.prototype, B.prototype.__proto__, A.prototype);
}

//  子类实例的__proto__
{
    var _A19 = function _A19() {
        _classCallCheck(this, _A19);
    };

    var _B10 = function (_A20) {
        _inherits(_B10, _A20);

        function _B10() {
            _classCallCheck(this, _B10);

            return _possibleConstructorReturn(this, (_B10.__proto__ || Object.getPrototypeOf(_B10)).apply(this, arguments));
        }

        return _B10;
    }(_A19);
    //console.log(new B().__proto__, B.prototype);
    //console.log(new B().__proto__.__proto__, A.prototype);

}

/**
 *原生构造函数的继承
 * */
{
    var MyArray = function (_Array) {
        _inherits(MyArray, _Array);

        function MyArray() {
            _classCallCheck(this, MyArray);

            var _this11 = _possibleConstructorReturn(this, (MyArray.__proto__ || Object.getPrototypeOf(MyArray)).call(this));

            _this11.history = [[]];
            return _this11;
        }

        _createClass(MyArray, [{
            key: 'commit',
            value: function commit() {
                this.history.push(this.slice());
            }
        }, {
            key: 'revert',
            value: function revert() {
                if (this.history.length) {
                    this.splice.apply(this, [0, this.length].concat(_toConsumableArray(this.history[this.history.length - 1])));
                    this.history.pop();
                }
            }
        }]);

        return MyArray;
    }(Array);

    var arr = new MyArray();
    for (var i = 0; i < 10; i++) {
        arr.push(i);
        arr.commit();
    }
    arr.revert();
    arr.revert();
    arr.revert();
    arr.revert();
    arr.revert();
    //console.log(arr);
}

/**
 * mixin模式
 * */
{
    var mix = function mix() {
        var Mix = function Mix() {
            _classCallCheck(this, Mix);
        };

        for (var _len = arguments.length, mixins = Array(_len), _key = 0; _key < _len; _key++) {
            mixins[_key] = arguments[_key];
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = mixins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var mixin = _step.value;

                copyProperty(Mix.prototype, mixin);
                copyProperty(Mix.prototype, Reflect.getPrototypeOf(mixin));
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

        return Mix;
    };

    var copyProperty = function copyProperty(target, source) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = Reflect.ownKeys(source)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var key = _step2.value;

                if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
                    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                }
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
    };

    var DistributedEdit = function (_mix) {
        _inherits(DistributedEdit, _mix);

        function DistributedEdit() {
            _classCallCheck(this, DistributedEdit);

            return _possibleConstructorReturn(this, (DistributedEdit.__proto__ || Object.getPrototypeOf(DistributedEdit)).apply(this, arguments));
        }

        return DistributedEdit;
    }(mix({ 'ncaa': '不好用,意义不明,看看就行.' }));

    var distributededit = new DistributedEdit();
    console.log(distributededit, distributededit.ncaa);
}