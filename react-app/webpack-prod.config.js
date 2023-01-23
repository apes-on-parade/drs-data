const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const TerserWeppackPlugin = require('terser-webpack-plugin')
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const postcssSafeParser = require('postcss-safe-parser')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
const base = require('./webpack-base.config.js')

module.exports = {
	...base,
	mode: 'production',
	devtool: 'source-map',
	output: {
		filename: 'index-[hash:8].js',
		chunkFilename: '[name]-[hash:8].chunk.js',
		path: path.resolve(__dirname, 'dist'),
		},
	module: {
		...base.module,
		rules: [
			...base.module.rules,
			// {
			// 	// css-loader
			// 	test: /\.css$/,
			// 	use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
			// 	},
			// {
			// 	// sass/scss loader to load sass-scss style files
			// 	test: /\.(sass|scss)$/,
			// 	use: [
			// 		MiniCssExtractPlugin.loader,
			// 		'css-loader',
			// 		'postcss-loader',
			// 		'sass-loader',
			// 	],
			// },
			{
				// copies image files to assets folder in destination folder - build
				test: /\.(svg|png|jpg|jpeg|gif|ico|csv)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name]-[hash:8].[ext]',
							outputPath: 'dist',
							},
						},
					],
				},
			],
		},
	// optimization: {
	// 	minimizer: [
	// 		new TerserWeppackPlugin({
	// 			terserOptions: {
	// 				parse: {
	// 					ecma: 8,
	// 				},
	// 				compress: {
	// 					ecma: 5,
	// 					warnings: false,
	// 					comparisons: false,
	// 					inline: 2,
	// 				},
	// 				mangle: {
	// 					safari10: true,
	// 				},
	// 				output: {
	// 					ecma: 5,
	// 					comments: false,
	// 					ascii_only: true,
	// 				},
	// 			},
	// 			parallel: true,
	// 			cache: true,
	// 			sourceMap: true,
	// 		}),
	// 	],
	// },
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src/index.html'),
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAtributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				//minifyURLs: true,
			},
		}),
		// new MiniCssExtractPlugin({
		// 	filename: 'static/css/[name].[hash:8].css',
		// }),
		// new OptimizeCSSAssetsPlugin({
		// 	cssProcessorOptions: {
		// 		parser: postcssSafeParser,
		// 		map: true,
		// 	},
		// }),
		// new CleanWebpackPlugin(),
	],
}
