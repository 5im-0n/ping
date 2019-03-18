import { loadOptions } from './utils.js';

let options = {};

function down(error) {
	if (options.alert && !options.alertShown) {
		browser.notifications.create('server-down-notification', {
			'type': 'basic',
			'iconUrl': browser.extension.getURL('icons/offline-48.png'),
			'title': 'Server went down',
			'message': error
		});

		options.alertShown = true;
	}

	browser.browserAction.setIcon({
		path: 'icons/offline-32.png'
	});

	if (error) {
		browser.browserAction.setTitle({
			title: error
		});
	}
}

function up() {
	browser.browserAction.setIcon({
		path: 'icons/available-32.png'
	});
	browser.browserAction.setTitle({
		title: 'pinging ' + options.server
	});

	options.alertShown = false;
	browser.notifications.clear('server-down-notification');
}

function ping(server) {
	console.log('pinging ' + server);
	fetch(server)
	.then(function(response) {
		if (response.status === 200) {
			up();
		} else {
			down(response.statusText);
		}
	})
	.catch((error) => {
		down(error.message);
	});
}

function reloadConfig() {
	loadOptions().then((savedOptions) => {
		options.server = savedOptions.server;
		options.interval = savedOptions.interval;
		options.alert = savedOptions.alert;

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
