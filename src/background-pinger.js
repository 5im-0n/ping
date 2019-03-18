import { loadOptions } from './utils.js';

let options = {};

function ping(server) {
	console.log('pinging ' + server);
	fetch(server)
	.then(function(response) {
		if (response.status === 200) {
			browser.browserAction.setIcon({
				path: 'icons/available-32.png'
			});
		} else {
			browser.browserAction.setIcon({
				path: 'icons/offline-32.png'
			});
		}
	})
	.catch((error) => {
		browser.browserAction.setIcon({
			path: 'icons/offline-32.png'
		});
	});
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
