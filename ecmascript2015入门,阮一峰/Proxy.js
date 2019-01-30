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
    function pipe(value) {
        var funcStack = [];
        var oproxy = new Proxy({}, {
            get: function (pipeObject, fnName) {
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
    }

    var double = n => n * 2;
    var pow = n => n * n;
    var reverseInt = n => n.toString().split("").reverse().join("") | 0;
    pipe(3).double.pow.reverseInt.ssss; // 63
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
    //document.body.appendChild(el);
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
    const proxy = new Proxy({}, {
        set: function (obj, prop, value, receiver) {
            obj[prop] = receiver;
        }
    });
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


/**
 * apply方法拦截函数的 调用、call和apply操作。
 * apply方法可以接受三个参数，分别是目标对象[这时是一个函数]、this、arguments。
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

/**
 * has方法用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。
 * 典型的操作就是in运算符 ， 对for in 不生效。
 * */
//  隐藏某些属性
{
    let sup = {_name: 'xxxx', name: 'xxxx'};
    Object.preventExtensions(sup);
    let proxy = new Proxy(sup, {
        has(target, key){
            return true;
            "use strict";
            return key[0] !== '_' && (key in target);
        }
    });
    console.log('name' in proxy);
    console.log('james' in proxy);
    console.log(proxy)
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
    let proxy = new Proxy(function (arg) {
        this.name = arg;
    }, {
        construct(target, arg, newTarget){
            "use strict";
            console.log(target, arg, newTarget);
            return {name: '没啥用啊'}
        }
    });
    let p = new proxy('123456');
    console.log(p)
}

/**
 * deleteProperty方法用于拦截delete操作.
 * 如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除。
 *  如果是configurable为false的属性，则不可被拦截
 * */
{
    let p = new Proxy({name: 1234}, {
        deleteProperty(target, key){
            "use strict";
            console.log(target, key);
            if (key === 'name') {
                return false;
            }
            delete target[key]
        }
    });
    delete p.name;
    console.log(p)
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
        setPrototypeOf (target, proto) {
            console.log('禁止拦截');
            return true;
            //throw new Error('禁止拦截');
        }
    };
    var proto = {};
    var proxy = new Proxy(function () {
    }, handler);
    Object.setPrototypeOf(proxy, proto);
}


/**
 * Proxy.revocable
 * Proxy.revocable的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。
 * */
{
    let target = {};
    let handler = {};
    let {proxy,revoke} = Proxy.revocable(target, handler);
    //proxy.foo = 12345;
    //console.log(proxy.foo);
    target.oof = 123;
    console.log(target, proxy);
    revoke();
    //console.log(proxy.foo);      访问报错
}


/**
 * this指向
 * Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理。
 * */
{
    let proxy = new Proxy({
        getThis(){
            "use strict";
            console.log(this, proxy)
        }
    }, {});
    proxy.getThis();
}