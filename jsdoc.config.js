module.exports = {
	sourceType: 'module',
	plugins: ['plugins/markdown', 'node_modules/jsdoc-vuejs'],
	source: {
		includePattern: '\\.(vue|js)$',
		exclude: [
            "node_modules"
        ]
	}
};
