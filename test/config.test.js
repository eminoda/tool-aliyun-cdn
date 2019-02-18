function buildRandom() {
	return new Date().getTime();
}

test('build random number > 10', () => {
	expect(buildRandom()).toBeGreaterThan(10);
});
