const STATUS_CODE = require('./status');
const moment = require('moment')

module.exports.getDate = () => {
  const date = moment(new Date()).format('YYYY-MM-DD');
  return date;
}

module.exports.getTime = () => {
  const time = moment(new Date()).format('HH:mm:ss');
  return time;
}

module.exports.formatDate = formatDate = (date) => {
  time = moment(date).format('HH:mm:ss');
  date = moment(date).format('YYYY-MM-DD');  
  return { date, time };
}

module.exports.formatInfo = (info) => {
  info[0].regTime = `${formatDate(info[0].regTime).date} ${formatDate(info[0].regTime).time}`;
  return info;
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
  if(err.sqlMessage) {
    console.log(buildResData('数据库操作出错', err.sqlMessage));
    return res.send(buildResData('数据库操作出错', { code: 0 }));
  }
  console.log(buildResData('代码出错', { msg: err.message, msg: err.stack }));
  return res.send(buildResData('代码出错', { msg: err.message, msg: err.stack }));
  
};