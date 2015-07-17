function StatsRequest(request) {
  if(request.indexOf('/o.gif') === 0) {
    if(request.indexOf('~RS~q~RS~0~') === -1)
      return IStatsRequest(request);
    else
      return LiveStatsRequest(request);
  }

  if(request.indexOf('/bbc/int/s') === 0
    || request.indexOf('/bbc/test/s') === 0
    || request.indexOf('/bbc/stage/s') === 0
    || request.indexOf('/bbc/bbc/s') === 0
    || request.indexOf('/bbc/nkdata/s') === 0) {
    if(request.indexOf('ml_name=echo_as3') > 0 || request.indexOf('ml_name=echo_js') > 0)
      return EchoRequest(request);
    else
      return DaxRequest(request);
  }

  if(request.indexOf('/e/') === 0)
    return RdotRequest(request);

  if(request.indexOf('/j0=') === 0) {
      return KantarRequest(request);
  }

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
      var params = [];
      var keysAndValues = this._queryString().split('~RS~');
      keysAndValues.pop();
      keysAndValues.shift();
      for(var i = 0; i < keysAndValues.length - 1; i += 2) {
        params.push({key: keysAndValues[i], val: decodeURIComponent(keysAndValues[i+1])});
      }
      this._cachedParams = params;
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

function KantarRequest(request) {

    function annotateLabels(label) {
        if(label == 'sx') {
            return '<b>sx</b><br>video width';
        }
        if(label == 'sy') {
            return '<b>sy</b><br>video height';
        }
        if(label == 'vt') {
            return '<b>vt</b><br>view time [secs]';
        }
        if(label == 'cq') {
            return '<b>cq</b><br>programme id';
        }
        if(label == 'dur') {
            return '<b>dur</b><br>duration [secs]';
        }
        if(label == 'duration') {
            return '<b>duration</b><br>duration [secs]';
        }
        if(label == 'stream') {
            return '<b>stream</b><br>stream name';
        }
        if(label == 'uid') {
            return '<b>uid</b><br>unique id';
        }
        return label;
    }

    return {
        type: 'Kantar',
        headline: function() { return 'heartbeat'; },
        params: function() {
          if(this._cachedParams) {
            return this._cachedParams;
          }
          var params = [];

          // parse system object
          var systemObject = this._queryString().split('j0=,,,')[1].split(';+,')[0];
          params.push({key: 'SYSTEM OBJECT', val: ''});

          systemObject.split('+').forEach(function(pair) {
            var arr = pair.split('=');
            if(arr[0] == 'sx') {
                arr[0] = '<b>sx</b><br>screen width';
            }
            if(arr[0] == 'sy') {
                arr[0] = '<b>sx</b><br>screen height';
            }
            if(arr[0] == 'pl') {
                arr[0] = '<b>pl</b><br>player name';
            }
            if(arr[0] == 'plv') {
                arr[0] = '<b>plv</b><br>player version';
            }
            params.push({key: arr[0], val: decodeURIComponent(arr[1])});
          });

          // parse usage information
          var left = this._queryString().indexOf(';+,') + 3;
          var right =  this._queryString().indexOf(';;;');
          var usageInformation = this._queryString().substring(left, right);

          params.push({key: 'USAGE INFO OBJECT', val: ''});

          //before pst
          var beforePst = usageInformation.substring(0,usageInformation.indexOf('pst=') - 1);
          beforePst.split('+').forEach(function(pair) {
            if (pair == '') {
                return;
            }
            var arr = pair.split('=');
            arr[0] = annotateLabels(arr[0]);
            params.push({key: arr[0], val: decodeURIComponent(arr[1])});
          });

         // pst
         var pst = this._queryString().substring(this._queryString().indexOf('pst=') + 5,this._queryString().indexOf(';;') + 1);
         var splittablePst = pst.replace(/;/g,',');
         var intervalString = '<hr>';
         var pstSets = splittablePst.split(',');
         pstSets.forEach(function(pair) {
             if (pair == '+' || pair == '') {
                return;
            } else {
                var intervalData = pair.split('+');
                intervalString += 'start: ' + intervalData[0] + '<br>end: ' + intervalData[1] + '<br>timestamp: ' + intervalData[2] + '<hr>';
            }

         });
         params.push({key: '<b>pst</b>' + '<br>play state', val: intervalString});

         // after pst
         var afterPst = usageInformation.substring(usageInformation.indexOf(';;') + 3);
         afterPst.split('+').forEach(function(pair) {
           var arr = pair.split('=');
           arr[0] = annotateLabels(arr[0]);
           params.push({key: arr[0], val: decodeURIComponent(arr[1])});
         });

          this._cachedParams = params;
          return params;
        },
        _queryString: function() {
          return this.raw;
        },
        raw: request
    }
}

module.exports.StatsRequest = StatsRequest;
