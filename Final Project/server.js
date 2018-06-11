var express = require('express');
var	bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 45656);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'));

var pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME
});


app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ 
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
     	if (err){
		 console.log(err);
		}
     	res.render('form');
    })
  });
});

app.get('/',function(req,res){
  
  res.render('form');

});

app.post('/', function(req,res){

	res.render('form');

});

app.get('/table', function(req,res){

	var context = {};
	if(! req.query.id)
	{
		pool.query('SELECT * FROM workouts' , function(err,row,fields){
			if (err) 
			{ 
				console.log(err);	
				return ;  		
			}

			context.results = row;
			res.render('form',context);

		});
	}
	else{

		pool.query('SELECT * FROM workouts WHERE id = ' + req.query.id, function(err, row, fields){

			if (err) 
			{
				console.log(err);
				return;
			}

			context.results = row;
			res.render('form',context);
		});
	}
});

app.post('/table',function(req,res){

	var context = {};
	var body = req.body;
	var name = body.name;
	var reps = body.reps;
	var weight = body.weight;
	var date = body.date;
	var lbs = body.lbs; 
	var rowVals = "'" + name + "'," + reps + "," + weight + ",'" + date + "'," + lbs;


	pool.query('INSERT INTO workouts (name,reps,weight,date,lbs) VALUES ('+ rowVals +');', function(err,row,fields){
		if(err)
		{
			console.log(err);
			return;
		}

	pool.query('SELECT * FROM workouts', function(err, row, fields){
	    if(err)
	    {
	      console.log(err);
	      return;
	    }
    
    context.results = row;
    res.render('form',context);


	});
	});
});

app.get('/update-table',function(req,res,next){
 var context = {};
 pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var current = result[0];
      pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
        [req.query.name || current.name, req.query.reps || current.reps, req.query.weight || current.weight, req.query.date || current.date, req.query.lbs || current.lbs, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
    pool.query('SELECT * FROM workouts', function(err, row, fields){
    if(err){
      next(err);
      return;
    }
    	context.results = row;
        res.render('form',context);
      });
     });
    }
  });
});

app.get('/delete', function(req,res){

	var context = {};
	pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
	    if(err){
	      next(err);
	      return;
	    }
		if(result.length == 1){
      		var current = result[0];
      		pool.query('DELETE FROM workouts WHERE id =' + [req.query.id], function(err,row,fields){
        	if(err){
          		console.log(err);
          		return;
        	}
    	pool.query('SELECT * FROM workouts', function(err, row, fields){
    	if(err){
      		next(err);
      		return;
    	}
    	context.results = row;
        res.render('form',context);
      	  
      	  });
     	 });
    	}
	});
});


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.log(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
