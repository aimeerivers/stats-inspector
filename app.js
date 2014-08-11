var express = require("express");
var logfmt = require("logfmt");
var app = express();
var port = Number(process.env.PORT || 5000);
var server = app.listen(port);
var io = require('socket.io').listen(server);

app.use(logfmt.requestLogger());
app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));
app.enable('trust proxy');

app.get('/stats-inspector/', function(req, res) {
  res.render("index");
});

app.get('/stats-inspector/ip/:ip', function(req, res) {
  res.render("stats", { ip: req.params.ip } );
});

// iStatsAV / LiveStats
respondTo('/o.gif');

// DAx
respondTo('/bbc/int/s');
respondTo('/bbc/test/s');
respondTo('/bbc/bbc/s');

// Echo
respondTo('/bbc/nkdata/s');

// Rdot
respondTo('/e/**');

function respondTo(route) {
  app.get(route, function(req, res) {
    io.sockets.emit('ipconnection', { ip: req.ip });
    io.sockets.emit('newstats', { ip: req.ip, stat: req.url });
    var img = new Buffer(35);
    img.write("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64");
    res.writeHead(200, {'Content-Type': 'image/gif' });
    res.end(img, 'binary');
  });
}

console.log("Listening on " + port);
