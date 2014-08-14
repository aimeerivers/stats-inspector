window.onload = function() {

  var socket = io.connect(window.location.hostname);
  var statsDiv = document.getElementById("stats");

  socket.on('newstats', function (data) {
    if(data.stat && data.ip) {
      if(data.ip === window.ip) {
        var date = new Date();
        var stat = StatsRequest(data.stat);

        var holder = document.createElement('div');
        holder.className = 'stat ' + stat.type.toLowerCase();

        var callout = document.createElement('div');
        callout.className = 'callout';

        var type = document.createElement('h2');
        type.className = 'type';
        type.innerHTML = stat.type;
        type.addEventListener('click', function(e) {
          var toggle = e.srcElement.parentNode.nextSibling;
          if(toggle.className.indexOf('hidden') == -1) {
            toggle.className = 'toggle hidden';
          } else {
            toggle.className = 'toggle';
          }
        });
        callout.appendChild(type);

        var headline = document.createElement('div');
        headline.className = 'headline';
        headline.innerHTML = stat.headline();
        callout.appendChild(headline);

        var time = document.createElement('div');
        time.className = 'time';
        time.innerHTML = date.toLocaleTimeString();
        callout.appendChild(time);

        var toggler = document.createElement('div');
        toggler.className = 'toggle hidden';

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
          toggler.appendChild(paramsHeader);
          toggler.appendChild(paramsTable);
        }

        var raw = document.createElement('div');
        raw.className = 'raw';
        raw.innerHTML = stat.raw;
        var rawHeader = document.createElement('h3');
        rawHeader.innerHTML = 'Full request';
        toggler.appendChild(rawHeader);
        toggler.appendChild(raw);

        holder.appendChild(callout);
        holder.appendChild(toggler);
        statsDiv.appendChild(holder);
      }
    } else {
      console.log("There is a problem:", data);
    }
  });

}

function StatsRequest(request) {
  if(request.indexOf('/o.gif') === 0) {
    var search = request.search(/~RS~t~RS~\w{4}_\w{1,10}~/);
    if(search >= 1)
      return LiveStatsRequest(request);
    else
      return IStatsRequest(request);
  }

  if(request.indexOf('/bbc/int/s') === 0
    || request.indexOf('/bbc/test/s') === 0
    || request.indexOf('/bbc/bbc/s') === 0)
    return DaxRequest(request);

  if(request.indexOf('/bbc/nkdata/s') === 0)
    return EchoRequest(request);

  if(request.indexOf('/e/') === 0)
    return RdotRequest(request);

  return BasicRequest(request);
}

function BasicRequest(request) {
  return {
    type: 'unknown',
    headline: function() { return 'unknown'; },
    params: function() { return []; },
    raw: request
  }
}

function IStatsRequest(request) {
  return {
    type: 'iStats',
    headline: function() {
      var params = this.params();
      for (var i = 0; i < params.length; i++) {
        if(params[i].key === 't')
          return params[i].val;
      }
    },
    params: function() {
      if(this._cachedParams) {
        return this._cachedParams;
      }
      var rsParams = this._rsParams();
      var queryParams = '';
      for(var i = 0; i < rsParams.length; i++) {
        if(rsParams[i].key == 'q') {
          queryParams = rsParams[i].val;
          break;
        }
      }
      var standardParams = this._standardParams(queryParams);
      var params = rsParams.concat(standardParams);
      this._cachedParams = params;
      return params;
    },
    _standardParams: function(queryString) {
      if(queryString === '0')
        return [];
      var params = [];
      queryString.split('&').forEach(function(pair) {
        var arr = pair.split('=');
        params.push({key: arr[0], val: decodeURIComponent(arr[1])});
      });
      return params;
    },
    _rsParams: function() {
      var params = [];
      var keysAndValues = this._queryString().split('~RS~');
      keysAndValues.pop();
      keysAndValues.shift();
      for(var i = 0; i < keysAndValues.length - 1; i += 2) {
        params.push({key: keysAndValues[i], val: decodeURIComponent(keysAndValues[i+1])});
      }
      return params;
    },
    _queryString: function() {
      return this.raw.split('?')[1];
    },
    raw: request
  }
}

function LiveStatsRequest(request) {
  return {
    type: 'LiveStats',
    headline: function() {
      var params = this.params();
      for (var i = 0; i < params.length; i++) {
        if(params[i].key === 't')
          return params[i].val;
      }
    },
    params: function() {
      if(this._cachedParams) {
        return this._cachedParams;
      }
      var rsParams = this._rsParams();
      var queryParams = '';
      for(var i = 0; i < rsParams.length; i++) {
        if(rsParams[i].key == 'q') {
          queryParams = rsParams[i].val;
          break;
        }
      }
      var standardParams = this._standardParams(queryParams);
      var params = rsParams.concat(standardParams);
      this._cachedParams = params;
      return params;
    },
    _standardParams: function(queryString) {
      if(queryString === '0')
        return [];
      var params = [];
      queryString.split('&').forEach(function(pair) {
        var arr = pair.split('=');
        params.push({key: arr[0], val: decodeURIComponent(arr[1])});
      });
      return params;
    },
    _rsParams: function() {
      var params = [];
      var keysAndValues = this._queryString().split('~RS~');
      keysAndValues.pop();
      keysAndValues.shift();
      for(var i = 0; i < keysAndValues.length - 1; i += 2) {
        params.push({key: keysAndValues[i], val: decodeURIComponent(keysAndValues[i+1])});
      }
      return params;
    },
    _queryString: function() {
      return this.raw.split('?')[1];
    },
    raw: request
  }
}

function DaxRequest(request) {
  return {
    type: 'DAx',
    headline: function() {
      var actionType = '';
      var controlId = '';
      var params = this.params();
      for (var i = 0; i < params.length; i++) {
        if(params[i].key === 'action_type')
          actionType = params[i].val;
        if(params[i].key === 'control_id')
          controlId = params[i].val;
      }
      return [actionType, controlId].join(' - ');
    },
    params: function() {
      if(this._cachedParams) {
        return this._cachedParams;
      }
      var params = [];
      this._queryString().split('&').forEach(function(pair) {
        var arr = pair.split('=');
        params.push({key: arr[0], val: decodeURIComponent(arr[1])});
      });
      this._cachedParams = params;
      return params;
    },
    _queryString: function() {
      return this.raw.split('?')[1];
    },
    raw: request
  }
}

function EchoRequest(request) {
  return {
    type: 'Echo',
    headline: function() {
      var params = this.params();
      for (var i = 0; i < params.length; i++) {
        if(params[i].key === 'echo_event')
          return params[i].val;
      }
    },
    params: function() {
      if(this._cachedParams) {
        return this._cachedParams;
      }
      var params = [];
      this._queryString().split('&').forEach(function(pair) {
        var arr = pair.split('=');
        params.push({key: arr[0], val: decodeURIComponent(arr[1])});
      });
      this._cachedParams = params;
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
    headline: function() {
      var params = this.params();
      for (var i = 0; i < params.length; i++) {
        if(params[i].key === 'Event class')
          return params[i].val;
      }
    },
    params: function() {
      if(this._cachedParams) {
        return this._cachedParams;
      }
      var queryString = this._queryString().split('?');
      var parts = queryString[0].split('/');
      var params = [
        { key: 'Product', val: decodeURIComponent(parts[0]) },
        { key: 'Device type', val: decodeURIComponent(parts[1]) },
        { key: 'Component name', val: decodeURIComponent(parts[2]) },
        { key: 'Component version', val: decodeURIComponent(parts[3]) },
        { key: 'Programme ID', val: decodeURIComponent(parts[4]) },
        { key: 'iStats ID', val: decodeURIComponent(parts[5]) },
        { key: 'Event class', val: decodeURIComponent(parts[6]) },
        { key: 'Detail', val: decodeURIComponent(parts[7]) }
      ];
      queryString[1].split('&').forEach(function(pair) {
        var arr = pair.split('=');
        params.push({key: arr[0], val: decodeURIComponent(arr[1])});
      });
      this._cachedParams = params;
      return params;
    },
    _queryString: function() {
      return this.raw.split('/e/')[1];
    },
    raw: request
  }
}
