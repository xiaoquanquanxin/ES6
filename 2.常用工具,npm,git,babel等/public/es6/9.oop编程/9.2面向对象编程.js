//  对象是一个集合，包含数值和功能，数值和功能逻辑相关
class Car {
    constructor(make, model) {
        this.make = make;
        this.model = model;
        this.userGears = ["p", "n", "r", "d"];
        this.userGear = this.userGears[0];
    }

    shift(gear) {
        if (this.userGears.indexOf(gear) < 0) {
            throw new Error(`${gear}`);
        }
        this.userGear = gear;
    }
}

const car1 = new Car("Tesla", "Model S");
const car2 = new Car("Mazda", "3i");

console.log(car1 instanceof Car);
console.log(car1 instanceof Object);
console.log(car1 instanceof Array);
