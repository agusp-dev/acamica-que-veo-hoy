var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost', 
  port     : '3306',
  user     : 'root',
  password : '********', //change this.
  database : 'peliculas'
});

module.exports = connection;
