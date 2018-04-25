const STATUS_CODE = require('./status');
const moment = require('moment')

module.exports.formatDate = (date) => {
  date = moment(date).format('YYYY-MM-DD');
  time = moment(date).format('HH:mm:ss');
  return {date, time}
}
module.exports.getDate = () => {
  const date = moment(new Date()).format('YYYY-MM-DD');
  return date;
}
module.exports.getTime = () => {
  const time = moment(new Date()).format('HH:mm:ss');
  return time;
}
module.exports.buildResData = buildResData = function (msg, data) {
    let res = {};
    res.status = STATUS_CODE.API_ERROR;
    res.msg = msg;
    res.data = data;    
    console.log('发送数据:', JSON.stringify(res));
    return res;
}
module.exports.sqlErr = function(err, res) {
  console.log(buildResData('数据库操作出错', { msg: err.sqlMessage }));
  return res.send(buildResData('数据库操作出错', { code: 0 }));
};
