const fs = require('fs');
const path = require('path');
const log = {
    error:(ctx,err) => {
        let date = `${a(new Date())} [ERROR] -${ctx.method}-${ctx.url}-${err}`;
        fs.appendFile(path.resolve(__dirname,`../routerLog/error-${b(new Date())}.log`),`${date}\n`,(err) => {
            if(err) throw err;
        })
    },
    success:(ctx,start,end) => {
        let date = `${a(new Date())} [SUCCESS] -${ctx.method}-${ctx.url}-${ctx.status}-${end-start}ms`;
        fs.appendFile(path.resolve(__dirname,`../routerLog/success-${b(new Date())}.log`),`${date}\n`, (err) => {
            if(err) throw err;
        })
    }
};
//打印日志的时间格式
function a (date) {
    return `[${date.getFullYear()}-${c(date.getMonth()+1)}-${c(date.getDate())} ${c(date.getHours())}:${c(date.getMinutes())}:${c(date.getSeconds())}.${date.getMilliseconds()}]`;
}
//创建文件的时间格式
function b (date) {
    return `${date.getFullYear()}-${c(date.getMonth()+1)}-${c(date.getDate())}`
}
//单数小于9，拼接上0
function c (date) {
    return date>9?date:'0'+date
}
module.exports = log
