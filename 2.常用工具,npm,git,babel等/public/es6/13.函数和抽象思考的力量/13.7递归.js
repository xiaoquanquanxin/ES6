//  自己调用自己并且每一次的结果使得下一次的过程减少
let num = 6;
const getF = (n)=> {
    if (n === 1) {
        return 1;
    }
    return n-- * getF(n);
};
console.log(getF(num));
