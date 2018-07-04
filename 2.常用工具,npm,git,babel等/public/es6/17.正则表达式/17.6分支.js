//  就是 | 这个符号, 相当于或
const html = "<html><head><meta><link><script></script></head><body><a></a><area></body></html>";
const reg = /area|a|link|script|source/ig;
console.log(reg.exec(html));
console.log(html.match(reg));