# tool-aliyun-cdn

阿里云 cdn 工具包

## feature

- 刷新并推送 CDN
- 查询 CDN 使用情况

## quickstart

1.  安装 npm

    ```js
    npm install tool-aliyun-cdn --save
    ```

2.  创建 AliyunCDN 对象

    ```js
    const AliyunCDN = require('tool-aliyun-cdn');
    // https://usercenter.console.aliyun.com/
    const cdn = new AliyunCDN({
    	AccessKeyId: 'AccessKeyId', //阿里云颁发给用户的访问服务所用的密钥ID
    	AccessKeySecret: 'AccessKeySecret' //签名结果串，关于签名的计算方法，请参见签名机制。
    });
    ```

3.  通用 API 调用

    **cdn.request**


    所有 AliyunCDN 方法返回都是 **promise** 规范，请求参数和 **aliyun 一致**（[阿里云 新版 API 参考](https://help.aliyun.com/document_detail/91856.html?spm=a2c4g.11186623.6.628.68bb1f52PVbQIm)）

    ```js
    cdn
    	.request({
    		url: cdn.buildAliyunApi({
    			Action: 'RefreshObjectCaches',
    			ObjectPath: `imagecdn.xx.cn/cdn/test/cdn1.png\r\nimagecdn.xx.cn/test/cdn2.png`,
    			ObjectType: 'File'
    		})
    	})
    	.then(data => {})
    	.catch(err => {});
    ```

## [刷新预热接口](https://help.aliyun.com/document_detail/91164.html?spm=a2c4g.11186623.6.703.4f2324288UIjp0)

### cdn.refresh

刷新 CDN 缓存

| 参数   | 类型            | 说明                                                                                                   |
| ------ | --------------- | ------------------------------------------------------------------------------------------------------ |
| path   | string \| Array | 刷新路径、（多）文件 domain/file.png \| ['domain/cdn/file1.png', 'domain/file2.png'] \|domain/dirtory/ |
| isFile | boolean         | 文件、路径                                                                                             |

**目录方式**

```js
cdn.refresh({
	path: 'imagecdn.xx.cn/cdn/test',
	isFile: false
});
```

**文件方式**

```js
cdn.refresh({
	path: ['imagecdn.xx.cn/cdn/test/cdn1.png', 'imagecdn.xx.cn/test/cdn2.png'],
	isFile: true
});
```

返回结果：

```
{
	RefreshTaskId: '4399915570',
	RequestId: '09B2C20B-9B9A-41D2-A22F-8F00191211EA'
}
```

### cdn.preloadRefresh

预热 CDN

| 参数 | 类型            | 说明                                           |
| ---- | --------------- | ---------------------------------------------- |
| path | string \| Array | 刷新文件（支持数组类型多文件），不支持目录预热 |
| area | string          | 区域 domestic\|overseas                        |

```js
cdn.preloadRefresh({
	path: ['imagecdn.xx.cn/cdn/test/cdn1.png', 'imagecdn.xx.cn/test/cdn2.png'],
	area: 'domestic'
});
```

返回结果：

```
{
	RefreshTaskId: '4399915570',
	RequestId: '09B2C20B-9B9A-41D2-A22F-8F00191211EA'
}
```

### refreshHistory

CDN 历史刷新记录

| 参数       | 类型   | 说明                                      |
| ---------- | ------ | ----------------------------------------- |
| path       | string | 精确路径                                  |
| domain     | string | 域名                                      |
| type       | string | 文件类型 preload \| file \| directory     |
| status     | string | 刷新状态 Complete \| Refreshing \| Failed |
| startTime  | string | 北京时间（2019-02-19 17:00:00）           |
| endTime    | string | 北京时间（2019-02-19 18:00:00）           |
| pageSize   | number | 每页条数                                  |
| pageNumber | number | 页数                                      |

```js
cdn.refreshHistory({
	path: 'http://imagecdn.xx.cn/cdntest/cdn3.png',
	domain: 'imagecdn.xx.cn',
	type: 'file',
	startTime: '2019-02-19 17:00:00',
	endTime: '2019-02-19 18:00:00'
});
```

返回结果：

```
{
	PageNumber: 1,
	TotalCount: 17,
	PageSize: 20,
	RequestId: '0B94550C-F92D-4ACE-88DB-70A6B90BE559',
	Tasks:
	{
		CDNTask:[{
			CreationTime: '2019-02-19T07:57:58Z',
			ObjectPath: 'http://imagecdn.xx.cn/cdn/test/cdn1.png',
			Status: 'Complete',
			ObjectType: 'file',
			Process: '100%',
			TaskId: '4399109860'
		}]
	}
}
```

### cdn.useInfo

[CDN 套餐使用情况说明](https://help.aliyun.com/document_detail/91156.html?spm=a2c4g.11186623.6.701.220477adPWTCoR)

```js
cdn.useInfo();
```

返回结果：

```
{
	DirQuota: '100',
	PreloadRemain: '500',
	DirRemain: '99',
	blockRemain: '100',
	RequestId: 'E6882C9F-0054-4A0B-A237-00F217AE4DAE',
	UrlQuota: '2000',
	UrlRemain: '1980',
	BlockQuota: '100',
	PreloadQuota: '500'
}
```
