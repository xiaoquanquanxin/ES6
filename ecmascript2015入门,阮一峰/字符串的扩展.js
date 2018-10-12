//  识别大于\uffff的字
{
    let s = '𠮷a';
    s.codePointAt(0).toString(16);// "20bb7"
    s.codePointAt(2).toString(16); // "61"
}

//  转换为大于\uffff的字
{
    String.fromCodePoint(0x20BB7);  //吉
}
//  字符串for of遍历可以识别大于\uffff的字
{
    for (let x of String.fromCodePoint(0x22222)) {
        console.log(x)
    }
}
//  unicode正规化
{
    console.log('\u01D1'.normalize() === '\u004F\u030C'.normalize());
}