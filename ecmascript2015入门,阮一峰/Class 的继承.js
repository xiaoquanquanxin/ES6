{
    class A {

    }
    class B extends A {

    }
    //console.log(new B(1));
}

//  子类的constructor中必须通过super方法去调用父类的构造函数,否则子类无法得到this对象
//  子类调用super后,才会创建this对象,所以必须先super
{
    class A {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        toString() {
            return '这是A';
        }
    }
    class B extends A {
        constructor(x, y, color) {
            super(x, y);
            this.color = color;
        }

        toString() {
            return this.color + ',' + super.toString();
        }
    }
    let b = new B(2, 3, 'red');
    //console.log(b, b.toString(), b instanceof A, b instanceof B);
}

//  父类的静态方法也会被子类继承
{
    class A {
        static a() {
            return 1;
        }
    }
    class B extends A {

    }
    //console.log(B.a());
}

/**
 * Object.getPrototypeOf()
 * */
{
    class A {
    }
    class B extends A {
    }
    //console.log(Object.getPrototypeOf(new A), Object.getPrototypeOf(new B));
}

/**
 *super关键字
 * */
//  super作为函数
{
    class A {
        constructor() {
            //  this指向子类实例
            console.log(this, new.target.name)
        }
    }
    class B extends A {
        constructor() {
            super()
        }
    }

    //console.log(new B);
}
//  super作为对象
{
    class A {
    }
    class B extends A {
        static way() {
            console.log('指向父类');
            return super.constructor;
        }

        way() {
            console.log('指向父类原型');
            return super.constructor;
        }
    }
    //console.log(B.way());
    //console.log(new B().way());
}
//  无法通过super调用父类实例的属性或方法.
{
    class A {
        constructor() {
            this.p = 'p';
        }

        get q() {
            return 'q';
        }

        static get t() {
            return 't';
        }

    }

    class B extends A {
        get m() {
            return super.p;
        }

        get n() {
            return super.q;
        }

        static get s() {
            return super.t;
        }
    }

    let b = new B();
    //console.log(`m:${b.m},n:${b.n},s:${B.s}`);
}
//  通过super调用父类方法时,父类的this指向子类实例
{
    class A {
        constructor() {
            this.a = 'a';
        }

        getA() {
            return this.a;
        }
    }
    class B extends A {
        constructor() {
            super();
            this.a = 'b';
        }

        getB() {
            return super.getA();
        }
    }
    //console.log(new B);
    //console.log(new A().getA(), new B().getB());
}

/**
 * 类的.__proto__
 * */
{
    class A {
    }
    class B extends A {
    }
    //console.log(B.__proto__, A);
    //console.log(B.prototype, B.prototype.__proto__, A.prototype);
}
//  相当于
{
    class A {
    }
    class B {
    }
    Object.setPrototypeOf(B, A);
    Object.setPrototypeOf(B.prototype, A.prototype);
    //console.log(B.__proto__, A);
    //console.log(B.prototype, B.prototype.__proto__, A.prototype);
}


















































