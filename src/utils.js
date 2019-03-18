function loadOptions() {
	return browser.storage.local.get({
		server: '',
		interval: 60,
		alert: false
	});
};

function saveOptions(options) {
	return browser.storage.local.set(options);
};

if (typeof(window['ping'] === 'undefined')) {
	window.ping = {};
}

export {
	loadOptions,
	saveOptions
};
