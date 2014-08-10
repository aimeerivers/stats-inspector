window.onload = function() {

  var socket = io.connect(window.location.hostname);
  var statsDiv = document.getElementById("stats");

  socket.on('newstats', function (data) {
    if(data.stat && data.ip) {
      if(data.ip === window.ip) {
        var stat = StatsRequest(data.stat);

        var holder = document.createElement('div');
        holder.className = 'stat ' + stat.type.toLowerCase();

        var type = document.createElement('h2');
        type.className = 'type';
        type.innerHTML = stat.type;
        holder.appendChild(type);

        var paramsCache = stat.params();
        if(paramsCache.length > 0) {
          var paramsTable = document.createElement('table');
          paramsTable.className = 'params';

          var headerRow = document.createElement('tr');
          var headerKey = document.createElement('th');
          headerKey.innerHTML = 'Key';
          var headerVal = document.createElement('th');
          headerVal.innerHTML = 'Value';
          headerRow.appendChild(headerKey);
          headerRow.appendChild(headerVal);
          paramsTable.appendChild(headerRow);

          for(var i = 0; i < paramsCache.length; i++) {
            var value = paramsCache[i];
            var row = document.createElement('tr');
            var key = document.createElement('td');
            key.innerHTML = value.key;
            var val = document.createElement('td');
            val.innerHTML = value.val;
            row.appendChild(key);
            row.appendChild(val);
            paramsTable.appendChild(row);
          }

          var paramsHeader = document.createElement('h3');
          paramsHeader.innerHTML = 'Parameters';
          holder.appendChild(paramsHeader);
          holder.appendChild(paramsTable);
        }

        var raw = document.createElement('div');
        raw.className = 'raw';
        raw.innerHTML = stat.raw;
        var rawHeader = document.createElement('h3');
        rawHeader.innerHTML = 'Full request';
        holder.appendChild(rawHeader);
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
    params: function() { return []; },
    raw: request
  }
}

function IStatsRequest(request) {
  return {
    type: 'iStats',
    params: function() { return []; },
    raw: request
  }
}

function LiveStatsRequest(request) {
  return {
    type: 'LiveStats',
    params: function() { return []; },
    raw: request
  }
}

function DaxRequest(request) {
  return {
    type: 'DAx',
    params: function() {
      var params = [];
      this._queryString().split('&').forEach(function(pair) {
        var arr = pair.split('=');
        params.push({key: arr[0], val: arr[1]});
      });
      return params;
    },
    _queryString: function() {
      return this.raw.split('?')[1];
    },
    raw: request
  }
}

function RdotRequest(request) {
  return {
    type: 'Rdot',
    params: function() { return []; },
    raw: request
  }
}
