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
