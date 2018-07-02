"use strict";
//  小结构
let courses = { name: 'english', score: 90};
courses = { ...courses, comment: 'A'};
console.log(courses);