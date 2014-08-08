var express = require("express");
var logfmt = require("logfmt");
var app = express();
var port = Number(process.env.PORT || 5000);
var server = app.listen(port);
var io = require('socket.io').listen(server);

app.use(logfmt.requestLogger());
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));
app.enable('trust proxy');

app.get('/', function(req, res) {
  res.render("index");
});

app.get('/o.gif', function(req, res) {
  io.sockets.emit('newstats', { ip: req.ip, stat: req.url });
  res.send(' ');
});

console.log("Listening on " + port);
