var express = require("express");
var logfmt = require("logfmt");
var app = express();
var port = Number(process.env.PORT || 5000);

app.use(logfmt.requestLogger());

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render("page");
});

var io = require('socket.io').listen(app.listen(port));
console.log("Listening on " + port);

io.sockets.on('connection', function (socket) {
  socket.emit('message', { message: 'welcome to the chat' });
  socket.on('send', function (data) {
    io.sockets.emit('message', data);
  });
});
