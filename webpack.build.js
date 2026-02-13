var webpack = require('webpack');
var path = require('path');
var version = require('./package.json').version;

var banner =
	'vue-seasons-falling (SeasonsFalling) v' + version + '\n' +
	'Original: 2017 (c) Fuxy526\n' +
	'Modified: 2026 (c) Tom Sin\n' +
	'Released under the MIT License.';

module.exports = {
	entry: './src/components/SeasonsFalling.vue',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'vue-seasons-falling.js',
		libraryTarget: 'commonjs2'
	},
	plugins: [
		new webpack.BannerPlugin(banner)
	],
	module: {
		loaders: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader'
			}
		]
	}
};