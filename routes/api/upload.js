const router = require('koa-router')();
const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');
const pool = require('../../config/pool');
const response = require('../../middlewares/response_formatter');

//同步创建文件目录
function mkdirSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
};

//上传文件
function uploadFile(ctx, options) {
    let req = ctx.req;
    let res = ctx.res;
    let busboy = new Busboy({headers: req.headers});
    return new Promise((resolve, reject) => {
        console.log('文件上传中');
        let result = {};
        busboy.on('file', function (filedname, file, filename, encoding, mimetype) {
            // console.log(filedname,filename,file,mimetype,'===');
            let fileType = "";
            let type = mimetype.split('/');
            switch (type[0]) {
                case "application":
                    fileType = "files";
                    break;
                case "image":
                    fileType = "images";
                    break;
                case "text":
                    fileType = "txt";
            }
            let filePath = path.join(options.path, fileType);
            // console.log(filePath, '---');
            let mkdirResult = mkdirSync(filePath);
            let _uploadFilePath = path.join(filePath, filename);
            let saveTo = path.join(_uploadFilePath);
            // 文件保存到制定路径
            // console.log(saveTo);
            file.pipe(fs.createWriteStream(saveTo));
            // 文件写入事件结束
            file.on('end', function () {
                let i = saveTo.indexOf("images");
                let imgPath = saveTo.slice(i).replace(/\\/g, '/');
                // console.log(imgPath, '=[=')
                // result.success = true;
                // result.message = '文件上传成功';
                console.log('文件上传成功！');
                if (fileType === 'images') {
                    let sql = 'insert into img(img_url) values(?)';
                    let args = imgPath;
                    pool.query({sql:sql,args:args});
                    result.data= {img_url:imgPath};
                }
            })
        });
        // 解析结束事件
        busboy.on('finish', function () {
            console.log('文件上传结束');
            resolve(result)
        });
        // 解析错误事件
        busboy.on('error', function (err) {
            console.log('文件上传出错');
            result.err=err;
            reject(result)
        });
        req.pipe(busboy)
    })
};
router.post('/upload', async (ctx, next) => {
    let serverFilePath = path.join('./public');
    let result1 = await uploadFile(ctx,{path: serverFilePath});
    response(ctx,result1);
});
router.get('/image', async (ctx,next) => {
    let result = {};
    let sql = 'select * from img';
    result.data = await pool.query({sql:sql});
    response(ctx,result);

});
module.exports = router;
