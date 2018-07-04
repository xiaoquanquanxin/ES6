//  分组允许构造子表达式,他可以被当做一个独立单元来使用 ,用()表示

let input = "<i>1234</i><i>1234</i><i>1234</i>";
console.log(input.replace(/<i>(.*)<\/i>/ig, "<strong>$1</strong>"));
console.log(input.replace(/<i>(.*?)<\/i>/ig, "<strong>$1</strong>"));
//  所有的重复元字符  * + ? {} 都可以在其后跟随一个 ? 将他变成懒惰的