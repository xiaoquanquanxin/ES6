{
    //  new Proxy(target, handler);
    //  handler也是一个对象,用来定制拦截行为
    let obj = new Proxy({count: 2}, {
        get: function (target, key, receiver) {
            console.log('读取', '\n', target, key, receiver);
            return Reflect.get(target, key, receiver);
        }, set: function (target, key, value, receiver) {
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
    var pipe = (function () {
        return function (value) {
            var funcStack = [];
            var oproxy = new Proxy({}, {
                get: function (pipeObject, fnName) {
                    if (fnName === 'get') {
                        return funcStack.reduce(function (val, fn) {
                            return fn(val);
                        }, value);
                    }
                    funcStack.push(window[fnName]);
                    return oproxy;
                }
            });
            return oproxy;
        }
    }());
    var double = n => n * 2;
    var pow = n => n * n;
    var reverseInt = n => n.toString().split("").reverse().join("") | 0;
    pipe(3).double.pow.reverseInt.get; // 63
}
{
    const dom = new Proxy({}, {
        get(target, property) {
            return function (attrs = {}, ...children) {
                const el = document.createElement(property);
                for (let prop of Object.keys(attrs)) {
                    el.setAttribute(prop, attrs[prop]);
                }
                for (let child of children) {
                    if (typeof child === 'string') {
                        child = document.createTextNode(child);
                    }
                    el.appendChild(child);
                }
                return el;
            }
        }
    });
    //@formatter:off
    const el = dom.div({},
        'Hello, my name is ',
        dom.a({href: '//example.com'}, 'Mark'),
        '. I like:',
        dom.ul({},
            dom.li({}, 'The web'),
            dom.li({}, 'Food'),
            dom.li({}, '…actually that\'s it')
        ));
    //@formatter:on
    document.body.appendChild(el);
}
{
    const proxy = new Proxy({}, {
        get: function (target, property, receiver) {
            if (property === 'proxySelf') {
                return receiver;
            } else {
                return target[property];
            }
        }
    });
    console.log(proxy.james === proxy);
    console.log(proxy.proxySelf === proxy);
}
{
    const proxy = new Proxy({}, {
        get: function (target, property, receiver) {
            return receiver;
        }
    });

    const d = Object.create(proxy);
    d.a === d // true
}
//  如果一个属性不可配置（configurable）且不可写（writable），则 Proxy 不能修改该属性，否则通过 Proxy 对象访问该属性会报错
{
    let obj = Object.defineProperty({}, 'name', {
        value: 'james',
        configurable: false,
        writable: false,
    });
    let proxy = new Proxy(obj, {
        get: function (target, key, pr) {
            console.log(target, key);
            return 'abc';
        }
    });
    try {
        console.log(proxy.name);
    } catch (err) {
        //console.log(err)
        //throw new Error('当属性的可配置性和可写性均为false时,不能通过代理修改该属性');
    }
}
//  get方法可以继承。拦截操作定义在（Prototype对象）上面，所以如果读取obj对象继承的属性时，拦截会生效。
//  （要以proxy实例为原型）
{
    let sup = {name: 'james'};
    let proxy = new Proxy(sup, {
        get: function (target, key, pr) {
            console.log('拦截了继承的原型属性');
            return target[key];
        }
    });
    let obj = Object.create(proxy, {exp: {value: 'exp'}});
    console.log(obj.exp);
    console.log(obj.name);
}

/**
 * set  方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，
 * */
{
    const handler = {
        set: function (obj, prop, value, receiver) {
            obj[prop] = receiver;
        }
    };
    const proxy = new Proxy({}, handler);
    const myObj = {};
    Object.setPrototypeOf(myObj, proxy);

    myObj.foo = 'bar';
    console.log(myObj.foo === myObj);
}
/**
 * defineProperty定义的对象的属性，当对象作为原型时，这个属性是可以继承的
 * */
{
    let sup = Object.defineProperty({}, 'name', {
        get: function () {
            console.log('读取原型的name');
            return this._name;
        },
        set: function (val) {
            "use strict";
            console.log('设置原型的name');
            this._name = val;
        }
    });
    let obj = Object.create(sup);
    console.log(obj.name = 1);
    console.log(obj);
}
//  注意，严格模式下，set代理如果没有返回true，就会报错。


console.clear()
/**
 * apply方法拦截函数的 调用、call和apply操作。
 * apply方法可以接受三个参数，分别是目标对象、this、arguments。
 * */
{
    function sum(left = 0, right = 0) {
        return left + right + (this.name || 0);
    }

    var proxy = new Proxy(sum, {
        apply (target, _this, args) {
            console.log(target, _this, args);
            return Reflect.apply(...arguments) * 2;
        }
    });
    let s1 = proxy(1, 2);
    let s2 = proxy.apply({name: 1234}, []);
    console.log(s1, s2);
}




















