window.onload = function() {

  var ips = [];
  var socket = io.connect(window.location.hostname);
  var ipsUl = document.getElementById("ips");

  socket.on('ipconnection', function (data) {
    if(data.ip) {
      if(ips.indexOf(data.ip) == -1) {
        ips.push(data.ip);
        var html = document.createElement('li');
        var anchor = document.createElement('a');
        anchor.href = '/ip/' + data.ip;
        anchor.innerHTML = data.ip;
        html.appendChild(anchor);
        ipsUl.appendChild(html);
      }
    } else {
      console.log("There is a problem:", data);
    }
  });

}
