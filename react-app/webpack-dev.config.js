const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
///const merge = require('webpack-merge')
const base = require('./webpack-base.config.js')

module.exports = {
	...base,
	mode: 'development',
	devtool: 'cheap-module-source-map',
	output: {
		filename: 'index.js',
		chunkFilename: '[name].chunk.js',
		//path: path.resolve(__dirname, 'tmp/webpack'),
		},
	module: {
		...base.module,
		rules: [
			...base.module.rules,
			// Maybe later
			// {
			// 	// sass/scss loader to load sass-scss style files
			// 	test: /\.(sass|scss)$/,
			// 	use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
			// },
			// {
			// 	// copies image files to assets folder in destination folder - dist
			// 	test: /\.(svg|png|jpg|jpeg|gif|ico|csv)$/,
			// 	use: [
			// 		{
			// 			loader: 'file-loader',
			// 			options: {
			// 				name: '[name].[ext]',
			// 				outputPath: 'static/assets',
			// 			},
			// 		},
			// 	],
			// },
			],
		},
	plugins: [
		...base.plugins,
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'index.html'),
			publicPath: "/"
			}),
		new webpack.HotModuleReplacementPlugin(),
		],
	devServer: {
		port: 8080,
		hot: true,
		static: ['./dev-data'],
		historyApiFallback: true
		},
	}
