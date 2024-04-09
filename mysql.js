const mysql =require("mysql");

var pool =mysql.createPool({
    "user":"LAB3-22",
    "password":"",
    "database":"papelaria",
    "host":"localhost",
    "port":3306

});

exports.pool=pool;