const config = require('./index');
const mysql = require('mysql');
const pool = mysql.createPool({
    host:config.mysql_host,
    port:config.mysql_port,
    user:config.mysql_user,
    password:config.mysql_passwd,
    database:config.mysql_db,
    connectionLimit:config.mysql_conn
});
const query = function(sql,args,callback){
    pool.getConnection((err,connection) => {
        connection.query(sql,args,(err,result)=>{
            connection.release();
            //断开数据库连接
            callback(err,result);
        })
    })
};
const p = (params) => {
    return new Promise((resolve,reject) => {
        if(!('sql' in params)){
            reject('params.sql not exist')
        }
        if(!('args' in params)){
            params.args = [];
        }
        if(params.args instanceof  String){
            params.args = [params.args];
        }
        query(params.sql,params.args,(err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
};
exports.query = p;