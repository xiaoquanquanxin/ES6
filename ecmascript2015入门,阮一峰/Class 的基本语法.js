{
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        toString() {
            return `${this.x},${this.y}`;
        }
    }
    //console.log(new Point(1, 2));
    //console.log(typeof Point);
    //console.log(Point.prototype);
    //console.log(Point === Point.prototype.constructor);
}
{
    class Bar {
        doStuff() {
            console.log(this, '在class里定义的方法都在prototype上面.都是不可枚举的.');
        }
    }

    Object.assign(Bar.prototype, {
        toString(){
        },
        toValue(){
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
    class A {
        setProperty(x) {
            this.name = x;
        }
    }
    let a = new A;
    a.setProperty('123');
    //console.log(a);
}

//  取值函数（getter）和存值函数（setter）
{
    class M {
        constructor() {

        }

        get prop() {
            return 'getter';
        }

        set prop(val) {
            console.log(`setter:${val}`);
        }
    }
    let m = new M;
    //m.prop = 123;
    //console.log(m.prop);
    let descriptor = Object.getOwnPropertyDescriptor(m.constructor.prototype, 'prop');
    //console.log(descriptor);
}
//  属性表达式
{
    let methodName = 'getArea';
    class Square {
        [methodName]() {
            console.log(methodName);
        }
    }
    //new Square() [methodName]();
}

//  class表达式
{
    class M {
    }
    const MyClass = M;
    //console.log(MyClass, '\n', M);
    //console.log((new MyClass).constructor.prototype === (new M).constructor.prototype);

    let A = class B {
    };
    //console.log(A.name);
}

//  generator
{
    class A {
        _getName() {
            return 'james';
        }

        *[Symbol.iterator]() {
            for (let key of Object.getOwnPropertyNames(this.constructor.prototype)) {
                yield key;
            }
        }
    }
    for (let x of new A()) {
        //console.log(x);
    }
}

//  this的指向
{
    class A {
        setName(val) {
            if (this) {
                this.setProperty('name', val);
            } else {
                console.log('这个this是undefined');
            }
        }

        setProperty(key, val) {
            this[key] = val;
        }
    }
    let a = new A();
    a.setName('james');
    let {setName } = a;
    //setName('pierce');

}
//  this绑定,实例方法
{
    class A {
        constructor() {
            this.setName = this.setName.bind(this);
        }

        setName(val) {
            if (this) {
                this.setProperty('name', val);
            } else {
                console.log('这个this是undefined');
            }
        }

        setProperty(key, val) {
            this[key] = val;
        }
    }
    let a = new A;
    let {setName } =a;
    //setName('james');
    //console.log(a);
}
//  this绑定,箭头函数
{
    class A {
        constructor() {
            this.setName = (val)=> {
                this.setProperty('name', val);
            }
        }

        setProperty(key, val) {
            this[key] = val;
        }
    }
    let a = new A;
    let {setName} = a;
    setName('james');
    //console.log(a);
}

/**
 * 静态方法
 * */
{
    class A {
        static getName() {
            console.log()
            return this.name;
        }
    }
    //console.log(new A().getName);
    //console.log(A.getName());
}

/**
 *实例属性新写法
 * */
{
    //class foo {
    //    bar = 'hello';
    //    baz = 'world';
    //}
    //new foo()
}

/**
 * 静态属性
 * */
{
    class A {
        //static b=1;
    }
}

/**
 * 私有方法和私有属性
 * */
//  下划线表示这时一个只限于内部使用的私有方法.但并不保险.
{
    class A {
        a(b) {
            this._b(b);
        }

        _b(b) {
            return this.b = b;
        }
    }

}
//  将私有方法移出模块
{
    class A {
        a(b) {
            c.call(this, b);
        }
    }
    function c(val) {
        return this.b = val;
    }

    let a = new A();
    a.a(1234);
    //console.log(a);
}
//  利用Symbol值的唯一性
{
    class A {
        [Symbol('123')]() {
            return 1;
        }
    }
    console.log(new A());
}