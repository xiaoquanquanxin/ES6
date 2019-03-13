'use strict';

{
    //  new Proxy(target, handler);
    //  handler也是一个对象,用来定制拦截行为
    var obj = new Proxy({ count: 2 }, {
        get: function get(target, key, receiver) {
            console.log('读取', '\n', target, key, receiver);
            return Reflect.get(target, key, receiver);
        }, set: function set(target, key, value, receiver) {
            console.log('设置', target, key, value, receiver);
            return Reflect.set(target, key, value, receiver);
        }
    });
    obj.count = '设置的值';
    console.log(obj.count);
    console.log(obj);
}
/**
 * Proxy 实例的方法
 */
/***
 * get 方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和 proxy 实例本身
 */
{
    var pipe = function pipe(value) {
        var funcStack = [];
        var oproxy = new Proxy({}, {
            get: function get(pipeObject, fnName) {
                if (fnName === 'ssss') {
                    return funcStack.reduce(function (val, fn) {
                        return fn(val);
                    }, value);
                }
                funcStack.push(window[fnName]);
                return oproxy;
            }
        });
        return oproxy;
    };

    var double = function double(n) {
        return n * 2;
    };
    var pow = function pow(n) {
        return n * n;
    };
    var reverseInt = function reverseInt(n) {
        return n.toString().split("").reverse().join("") | 0;
    };
    pipe(3).double.pow.reverseInt.ssss; // 63
}
{
    var dom = new Proxy({}, {
        get: function get(target, property) {
            return function () {
                var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                var el = document.createElement(property);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Object.keys(attrs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var prop = _step.value;

                        el.setAttribute(prop, attrs[prop]);
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

                for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    children[_key - 1] = arguments[_key];
                }

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var child = _step2.value;

                        if (typeof child === 'string') {
                            child = document.createTextNode(child);
                        }
                        el.appendChild(child);
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

                return el;
            };
        }
    });
    //@formatter:off
    var el = dom.div({}, 'Hello, my name is ', dom.a({ href: '//example.com' }, 'Mark'), '. I like:', dom.ul({}, dom.li({}, 'The web'), dom.li({}, 'Food'), dom.li({}, '…actually that\'s it')));
    //@formatter:on
    //document.body.appendChild(el);
}
{
    var _proxy = new Proxy({}, {
        get: function get(target, property, receiver) {
            if (property === 'proxySelf') {
                return receiver;
            } else {
                return target[property];
            }
        }
    });
    console.log(_proxy.james === _proxy);
    console.log(_proxy.proxySelf === _proxy);
}
//  如果一个属性不可配置（configurable）且不可写（writable），则 Proxy 不能修改该属性，否则通过 Proxy 对象访问该属性会报错
{
    var _obj = Object.defineProperty({}, 'name', {
        value: 'james',
        configurable: false,
        writable: false
    });
    var _proxy2 = new Proxy(_obj, {
        get: function get(target, key, pr) {
            console.log(target, key);
            return 'abc';
        }
    });
    try {
        console.log(_proxy2.name);
    } catch (err) {
        //console.log(err)
        //throw new Error('当属性的可配置性和可写性均为false时,不能通过代理修改该属性');
    }
}
//  get方法可以继承。拦截操作定义在（Prototype对象）上面，所以如果读取obj对象继承的属性时，拦截会生效。
//  （要以proxy实例为原型）
{
    var sup = { name: 'james' };
    var _proxy3 = new Proxy(sup, {
        get: function get(target, key, pr) {
            console.log('拦截了继承的原型属性');
            return target[key];
        }
    });
    var _obj2 = Object.create(_proxy3, { exp: { value: 'exp' } });
    console.log(_obj2.exp);
    console.log(_obj2.name);
}

/**
 * set  方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，
 * */
{
    var _proxy4 = new Proxy({}, {
        set: function set(obj, prop, value, receiver) {
            obj[prop] = receiver;
        }
    });
    var myObj = {};
    Object.setPrototypeOf(myObj, _proxy4);
    myObj.foo = 'bar';
    console.log(myObj.foo === myObj);
}
/**
 * defineProperty定义的对象的属性，当对象作为原型时，这个属性是可以继承的
 * */
{
    var _sup = Object.defineProperty({}, 'name', {
        get: function get() {
            console.log('读取原型的name');
            return this._name;
        },
        set: function set(val) {
            "use strict";

            console.log('设置原型的name');
            this._name = val;
        }
    });
    var _obj3 = Object.create(_sup);
    console.log(_obj3.name = 1);
    console.log(_obj3);
}
//  注意，严格模式下，set代理如果没有返回true，就会报错。


/**
 * apply方法拦截函数的 调用、call和apply操作。
 * apply方法可以接受三个参数，分别是目标对象[这时是一个函数]、this、arguments。
 * */
{
    var sum = function sum() {
        var left = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var right = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        return left + right + (this.name || 0);
    };

    var proxy = new Proxy(sum, {
        apply: function apply(target, _this, args) {
            console.log(target, _this, args);
            return Reflect.apply.apply(Reflect, arguments) * 2;
        }
    });
    var s1 = proxy(1, 2);
    var s2 = proxy.apply({ name: 1234 }, []);
    console.log(s1, s2);
}

/**
 * has方法用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。
 * 典型的操作就是in运算符 ， 对for in 不生效。
 * */
//  隐藏某些属性
{
    var _sup2 = { _name: 'xxxx', name: 'xxxx' };
    Object.preventExtensions(_sup2);
    var _proxy5 = new Proxy(_sup2, {
        has: function has(target, key) {
            return true;
            "use strict";
            return key[0] !== '_' && key in target;
        }
    });
    console.log('name' in _proxy5);
    console.log('james' in _proxy5);
    console.log(_proxy5);
}
//  如果原（对象）不可配置或者禁止扩展，这时has拦截返回false时会报错。因为在不可配置下的对象无法隐藏属性。

/**
 *construct方法用于拦截  new 命令，下面是拦截对象的写法。
 * @target 构造函数
 * @arguments 构造函数的参数
 * @newTarget 构造函数代理
 * 返回的必须是一个对象
 * */
{
    var _proxy6 = new Proxy(function (arg) {
        this.name = arg;
    }, {
        construct: function construct(target, arg, newTarget) {
            "use strict";

            console.log(target, arg, newTarget);
            return { name: '没啥用啊' };
        }
    });
    var p = new _proxy6('123456');
    console.log(p);
}

/**
 * deleteProperty方法用于拦截delete操作.
 * 如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除。
 *  如果是configurable为false的属性，则不可被拦截
 * */
{
    var _p = new Proxy({ name: 1234 }, {
        deleteProperty: function deleteProperty(target, key) {
            "use strict";

            console.log(target, key);
            if (key === 'name') {
                return false;
            }
            delete target[key];
        }
    });
    delete _p.name;
    console.log(_p);
}

/**
 * defineProperty
 * getOwnPropertyDescriptor
 * isExtensible 拦截  Object.isExtensible
 * */

/**
 * * getPrototypeOf   拦截  继承相关事宜
 * Object.prototype.__proto__
 * Object.prototype.isPrototypeOf()
 * Object.getPrototypeOf()
 * Reflect.getPrototypeOf()
 * instanceof
 * */

/**
 *ownKeys 拦截    循环相关
 *
 * Object.getOwnPropertyNames()
 * Object.getOwnPropertySymbols()
 * Object.keys()
 * for...in
 * */

/**
 * preventExtensions    拦截  Object.preventExtensions()
 * 这个方法只有 Object.isExtensible 返回true ，即被封印的对象才能被调用
 * 但正常的对象的 Object.isExtensible 返回false
 * 所以要在preventExtensions里调用一次 Object.preventExtensions
 * */

/**
 * setPrototypeOf   拦截  setPrototypeOf
 *  返回布尔值
 * */
{
    var handler = {
        setPrototypeOf: function setPrototypeOf(target, proto) {
            console.log('禁止拦截');
            return true;
            //throw new Error('禁止拦截');
        }
    };
    var proto = {};
    var proxy = new Proxy(function () {}, handler);
    Object.setPrototypeOf(proxy, proto);
}

/**
 * Proxy.revocable
 * Proxy.revocable的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。
 * */
{
    var target = {};
    var _handler = {};

    var _Proxy$revocable = Proxy.revocable(target, _handler),
        _proxy7 = _Proxy$revocable.proxy,
        revoke = _Proxy$revocable.revoke;
    //proxy.foo = 12345;
    //console.log(proxy.foo);


    target.oof = 123;
    console.log(target, _proxy7);
    revoke();
    //console.log(proxy.foo);      访问报错
}

/**
 * this指向
 * Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理。
 * */
{
    var _proxy8 = new Proxy({
        getThis: function getThis() {
            "use strict";

            console.log(this, _proxy8);
        }
    }, {});
    _proxy8.getThis();
}