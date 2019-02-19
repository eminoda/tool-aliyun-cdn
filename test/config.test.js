const AliyunCDN = require('../lib/cdn');
const util = require('../lib/util');
const moment = require('moment');

test('config random number', () => {
	expect(util.getSignatureNonce()).toBeGreaterThan(10);
});

test('config timestamp', () => {
	let now = moment(new Date());
	let utcTimeStamp = util.getTimestamp(now); //moment.utc(now).format();
	let testTimeStamp = now.utcOffset(0).format();
	expect(testTimeStamp).toEqual(utcTimeStamp);
});

test('config Signature', () => {
	const access = {
		AccessKeyId: 'testid', //阿里云颁发给用户的访问服务所用的密钥ID
		AccessKeySecret: 'testsecret', //签名结果串，关于签名的计算方法，请参见签名机制。
	};
	const actionParam = {
		Action: 'DescribeCdnService',
	};
	const requestParams = util.merge(
		{
			Format: 'JSON', //返回值的类型，支持JSON与XML。默认为XML
			Version: '2014-11-11', //API版本号，为日期形式：YYYY-MM-DD，本版本对应为2014-11-11
			AccessKeyId: '', //阿里云颁发给用户的访问服务所用的密钥ID
			SignatureMethod: 'HMAC-SHA1', //签名方式，目前支持HMAC-SHA1
			Timestamp: '2015-08-06T02:19:46Z', // test
			SignatureVersion: '1.0', //签名算法版本，目前版本是1.0
			SignatureNonce: '9b7a44b0-3be1-11e5-8c73-08002700c460', // test
		},
		actionParam,
		{
			AccessKeyId: access.AccessKeyId,
		},
	);
	const sign = util.getSignString(requestParams);
	const Signature = util.getBase64HMAC(sign, access.AccessKeySecret);
	// see more detail: https://help.aliyun.com/document_detail/27149.html?spm=a2c4g.11174283.6.718.777c7035MHzL7Y
	expect(Signature).toEqual('KkkQOf0ymKf4yVZLggy6kYiwgFs=');
});
