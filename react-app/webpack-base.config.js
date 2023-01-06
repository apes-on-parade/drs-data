const path = require('path')

module.exports = {
	entry: './src/index.js',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: /src/,
				loader: 'babel-loader',
				},
			// {
			// 	test: /\.html$/,
			// 	loader: 'html-loader',
			// 	},
			],
	},
	plugins: []
}
