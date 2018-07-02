"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//  对象是一个集合，包含数值和功能，数值和功能逻辑相关
var Car = function () {
    function Car(make, model) {
        _classCallCheck(this, Car);

        this.make = make;
        this.model = model;
        this.userGears = ["p", "n", "r", "d"];
        this.userGear = this.userGears[0];
    }

    _createClass(Car, [{
        key: "shift",
        value: function shift(gear) {
            if (this.userGears.indexOf(gear) < 0) {
                throw new Error("" + gear);
            }
            this.userGear = gear;
        }
    }]);

    return Car;
}();

var car1 = new Car("Tesla", "Model S");
var car2 = new Car("Mazda", "3i");

console.log(car1 instanceof Car);
console.log(car1 instanceof Object);
console.log(car1 instanceof Array);