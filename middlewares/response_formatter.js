//对返回的数据进行格式化处理
const response = function(ctx,msg) {
    if(msg.data){
        ctx.body = {
            success:true,
            data:msg.data
        }
    } else {
        ctx.body = {
            success: false,
            message:msg.err
        }
    }
};
module.exports = response;