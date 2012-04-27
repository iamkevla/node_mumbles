
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , url = require('url');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'LKJHLGFHGJGKJLKHKHK'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Authentication
function loggedIn(req, res, next) {

  	req.session.username!=null
  		? next()
  		: res.redirect('/node_mumbles/loginUser.html');
}

// Routes
app.get('/', loggedIn, routes.index );


app.get('/node_mumbles/', loggedIn, function(req, res, next){
    next();
});


app.post('/authenticate', function(req, res){

  var options = {
    host: "localhost",
    port: 8500,
    path: '/mumbles/api/index.cfm/users?username='+req.param("username")+'&password='+req.param("password"),
    method: 'POST'
  };

  http.request(options, function(resp) {

    if (resp.statusCode == 200 ) { 
      req.session.username = req.param("username");
      res.redirect('back');
    } else {
      res.writeHead(404);
      res.write('404');
      res.end();
    }

  }).end();

});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
