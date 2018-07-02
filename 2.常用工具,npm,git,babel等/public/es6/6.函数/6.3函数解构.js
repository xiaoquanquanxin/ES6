function a([aa,bb,cc]) {
    console.log(`${aa}`, `${bb}`, `${cc}`);
}
a([1, 2]);

function b({aa,bb,cc}) {
    console.log(`${aa}`, `${bb}`, `${cc}`);
}
b({aa: 1, bb: 2, cc: 3});

function c(aa, ...bb) {
    const prefiexdWords = [aa];
    for (let val of bb) {
        prefiexdWords.push(val);
    }
    return prefiexdWords;
}
const cP = c(1,2,3,4,5);
console.log(cP);
