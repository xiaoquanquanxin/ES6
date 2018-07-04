//  字符集提供了一个更加洁简的方式来表示分支的集合,用[]来表示
const str = 'abcdefg';
let match = str.match(/[a]/ig);
console.log(match);
//  字符集取反,在第一个字符插入^
match = str.match(/[^a]/ig);
console.log(match);

/***
 * 具名字符集
 * **/
/****
 * \d,[0-9]
 * \D,[^0-9]
 * \s,[\t\v\n\r],包含制表符,空格和垂直制表符
 * \S,[^\t\v\n\r]
 * \w,[a-zA-Z_]
 * \W,[^a-zA-Z_]
 * ***/
//  去掉所有非数字
const phone = "(4444) 444-12345";
const neatPhone = phone.replace(/\D/g, "");
console.log(neatPhone);
//
const field = "    fewa '";
const valid = /\S/.test(field);
console.log(valid);
/****
 * 重复
 * {n},精确到n个
 * {n,},至少n个
 * {n,m},n至m个
 * ?,{0,1}
 * *,任意个数
 * +,至少一个
 * ****/

//  所以手机号是
let phoneNumber = "1389989819";
let checkPhone = /^1[35|38|53|86|82]\d{8}$/;
console.log(checkPhone.test(phoneNumber));

/***
 * 句点元字符和转义
 * 句点是一个特殊的字符,他表示"匹配任何内容" , 用 . 表示
 *  他需要转义,使用反斜杠
 *  真正的通配符更多使用[\s\S]
 *
 * ***/


//  $1 第几个分组
//  $` 匹配项之前的全部内容
//  $& 匹配目标本身
//  $' 匹配项之后的全部内容
//  $$ $本身

