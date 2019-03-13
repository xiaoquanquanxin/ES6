'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];
			descriptor.enumerable = descriptor.enumerable || false;
			descriptor.configurable = true;
			if ("value" in descriptor) descriptor.writable = true;
			Object.defineProperty(target, descriptor.key, descriptor);
		}
	}

	return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);
		if (staticProps) defineProperties(Constructor, staticProps);
		return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

{
	var Point = function () {
		function Point(x, y) {
			_classCallCheck(this, Point);

			this.x = x;
			this.y = y;
		}

		_createClass(Point, [{
			key: 'toString',
			value: function toString() {
				return this.x + ',' + this.y;
			}
		}]);

		return Point;
	}();
	//console.log(new Point(1, 2));
	//console.log(typeof Point);
	//console.log(Point.prototype);
	//console.log(Point === Point.prototype.constructor);

}
{
	var Bar = function () {
		function Bar() {
			_classCallCheck(this, Bar);
		}

		_createClass(Bar, [{
			key: 'doStuff',
			value: function doStuff() {
				console.log(this, '在class里定义的方法都在prototype上面.都是不可枚举的.');
			}
		}]);

		return Bar;
	}();

	Object.assign(Bar.prototype, {
		toString: function toString() {
		},
		toValue: function toValue() {
		}
	});

	var b = new Bar();
	//b.doStuff();
	//console.log(Reflect.ownKeys(b.constructor.prototype));
	//console.log(Object.keys(b.constructor.prototype))
}

//  constructor方法
{
}
//  类的实例
{
	var A = function () {
		function A() {
			_classCallCheck(this, A);
		}

		_createClass(A, [{
			key: 'setProperty',
			value: function setProperty(x) {
				this.name = x;
			}
		}]);

		return A;
	}();

	var a = new A();
	a.setProperty('123');
	//console.log(a);
}

//  取值函数（getter）和存值函数（setter）
{
	var M = function () {
		function M() {
			_classCallCheck(this, M);
		}

		_createClass(M, [{
			key: 'prop',
			get: function get() {
				return 'getter';
			},
			set: function set(val) {
				console.log('setter:' + val);
			}
		}]);

		return M;
	}();

	var m = new M();
	//m.prop = 123;
	//console.log(m.prop);
	var descriptor = Object.getOwnPropertyDescriptor(m.constructor.prototype, 'prop');
	//console.log(descriptor);
}
//  属性表达式
{
	var methodName = 'getArea';

	var Square = function () {
		function Square() {
			_classCallCheck(this, Square);
		}

		_createClass(Square, [{
			key: methodName,
			value: function value() {
				console.log(methodName);
			}
		}]);

		return Square;
	}();
	//new Square() [methodName]();

}

//  class表达式
{
	var _M = function _M() {
		_classCallCheck(this, _M);
	};

	var MyClass = _M;
	//console.log(MyClass, '\n', M);
	//console.log((new MyClass).constructor.prototype === (new M).constructor.prototype);

	var _A = function B() {
		_classCallCheck(this, B);
	};
	//console.log(A.name);
}

//  generator
{
	var _A2 = function () {
		function _A2() {
			_classCallCheck(this, _A2);
		}

		_createClass(_A2, [{
			key: '_getName',
			value: function _getName() {
				return 'james';
			}
		}, {
			key: Symbol.iterator,
			value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
				var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key;

				return regeneratorRuntime.wrap(function value$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context.prev = 3;
								_iterator = Object.getOwnPropertyNames(this.constructor.prototype)[Symbol.iterator]();

							case 5:
								if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
									_context.next = 12;
									break;
								}

								key = _step.value;
								_context.next = 9;
								return key;

							case 9:
								_iteratorNormalCompletion = true;
								_context.next = 5;
								break;

							case 12:
								_context.next = 18;
								break;

							case 14:
								_context.prev = 14;
								_context.t0 = _context['catch'](3);
								_didIteratorError = true;
								_iteratorError = _context.t0;

							case 18:
								_context.prev = 18;
								_context.prev = 19;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 21:
								_context.prev = 21;

								if (!_didIteratorError) {
									_context.next = 24;
									break;
								}

								throw _iteratorError;

							case 24:
								return _context.finish(21);

							case 25:
								return _context.finish(18);

							case 26:
							case 'end':
								return _context.stop();
						}
					}
				}, value, this, [[3, 14, 18, 26], [19, , 21, 25]]);
			})
		}]);

		return _A2;
	}();

	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = new _A2()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			//console.log(x);

			var x = _step2.value;
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

//  this的指向
{
	var _A3 = function () {
		function _A3() {
			_classCallCheck(this, _A3);
		}

		_createClass(_A3, [{
			key: 'setName',
			value: function setName(val) {
				if (this) {
					this.setProperty('name', val);
				} else {
					console.log('这个this是undefined');
				}
			}
		}, {
			key: 'setProperty',
			value: function setProperty(key, val) {
				this[key] = val;
			}
		}]);

		return _A3;
	}();

	var _a = new _A3();
	_a.setName('james');
	var setName = _a.setName;
	//setName('pierce');
}
//  this绑定,实例方法
{
	var _A4 = function () {
		function _A4() {
			_classCallCheck(this, _A4);

			this.setName = this.setName.bind(this);
		}

		_createClass(_A4, [{
			key: 'setName',
			value: function setName(val) {
				if (this) {
					this.setProperty('name', val);
				} else {
					console.log('这个this是undefined');
				}
			}
		}, {
			key: 'setProperty',
			value: function setProperty(key, val) {
				this[key] = val;
			}
		}]);

		return _A4;
	}();

	var _a2 = new _A4();
	var _setName = _a2.setName;
	//setName('james');
	//console.log(a);
}
//  this绑定,箭头函数
{
	var _A5 = function () {
		function _A5() {
			var _this = this;

			_classCallCheck(this, _A5);

			this.setName = function (val) {
				_this.setProperty('name', val);
			};
		}

		_createClass(_A5, [{
			key: 'setProperty',
			value: function setProperty(key, val) {
				this[key] = val;
			}
		}]);

		return _A5;
	}();

	var _a3 = new _A5();
	var _setName2 = _a3.setName;

	_setName2('james');
	//console.log(a);
}

/**
 * 静态方法
 * */
{
	var _A6 = function () {
		function _A6() {
			_classCallCheck(this, _A6);
		}

		_createClass(_A6, null, [{
			key: 'getName',
			value: function getName() {
				console.log();
				return this.name;
			}
		}]);

		return _A6;
	}();
	//console.log(new A().getName);
	//console.log(A.getName());

}

/**
 *实例属性新写法
 * */
{
}
//class foo {
//    bar = 'hello';
//    baz = 'world';
//}
//new foo()


/**
 * 静态属性
 * */
{
	var _A7 = function _A7() {
		_classCallCheck(this, _A7);
	};
}

/**
 * 私有方法和私有属性
 * */
//  下划线表示这时一个只限于内部使用的私有方法.但并不保险.
{
	var _A8 = function () {
		function _A8() {
			_classCallCheck(this, _A8);
		}

		_createClass(_A8, [{
			key: 'a',
			value: function a(b) {
				this._b(b);
			}
		}, {
			key: '_b',
			value: function _b(b) {
				return this.b = b;
			}
		}]);

		return _A8;
	}();
}
//  将私有方法移出模块
{
	var c = function c(val) {
		return this.b = val;
	};

	var _A9 = function () {
		function _A9() {
			_classCallCheck(this, _A9);
		}

		_createClass(_A9, [{
			key: 'a',
			value: function a(b) {
				c.call(this, b);
			}
		}]);

		return _A9;
	}();

	var _a4 = new _A9();
	_a4.a(1234);
	//console.log(a);
}
//  利用Symbol值的唯一性
{
	var _A10 = function () {
		function _A10() {
			_classCallCheck(this, _A10);
		}

		_createClass(_A10, [{
			key: Symbol('123'),
			value: function value() {
				return 1;
			}
		}]);

		return _A10;
	}();

	console.log(new _A10());
}