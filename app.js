const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors');
const index = require('./routes/index')
const users = require('./routes/users')
const file = require('./routes/api/upload');
const user = require('./routes/api/user');
const router = require('koa-router')();
const newLog = require('./middlewares/router_log');
const authToken = require('./middlewares/authToken');
// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
// app.use(logger())
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// });
//验证token
app.use(async function (ctx,next) {
    let url = ctx.request.url;
    url = url.split('/');
    let path = url[url.length-1];
    if(path == 'login' || path == 'region'){
        await next();
    }else{
        await authToken.checkToken(ctx,next);
    }

})
//日志打印
app.use(newLog());
//跨域
app.use(cors({
    allowedMethods:['GET','POST','DELETE','PUT','PATCH']
}));
// routes
router.use('/files',file.routes(),file.allowedMethods());
router.use('/users',user.routes(),user.allowedMethods());

app.use(router.routes(),router.allowedMethods());
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
