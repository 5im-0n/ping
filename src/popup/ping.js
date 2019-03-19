import { loadOptions, saveOptions } from '../utils.js';

function getParams() {
	return {
		server: document.getElementById('server').value,
		interval: parseInt(document.getElementById('interval').value),
		alert: document.getElementById('alert').checked
	};
};

document.addEventListener('DOMContentLoaded', function() {
	var list = document.getElementsByTagName('input');
	for (var i = 0; i < list.length; i++) {
		list[i].addEventListener('change', (ev) => {
			saveOptions(getParams());
			browser.runtime.sendMessage('configChanged');
		});
	}

	loadOptions().then((options) => {
		document.getElementById('server').value = options.server;
		document.getElementById('interval').value = options.interval;
		document.getElementById('alert').checked = options.alert;
	});

});
