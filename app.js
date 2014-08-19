var express = require("express");
var logfmt = require("logfmt");
var app = express();
var port = Number(process.env.PORT || 5000);
var server = app.listen(port);
var io = require('socket.io').listen(server);

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/stats-inspector');

var statsmodel = require('./public/js/models/stats.js');
var merge = require('merge');

app.use(logfmt.requestLogger());
app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));
app.enable('trust proxy');

app.get('/', function(req, res) {
  var collection = db.get('statscollection');
  collection.find({}, {}, function(e, stats) {
    res.render("thing", { "stats" : stats });
  });
});

app.get('/stats/ip/:ip', function(req, res) {
  searchAndRespond({ip: req.params.ip}, res);
});

app.delete('/stats/ip/:ip', function(req, res) {
  var collection = db.get('statscollection');
  collection.remove({ip: req.params.ip}, function(err) {
    if(err) {
      res.send("There was a problem adding the information to the database.");
    } else {
      res.send(204);
    }
  });
});

app.get('/stats/ip/:ip/type/:type', function(req, res) {
  searchAndRespond({ip: req.params.ip, type: req.params.type}, res);
});

app.get('/stats/ip/:ip/type/:type/:key/:val', function(req, res) {
  var params = {ip: req.params.ip, type: req.params.type};
  params[req.params.key] = req.params.val;
  searchAndRespond(params, res);
});

app.get('/stats/ip/:ip/type/:type/:key/:val/:key2/:val2', function(req, res) {
  var params = {ip: req.params.ip, type: req.params.type};
  params[req.params.key] = req.params.val;
  params[req.params.key2] = req.params.val2;
  searchAndRespond(params, res);
});

function searchAndRespond(params, res) {
  var collection = db.get('statscollection');
  collection.find(params, {}, function(e, stats) {
    res.send(stats);
  });
}

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
    var stat = statsmodel.StatsRequest(req.url);
    var params = {};
    var statparams = stat.params();
    for(var i = 0; i < statparams.length; i++) {
      params[statparams[i].key] = statparams[i].val;
    }
    var collection = db.get('statscollection');
    collection.insert(merge({ip: req.ip, type: stat.type, url: stat.raw}, params), function(err, doc) {
      if(err) {
        res.send("There was a problem adding the information to the database.");
      } else {
        io.sockets.emit('ipconnection', { ip: req.ip });
        io.sockets.emit('newstats', { ip: req.ip, stat: req.url });
        var img = new Buffer(35);
        img.write("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64");
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(img, 'binary');
      }
    });
  });
}

console.log("Listening on " + port);
