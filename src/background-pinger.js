import { loadOptions } from './utils.js';

let options = {};

function ping(server) {
	console.log('pinging ' + server);
}

function reloadConfig() {
	loadOptions().then((savedOptions) => {
		options.server = savedOptions.server;
		options.interval = savedOptions.interval;

		if (options.server && options.interval >= 1) {
			ping(options.server);

			if (options.pinger) {
				clearInterval(options.pinger);
			}
			options.pinger = setInterval(function() {
				ping(options.server);
			}, options.interval * 1000);
		}
	});
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request === 'configChanged') {
		reloadConfig();
	}
});

//startup
reloadConfig();
