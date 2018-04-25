const STATUS_CODE = require('./status');

function formatNumber(n) {
  const num = Number.parseInt(n);
  if(num < 0 || num > 59) {
    return 'error';
  }
  if(num < 10) {
    return '0' + num;
  }
  return `${num}`;
}
module.exports.getDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${formatNumber(date.getMonth() + 1)}-${formatNumber(date.getDate())}`;
}
module.exports.getTime = () => {
  const date = new Date();
  return `${formatNumber(date.getHours())}:${formatNumber(date.getMinutes())}:${formatNumber(date.getSeconds())}`;
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
