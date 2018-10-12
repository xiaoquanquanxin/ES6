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

//  参数表示开始搜索的位置
{
    let s = 'hello';
    s.includes('h');
    s.endsWith('e', 2);
    s.startsWith('h');
}
//  重复,参数取整,不可<-1,字符串参数先转为数字
{
    let s = 'ncaa';
    s.repeat(2);
    s.repeat('0.2');
}
//  如果某个字符串不够指定长度，会在头部或尾部补全。
{
    let x = 'x';
    x.padStart(5, 'ab'); // 'ababx'
    x.padStart(4, 'ab'); // 'abax'

    x.padEnd(5, 'ab'); // 'xabab'
    x.padEnd(4, 'ab'); // 'xaba'
}