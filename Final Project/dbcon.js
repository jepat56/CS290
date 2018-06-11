var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_patneauj',
  password        : '7887',
  database        : 'cs290_patneauj'
  dateStrings     : true
});

module.exports.pool = pool;
