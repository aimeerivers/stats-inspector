window.onload = function() {

  var stats = [];
  var socket = io.connect(window.location.hostname);
  var statsDiv = document.getElementById("stats");

  socket.on('newstats', function (data) {
    if(data.stat && data.ip) {
      if(data.ip === window.ip) {
        stats.push(data.stat);
        var html = document.createElement('div');
        var ip = document.createElement('strong');
        ip.innerHTML = data.ip;
        var content = document.createElement('p');
        content.innerHTML = data.stat;
        html.appendChild(ip);
        html.appendChild(content);
        statsDiv.appendChild(html);
      }
    } else {
      console.log("There is a problem:", data);
    }
  });

}
