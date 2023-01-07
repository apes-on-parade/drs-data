const path = require('path')

module.exports = {
	entry: './src/index.jsx',
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
