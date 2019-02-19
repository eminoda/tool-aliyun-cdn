const moment = require('moment');

let now = moment(new Date());
console.log(now);
let utcTime = moment.utc(now).format();
let beijingTime = now.format();
console.log(utcTime);
console.log(beijingTime);
console.log(now.utcOffset(0).format());
