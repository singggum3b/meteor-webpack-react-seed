var webpack = require('webpack'),
		path = require('path'),
		ProgressBarPlugin = require("progress-bar-webpack-plugin");

module.exports = {
	devServer: {
		// You can change this to your server IP address to access it remotely
		host: 'localhost'
	},
	hotMiddleware: {
		reload: true
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json', '.styl']
	},
	plugins: [
		new ProgressBarPlugin()
	]
};
