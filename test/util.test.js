const util = require('../lib/util');

test('util merge', () => {
	const obj1 = {
		a: 1,
		b: 1,
		c: {
			d: 3,
		},
	};
	const obj2 = {
		b: 2,
		c: {
			d: 4,
			e: 5,
		},
	};
	expect(util.merge(obj1, obj2)).toEqual({
		a: 1,
		b: 2,
		c: {
			d: 4,
			e: 5,
		},
	});
});
test('util modifyPathByType is file', () => {
	let isFile = true;
	let path = 'image.foo/test/1.png';
	expect(util.modifyPathByType(path, isFile)).toEqual(path);
});

test('util modifyPathByType is files', () => {
	let isFile = true;
	let path = ['image.foo/test/1.png', 'image.foo/test/2.png'];
	expect(util.modifyPathByType(path, isFile)).toEqual('image.foo/test/1.png\r\nimage.foo/test/2.png');
});

test('util modifyPathByType is dirtory', () => {
	let isFile = false;
	let path = 'image.foo/test';
	expect(util.modifyPathByType(path, isFile)).toEqual(path + '/');
});
