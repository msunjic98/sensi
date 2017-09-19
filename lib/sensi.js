var Promise = require('bluebird');
var request = require('request');
request = Promise.promisify(request.defaults({ jar: true }));

var Sensi = function(options) {
  this.username = options.username;
  this.password = options.password;
  this.baseUrl = options.baseUrl || 'https://bus-serv.sensicomfort.com';
  this.defaultHeaders = {
    'X-Requested-With': 'XMLHttpRequest', // needed to get cookies instead of token
    'Accept': 'application/json; version=1, */*; q=0.01'
  };
}

Sensi.prototype.start = function() {
  return this.authorize().then(function() {
    return this.negotiate();
  }.bind(this));
};

Sensi.prototype.authorize = function() {
  var options = {
    url: this.baseUrl + '/api/authorize',
    method: 'POST',
    headers: this.defaultHeaders,
    json: {
      'UserName': this.username,
      'Password': this.password
    }
  }

  return request(options);
};

Sensi.prototype.negotiate = function() {
  var options = {
    url: this.baseUrl + '/realtime/negotiate',
    method: 'GET',
    headers: this.defaultHeaders
  };

  return request(options).spread(function(_, body) {
    var json = JSON.parse(body);
    this.connectionToken = json['ConnectionToken'];
    return json;
  }.bind(this));
};

Sensi.prototype.thermostats = function() {
  var options = {
    url: this.baseUrl + '/api/thermostats',
    method: 'GET',
    headers: this.defaultHeaders
  };

  return request(options).spread(function(_, body) {
    return JSON.parse(body);
  });
};

Sensi.prototype.setTemperature = function(options) {
  if(options.mode) {
    this.setSystemMode({icd: options.icd, mode: options.mode});
    switch(options.mode) {
      case "Cool":
        mode = "SetCool";
        break;
      case "Heat":
        mode = "SetHeat";
        break;
      case "Off":
        mode = "Off";
        break;
    }
  };
  var httpOptions = {
    url: this.baseUrl + '/realtime/send',
    method: 'POST',
    qs: {
      transport: 'longPolling',
      connectionToken: this.connectionToken,
    },
    form: {
      data: JSON.stringify({
        'H': 'thermostat-v1',
        'M': mode,
        'A': [options.icd, options.temperature, options.scale],
        'I': 1
      })
    }
  };
  return request(httpOptions)

};

Sensi.prototype.setSystemMode = function(options) {
  var httpOptions = {
    url: this.baseUrl + '/realtime/send',
    method: 'POST',
    qs: {
      transport: 'longPolling',
      connectionToken: this.connectionToken,
    },
    form: {
      data: JSON.stringify({
        'H': 'thermostat-v1',
        'M': 'SetSystemMode',
        'A': [options.icd, options.mode],
        'I': 1
      })
    }
  };
  return request(httpOptions)
};

Sensi.prototype.setFanMode = function(options) {
  var httpOptions = {
    url: this.baseUrl + '/realtime/send',
    method: 'POST',
    qs: {
      transport: 'longPolling',
      connectionToken: this.connectionToken,
    },
    form: {
      data: JSON.stringify({
        'H': 'thermostat-v1',
        'M': 'SetFanMode',
        'A': [options.icd, options.state],
        'I': 1
      })
    }
  };
  return request(httpOptions)

}

Sensi.prototype.setScheduleMode = function(options) {
  var httpOptions = {
    url: this.baseUrl + '/realtime/send',
    method: 'POST',
    qs: {
      transport: 'longPolling',
      connectionToken: this.connectionToken,
    },
    form: {
      data: JSON.stringify({
        'H': 'thermostat-v1',
        'M': 'SetScheduleMode',
        'A': [options.icd, options.mode],
        'I': 1
      })
    }
  };
  return request(httpOptions)
}
module.exports = Sensi;
