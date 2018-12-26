{
    let obj = new Proxy({count: 2}, {
        get: function (target, key, receiver) {
            //console.log(target, key, receiver);
            //return target[key]
            return Reflect.get(target, key, receiver);
        }, set: function (target, key, value, receiver) {
            console.log(target, key, value, receiver);
            console.log(this);
            return Reflect.set(target, key, value, receiver);
        }
    });
    obj.count = 1;
    //obj.count++;
    //obj.count++;
    console.log(obj.count);
}