# tool-aliyun-cdn

阿里云 cdn 工具包

## quickstart

1.  安装 npm

    ```js
    npm install AliyunCDN -S
    ```

2.  创建 AliyunCDN

    ```js
    // https://usercenter.console.aliyun.com/
    const cdn = new AliyunCDN({
    	AccessKeyId: 'AccessKeyId', //阿里云颁发给用户的访问服务所用的密钥ID
    	AccessKeySecret: 'AccessKeySecret' //签名结果串，关于签名的计算方法，请参见签名机制。
    });
    ```

3.  通用 API

    > 参数和 aliyun 一致

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

4.  刷新 CDN 缓存

    **目录方式**

    ```js
    cdn
    	.refresh({
    		path: 'imagecdn.xx.cn/cdn/test',
    		isFile: false
    	})
    	.then(data => {})
    	.catch(err => {});
    ```

    **文件方式**

    ```js
    cdn
    	.refresh({
    		path: ['imagecdn.xx.cn/cdn/test/cdn1.png', 'imagecdn.xx.cn/test/cdn2.png'],
    		isFile: true
    	})
    	.then(data => {})
    	.catch(err => {});
    ```

    返回结果：

    ```
    {
    	RefreshTaskId: '4399915570',
    	RequestId: '09B2C20B-9B9A-41D2-A22F-8F00191211EA'
    }
    ```

5.  预热 CDN

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

6.  CDN 历史刷新记录

    ```js
    cdn
    	.refreshHistory({
    		path: 'http://imagecdn.xx.cn/cdntest/cdn3.png',
    		domain: 'imagecdn.xx.cn',
    		type: 'file',
    		startTime: '2019-02-19 17:00:00',
    		endTime: '2019-02-19 18:00:00'
    	})
    	.then(data => {})
    	.catch(err => {});
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

7.  [CDN 套餐使用情况](https://help.aliyun.com/document_detail/91156.html?spm=a2c4g.11186623.6.701.220477adPWTCoR)

    ```js
    cdn
    	.useInfo()
    	.then(data => {})
    	.catch(err => {});
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
