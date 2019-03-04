const moment = require('moment');
const text = require('./text');
const crypto = require('crypto');
const extend = require('extend2');
const is = require('is-type-of');
module.exports = {
	getSignatureNonce: () => {
		return new Date().getTime();
	},
	// get utc timestamp
	// 北京 timestamp:2014-11-11 20:00:00 ==> utc timestamp:2014-11-11T12:00:00Z
	getTimestamp: time => {
		let timeMoment = moment(time || new Date());
		return timeMoment.utc().format();
	},
	getAccess: access => {
		if (!access || !access.AccessKeyId || !access.AccessKeySecret) {
			throw new Error(text.ERROR_ACCESS);
		}
		return {
			AccessKeyId: access.AccessKeyId,
			AccessKeySecret: access.AccessKeySecret
		};
	},
	/**
	 * URL 编码，规则如下：
	 * 对于字符 A-Z、a-z、0-9以及字符“-”、“_”、“.”、“~”不编码;
	 * 对于其他字符编码成“%XY”的格式，其中XY是字符对应ASCII码的16进制表示。比如英文的双引号（”）对应的编码就是%22，
	 * 对于扩展的UTF-8字符，编码成“%XY%ZA…”的格式；
	 * 需要说明的是英文空格（ ）要被编码是%20，而不是加号（+）。
	 */
	encodeURL: str => {
		// encodeURIComponent: no escaped: A-Z a-z 0-9 - _ . ! ~ * ' ( )
		return encodeURIComponent(str).replace(/\*/g, '%2A');
	},
	normalizeQueryString: function(queryString = {}) {
		return Object.keys(queryString)
			.sort()
			.map(key => {
				return this.encodeURL(key) + '=' + this.encodeURL(queryString[key]);
			})
			.join('&');
	},
	getSignString: function(config, method = 'GET') {
		const normalizeStr = this.normalizeQueryString(config);
		return `${method}${text.SEPARATOR_URLPARAM}${this.encodeURL('/')}${text.SEPARATOR_URLPARAM}${this.encodeURL(normalizeStr)}`;
	},
	_createHMAC: function(key) {
		return crypto.createHmac('sha1', `${key}${text.SEPARATOR_URLPARAM}`);
	},
	getBase64HMAC: function(sign, key) {
		return this._createHMAC(key)
			.update(sign)
			.digest('base64');
	},
	merge: (...args) => {
		return extend(true, {}, ...args);
	},
	modifyPathByType: (path, isFile) => {
		if (isFile) {
			if (is.array(path)) {
				return path.join('\r\n');
			} else {
				return path;
			}
		} else {
			// 目录方式，增加数组判断
			if (is.array(path)) {
				let paths = path;
				for (let i = 0; i < paths.length; i++) {
					paths[i] = _appendEnd(paths[i]);
				}
				return paths.join('\r\n');
			} else {
				return _appendEnd(path);
			}
		}
		function _appendEnd(path) {
			if (path.endsWith('/')) {
				return path;
			} else {
				return path + '/';
			}
		}
	}
};
