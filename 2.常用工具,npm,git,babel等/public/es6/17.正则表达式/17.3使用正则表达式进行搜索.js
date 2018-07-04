//  正则表达式的本质是匹配一个字符串的子字符串,或者替换该子字符串.

//  String.prototype也有字符串匹配的方法
let s = 'afdghefgh 发文 fa a fwe  fA renwergt';
let reg = /\w/g;
console.log(s.match(reg));
console.log(s.search(reg));
console.log(s.replace(reg, 'james'));

//  正则方法
console.log(reg.test(s));
console.log(reg.exec(s));