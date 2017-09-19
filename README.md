# Sensi

This is a JavaScript API wrapper for [Sensi thermostats](https://mythermostat.sensicomfort.com/). Originally written by [mguterl](https://github.com/mguterl), this one includes both heating and cooling and fan control.

## Usage

Clone this repo (NPM install comming soon), then require it in your script:
```javascript
var Sensi = require('sensi/index.js');
```

The Sensi constructor is same as the original one:

```javascript
var sensi = new Sensi({
  username: 'john@example.com',
  password: 'password'
});
```

Authorizing with Sensi servers and discovering thermostats:

```javascript
sensi.start().then(function() {
  sensi.thermostats().then(function(thermostats) {
    // This returns array of thermostats associated with the account, you could use forEach here like in the example.js
  });
});
```

After that, call one of the functions below and check out the magic:

```javascript
sensi.setSystemMode({
  icd: thermostats[0].ICD, // ICD of your thermostat (hardcode if you like)
  mode: 'Heat' // Available modes: 'Heat', 'Cool', 'Off'
});
```

```javascript
sensi.setFanMode({
  icd: thermostats[0].ICD, // ICD of your thermostat (hardcode if you like)
  state: 'On' // Available states: 'On' and 'Off'
});
```

```javascript
sensi.setScheduleMode({
  icd: thermostats[0].ICD, // ICD of your thermostat (hardcode if you like)
  mode: 'Off' // Only Off available right now, still resarching why On is not working. Try passing On, if it works, write on GitHub.
});
```

```javascript
sensi.setTemperature({
  icd: thermostats[0].ICD, // ICD of your thermostat (hardcode if you like)
  mode: 'Cool', // Available modes: 'Cool', 'Heat' and 'Off'. Due to weird handling from thermostat, this will trigger setSystemMode to change it.
  temperature: 21,
  scale: 'C'
});
```
Thanks to:
* [mguterl](https://github.com/mguterl) for writing the original JavaScript wrapper
* [kirbs-](https://github.com/kirbs-) for writing the Ruby Gem for Sensi, helped me in finding some stuff regarding SystemMode.

Feel free to contribute!
