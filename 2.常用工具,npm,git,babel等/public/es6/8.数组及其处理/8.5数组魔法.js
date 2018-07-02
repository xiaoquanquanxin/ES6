Array.prototype.myReduce = function (f, i) {
    var x = i;
    var len = this.length;
    var j = 0;
    if (typeof i === "undefined") {
        x = this[0];
        j++;
    }
    for (; j < len; j++) {
        x = f(x, this[j]);
    }
    return x;
};


const arr = [5, 7, 2];
//const asum  = arr.myReduce();

const brr = [{id: 1}, {id: 3}, {id: 42}, {id: 12}, {id: 23}];
const sum = brr.reduce((a, x)=>a += x.id, 0);
console.log(sum);


let fIndex = brr.findIndex((t, i)=>t.id == 12);
console.log(fIndex);

