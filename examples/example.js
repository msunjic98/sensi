var Sensi = require('../index.js');
var sensi = new Sensi({
	username: 'john@example.com',
	password: 'password'
});

sensi.start().then(function() {
	sensi.thermostats().then(function(thermostats) {
		thermostats.forEach(function(thermostat) {
			sensi.setTemperature({
				mode: "Cool",
				icd: thermostat.ICD,
				temperature: 15,
				scale: 'C',
			});
		})
	});
});