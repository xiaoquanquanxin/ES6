'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//  作为属性名的Symbol
{
    //  Symbol 值作为对象属性名时，不能用点运算符。
    var s = Symbol('mySymbol');
    var obj = _defineProperty({}, s, 'xxx');
    console.log(obj[s]);
}

//  遍历
{
    var _obj2 = { name: 1 };
    _obj2[Symbol()] = 123;
    var ops = Object.getOwnPropertySymbols(_obj2);
    console.log(ops);

    //  Reflect.ownKeys 返回对象的各种类型属性集合
    var oks = Reflect.ownKeys(_obj2);
    console.log(oks);
}

//  重新使用同一个 Symbol 值
{
    var a = Symbol('xx');
    var b = Symbol.for('xx');
    var c = Symbol.for('xx');
    console.log(a === b, b === c);
    //  Symbol没有登记机制,每次一定是新值
    //  Symbol.for会被登记在全局环境中,如果有已存在则返回已存在的值
}

//  Symbol.keyFor方法返回一个[已登记]的 Symbol 类型值的key。
{
    var _a = Symbol.keyFor(Symbol('xxx'));
    var _b = Symbol.keyFor(Symbol.for('xxx'));
    console.log(_a, _b);
}

/**
 * 内置的Symbol属性
 * */
//  Symbol.hasInstance 指向一个内部方法.当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法。
{
    var MyClass = function () {
        function MyClass() {
            _classCallCheck(this, MyClass);
        }

        _createClass(MyClass, [{
            key: Symbol.hasInstance,
            value: function value(foo) {
                return foo instanceof Array;
            }
        }]);

        return MyClass;
    }();

    [] instanceof new MyClass();
}

//  Symbol.isConcatSpreadable 值是一个布尔值 ,表示该对象调用Array.prototype.concat的时候[是否展开]
{
    var _a2 = [1, 2, 3];
    var _b2 = [].concat(_a2);
    console.log(_b2);
    _a2[Symbol.isConcatSpreadable] = false;
    _b2 = [].concat(_a2);
    console.log(_b2);

    //  类似数组的对象相反
    var _c = { length: 1, 0: 4 };
    var d = [].concat(_c);
    console.log(d);
    _c[Symbol.isConcatSpreadable] = true;
    d = [].concat(_c);
    console.log(d);
}

//  Symbol.species 指向一个构造函数,创建衍生对象时调用
//  实例对象在运行过程中，需要再次调用自身的构造函数时，会调用该属性指定的构造函数
{
    var MyArray = function (_Array) {
        _inherits(MyArray, _Array);

        function MyArray() {
            _classCallCheck(this, MyArray);

            return _possibleConstructorReturn(this, (MyArray.__proto__ || Object.getPrototypeOf(MyArray)).apply(this, arguments));
        }

        _createClass(MyArray, null, [{
            key: Symbol.species,
            get: function get() {
                return Number;
            }
        }]);

        return MyArray;
    }(Array);

    var _a3 = new MyArray();
    var _b3 = _a3.map(function () {});
    console.log(_b3 instanceof MyArray, _b3 instanceof Array, _b3 instanceof Number, _a3, _b3);
}
/**
 * 其他类似,调用对象的某个方法时会调用[Symbol.xx]的方法
*/