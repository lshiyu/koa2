const dev = require('./dev');
const test = require('./test');
module.exports={
    dev:dev,
    test:test,
}[process.env.NODE_ENV || 'dev']