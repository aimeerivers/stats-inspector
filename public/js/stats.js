window.onload = function() {

  var socket = io.connect(window.location.hostname);
  var statsDiv = document.getElementById("stats");

  socket.on('newstats', function (data) {
    if(data.stat && data.ip) {
      if(data.ip === window.ip) {
        var stat = StatsRequest(data.stat);

        var holder = document.createElement('div');
        holder.className = 'stat ' + stat.type.toLowerCase();

        var type = document.createElement('div');
        type.className = 'type';
        type.innerHTML = stat.type;

        var raw = document.createElement('div');
        raw.className = 'raw';
        raw.innerHTML = stat.raw;

        holder.appendChild(type);
        holder.appendChild(raw);
        statsDiv.appendChild(holder);
      }
    } else {
      console.log("There is a problem:", data);
    }
  });

}

function StatsRequest(request) {
  if(request.indexOf('/o.gif') === 0) {
    if(request.indexOf('~RS~q~RS~0~') === -1)
      return IStatsRequest(request);
    else
      return LiveStatsRequest(request);
  }

  if(request.indexOf('/bbc/int/s') === 0 || request.indexOf('/bbc/bbc/s') === 0)
    return DaxRequest(request);

  if(request.indexOf('/e/') === 0)
    return RdotRequest(request);

  return BasicRequest(request);
}

function BasicRequest(request) {
  return {
    type: 'unknown',
    raw: request
  }
}

function IStatsRequest(request) {
  return {
    type: 'iStats',
    raw: request
  }
}

function LiveStatsRequest(request) {
  return {
    type: 'LiveStats',
    raw: request
  }
}

function DaxRequest(request) {
  return {
    type: 'DAx',
    raw: request
  }
}

function RdotRequest(request) {
  return {
    type: 'Rdot',
    raw: request
  }
}
