const jwt = require('jsonwebtoken');
const moment = require('moment');
const router = require('koa-router')();
const pool = require('../../config/pool');
let secret = require('../../config/config.json').secret;
const response = require('../../middlewares/response_formatter');
//注册
router.post('/region',async (ctx,next) => {
    let params = ctx.request.body;
    let resultData = {};
    if(!params.name || !params.pwd){
        resultData.err='The username and password are necessary'
    }
    if(params.name && params.pwd){
        let regionSql = 'select * from user where user_name=?';
        let regionArgs = [params.name];
        let regionResult = await pool.query({sql:regionSql,args:regionArgs});
        if(regionResult.length == 0){
            let sql = 'insert into user(user_name,user_passwd,create_time) values(?,?,?)';
            let args = [params.name,params.pwd,new Date()];
            let result = await pool.query({sql:sql,args:args});
            if(result){
                resultData.data = {
                    username:params.name,
                    userpwd:params.pwd,
                    message:'注册成功'
                }
            }else{
                resultData.err = '注册失败'
            }
        }else{
            resultData.err = '账号已存在！'
        }
    }
    response(ctx,resultData);
});
//登录
router.post('/login',async (ctx,next) => {
    let params = ctx.request.body;
    let resultData = {};
    console.log(params)
    if(!params.name || !params.pwd){
        resultData.err='The username and password are necessary'
    }
    if(params.name && params.pwd){
        let time = moment().add(30,'m').valueOf();//当前时间往后推迟30分钟的时间戳
        let token = jwt.sign({name:params.name,pwd:params.pwd,expiresIn:time},secret,{expiresIn:time});
        let sql = 'select * from user where user_name=? and user_passwd=?';
        let args = [params.name,params.pwd];
        let result = await pool.query({sql:sql,args:args});
        // resultData.data.token = token;
        if(result.length<1){
            resultData.err = '用户名或密码错误';
        }else{
            resultData.data = {
                usrname:result[0].user_name,
                userpwd:result[0].user_passwd,
                uid:result[0].id,
                time:result[0].create_time,
                token:token
            }
        }
    }
    response(ctx,resultData);
});
module.exports = router;