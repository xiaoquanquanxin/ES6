(()=> {
    class Math {
        add(a, b) {
            return a + b;
        }
    }

    function log(target, name, descriptor) {
        var oldValue = descriptor.value;

        descriptor.value = function () {
            console.log(`Calling ${name} with`, arguments);
            return oldValue.apply(this, arguments);
        };

        return descriptor;
    }

    const math = new Math();

// passed parameters should get logged now
    math.add(2, 4);
})();


(()=> {
    "use strict";
    const Foo = {
        foo() {
            console.log('foo')
        }
    };

    class MyClass {
    }

    Object.assign(MyClass.prototype, Foo);

    let obj = new MyClass();
    obj.foo(); // 'foo'
    console.log(MyClass)
})();

(()=> {
    "use strict";
    function log(target) {
        console.log(target)
    }

    class A {

    }
    let a = new A;

})();