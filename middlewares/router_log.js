const log = require('./log');
const logger = function () {
    return async function(ctx,next){
        let start_time = new Date();
        try{
            await next();
        }catch (err){
            log.error(ctx,err);
            throw err;
        }
        let end_time = new Date();
        log.success(ctx,start_time,end_time);
    }
};
module.exports = logger;