const util = require('./util');
const text = require('./text');
const extend = require('extend2');
const setting = require('./setting');
const http = require('./http');
class AliyunCDN {
	constructor(options = {}) {
		this.access = util.getAccess(options);
		this.method = (options.method || 'GET').toUpperCase();
		// requestParams = {};
	}
	/**
	 * 获取 StringToSign
	 * @param {*} config 请求参数（“公共请求参数”和给定了的请求接口的自定义参数，但不包括“公共请求参数”中提到Signature）进行自然排序）
	 * @param {*} method
	 * StringToSign=
	 * 		HTTPMethod + “&” +
	 * 		percentEncode(“/”) + ”&” +
	 * 		percentEncode(CanonicalizedQueryString)
	 */
	getSignString(config, method = 'GET') {
		const normalizeStr = util.normalizeQueryString(config);
		return `${method}${text.SEPARATOR_URLPARAM}${util.encode('/')}${text.SEPARATOR_URLPARAM}${util.encode(normalizeStr)}`;
	}
	getSignature(actionParam) {
		const requestParams = util.merge(setting.common, actionParam, {
			AccessKeyId: this.access.AccessKeyId
		});
		const sign = util.getSignString(requestParams);
		return util.getBase64HMAC(sign, this.access.AccessKeySecret);
	}
	request(options) {
		return new Promise((resolve, reject) => {
			const httpPromise = http({
				url: options.url
			});
			httpPromise
				.then(data => {
					try {
						data = JSON.parse(data);
						if (data.Message || data.Code) {
							reject(`[${data.Code}] ${data.Message}`);
						} else {
							resolve(data);
						}
					} catch (err) {
						reject(err);
					}
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	buildAliyunApi(actionParam) {
		const requestParams = util.merge(setting.common, actionParam, {
			AccessKeyId: this.access.AccessKeyId,
			Signature: this.getSignature(actionParam)
		});
		return setting.aliyun.prefixUrl + '?' + util.normalizeQueryString(requestParams);
	}
	/**
	 * 将源站的内容主动预热到L2 Cache节点上，用户首次访问可直接命中缓存，缓解源站压力。
	 * @param {*} options
	 * 	@param {string | Array} path 刷新文件（支持数组类型多文件），不支持目录预热
	 * 	@param {string} area domestic|overseas
	 */
	preloadRefresh(options = {}) {
		return this.request({
			url: this.buildAliyunApi({
				Action: setting.aliyun.ACTION_PRELOAD_REFRESH,
				ObjectPath: util.modifyPathByType(options.path, true),
				Area: options.area || 'domestic'
			})
		});
	}
	/**
	 * 刷新节点上的文件内容。刷新指定URL内容至Cache节点，支持URL批量刷新。
	 * @param {*} options
	 * 	@param {string | Array} path 刷新文件（支持数组类型多文件）or路径
	 * 	@param {boolean} isFile
	 */
	refresh(options = {}) {
		return this.request({
			url: this.buildAliyunApi({
				Action: setting.aliyun.ACTION_REFRESH,
				ObjectPath: util.modifyPathByType(options.path, options.isFile),
				ObjectType: options.isFile ? 'File' : 'Directory'
			})
		});
	}
	/**
	 * 查询刷新、预热状态是否在全网生效。
	 * @param {*} options
	 *  @param {string} path 精确路径
	 * 	@param {string}	domain 域名
	 * 	@param {string} type preload|file|directory
	 * 	@param {string} status Complete|Refreshing|Failed
	 * 	@param {string} startTime 北京时间（2019-02-19 17:00:00）
	 * 	@param {string} endTime 北京时间（2019-02-19 18:00:00）
	 * 	@param {number} pageSize
	 * 	@param {number} pageNumber
	 */
	refreshHistory(options = {}) {
		let Action = setting.aliyun.ACTION_REFRESH_TASKS;
		let ObjectPath = options.path;
		let DomainName = options.domain;
		let ObjectType = options.type;
		let Status = options.status;
		let StartTime = options.startTime ? util.getTimestamp(options.startTime) : '';
		let EndTime = options.endTime ? util.getTimestamp(options.endTime) : '';
		let PageSize = options.pageSize || 20;
		let PageNumber = options.pageNumber || 1;
		let actionParam = { Action, ObjectPath, DomainName, ObjectType, Status, StartTime, EndTime, PageSize, PageNumber };
		return this.request({
			url: this.buildAliyunApi(actionParam)
		});
	}
	/**
	 * 查询刷新、预热URL及目录的最大限制数量，以及当日剩余刷新、预热URL及目录的次数。
	 */
	useInfo() {
		return this.request({
			url: this.buildAliyunApi({
				Action: setting.aliyun.ACTION_USEINFO
			})
		});
	}
}

module.exports = AliyunCDN;
