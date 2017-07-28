var express = require('express');
var mysql = require('mysql');
var session = require('cookie-session');// Charge le middleware de sessions
var connection = mysql.createConnection({
  host: "sql11.freemysqlhosting.net",
  user: "sql11187090",
  password: "htmXwilHAC",
  database: "sql11187090"
});
var pool = mysql.createPool({
	connectionLimit : 10,
  host: "sql11.freemysqlhosting.net",
  user: "sql11187090",
  password: "htmXwilHAC",
  database: "sql11187090"
});

var app = express();
app.use(session({secret: 'todotopsecret'}))
app.use(function(req, res, next){
    if (typeof(req.session.liketab) == 'undefined') {
        req.session.liketab = [];
    }
    next();
})

app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.get('/list', function(req, res) 
{
	//connection.connect();
	pool.getConnection(function(err, connection){
		connection.query("SELECT * FROM `sql11187090`.`BAND`", function (err, result)
		{
		    connection.query("SELECT DISTINCT genre FROM `sql11187090`.`BAND`", function(err2,genres)
		    {
		    	res.render('list.ejs', {result: result, genres: genres});
		    	if (err2) throw err2;
		    });
		    connection.release();
		    if (err) throw err;
		});
	})
	
	
});

app.get('/submit', function(req, res) {
    res.render('submit.ejs');
});

app.get('/like/:id', function(req, res) {
	//console.log('attemp to like band of id ' + req.params.id);
    if (req.session.liketab[req.params.id]!=true) {
        req.session.liketab[req.params.id]=true;
        pool.getConnection(function(err, connection){
        	connection.query("UPDATE `sql11187090`.`BAND` SET likes=likes+1 where id = ?", [req.params.id], function (err, result)
			{
				if (err) throw err;
			});
		});
    }
    res.redirect('/list');
})

app.listen(8080);
