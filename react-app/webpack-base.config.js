const path = require('path')

module.exports = {
	entry: './src/index.jsx',
	output: {
			filename: 'index-[contenthash:8].js',
			chunkFilename: '[name]-[contenthash:8].chunk.js',
			publicPath: '/'
		},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: /src/,
				loader: 'babel-loader',
				options: {
					presets: ["@babel/preset-react"],
					// "plugins": [
					//   ["module-resolver", {
					//     "root": ["./src"],
					//   }],
					// ]
					}
				},
			{
				// css-loader
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
				},
			// {
			// 	test: /\.html$/,
			// 	loader: 'html-loader',
			// 	},
			],
	},
	plugins: []
}
