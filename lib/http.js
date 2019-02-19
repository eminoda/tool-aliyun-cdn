const request = require('request');
function http(options) {
	const config = {
		method: options.method,
		uri: options.url
	};
	return new Promise((resolve, reject) => {
		try {
			request(config, (error, response, body) => {
				try {
					if (error) {
						reject(error);
					} else {
						resolve(body);
					}
				} catch (err) {
					reject(error);
				}
			});
		} catch (err) {
			reject(error);
		}
	});
}
module.exports = http;
