const jwt = require('jsonwebtoken');
let secret = require('../config/config.json').secret;
exports.checkToken = async function(ctx,next) {
    let token = ctx.request.body.token || ctx.request.query.token || ctx.request.header.token;
    try{
        if(token){
            //验证token
            let authToken = jwt.verify(token,secret);
            if(authToken.expiresIn <= new Date().getTime()){
                //验证token是否过期
                ctx.status = 403;
                ctx.body = {
                    success:false,
                    message:'101'//token过期
                }
            }else{
                await next();
            }
        }else{
            ctx.status = 401;
            ctx.body = {
                success:false,
                message:'103'//，没有提供token
            }
        }
    }catch(err){
        if(err){
            ctx.status = 403;
            ctx.body ={
                success:false,
                message:err
            }
        }
    }
};