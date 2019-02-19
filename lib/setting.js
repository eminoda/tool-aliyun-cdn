/**
 * 公共配置
 */
const util = require('./util');
let aliyun = {
	prefixUrl: 'http://cdn.aliyuncs.com/',
	ACTION_REFRESH: 'RefreshObjectCaches',
	ACTION_PRELOAD_REFRESH: 'PushObjectCache',
	ACTION_REFRESH_TASKS: 'DescribeRefreshTasks',
	ACTION_USEINFO: 'DescribeRefreshQuota'
};
let common = {
	Format: 'JSON', //返回值的类型，支持JSON与XML。默认为XML
	Version: '2014-11-11', //API版本号，为日期形式：YYYY-MM-DD，本版本对应为2014-11-11
	AccessKeyId: '', //阿里云颁发给用户的访问服务所用的密钥ID
	// Signature: '', //签名结果串，关于签名的计算方法，请参见签名机制。
	SignatureMethod: 'HMAC-SHA1', //签名方式，目前支持HMAC-SHA1
	// Timestamp:'2015-08-06T02:19:46Z', // test
	Timestamp: util.getTimestamp(), // 请求的时间戳。日期格式按照ISO8601标准表示，并需要使用UTC时间。格式为：YYYY-MM-DDThh:mm:ssZ。例如，2014-11-11T12:00:00Z（为北京时间2014年11月11日20点0分0秒）
	SignatureVersion: '1.0', //签名算法版本，目前版本是1.0
	// SignatureNonce: '9b7a44b0-3be1-11e5-8c73-08002700c460' ,// test
	SignatureNonce: util.getSignatureNonce() //唯一随机数，用于防止网络重放攻击。用户在不同请求间要使用不同的随机数值
};

exports.common = common;
exports.aliyun = aliyun;
