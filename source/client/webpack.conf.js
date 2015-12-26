var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var babelSettings = {
	presets: ['react', 'es2015', 'stage-0'],
	cacheDirectory: undefined
};
babelSettings.plugins = ['transform-decorators-legacy'];

if (process.env.NODE_ENV !== 'production' && !process.env.IS_MIRROR) {
	babelSettings.plugins.push(['react-transform', {
		transforms: [{
			transform: 'react-transform-hmr',
			imports: ['react'],
			locals: ['module']
		}, {
			transform: 'react-transform-catch-errors',
			imports: ['react', 'redbox-react']
		}]
		// redbox-react is breaking the line numbers :-(
		// you might want to disable it
	}]);
}

var cssLoader;
var plugins = [
	new webpack.PrefetchPlugin(undefined, "jquery"),
	new webpack.PrefetchPlugin(undefined, "react"),
	new webpack.PrefetchPlugin(undefined, "react-router"),
	new webpack.PrefetchPlugin(undefined, "react-canvas"),
	new webpack.PrefetchPlugin(undefined, "history"),
	new webpack.PrefetchPlugin(undefined, "nuclear-js"),
	new webpack.optimize.CommonsChunkPlugin({
		name: "common-vendor",
		minChunks: Infinity
	})
	/*{
	//Output stats
		apply: function(compiler) {
			compiler.plugin('after-emit', function(compilation, done) {
				var stats = compilation.getStats().toJson();
				require("fs").writeFile('webpack.stats.json', JSON.stringify(stats), done);
			});
		}
	}*/
];

if (process.env.NODE_ENV === 'production') {
	plugins.push(new ExtractTextPlugin('style.css', { allChunks: true }));
	cssLoader = ExtractTextPlugin.extract('style', 'css?module&localIdentName=[hash:base64:5]');
} else {
	cssLoader = 'style!css?module&localIdentName=[name]__[local]__[hash:base64:5]';
}

module.exports = {
	//entry has to be an object with format like this :
	/*{
		main: './entry', - required
		common-*": ["jquery"] - common prefix for common chunk [optional]
		other : './altenative' [optional]
	}*/
	entry: {
		main: './entry',
		//need common prefix if this's common chunk
		"common-vendor": ["jquery","react","react-router","react-canvas","history","nuclear-js"]
	},
	resolve: {
		// Tell webpack to look for required files in bower and node
		modulesDirectories: ['../../custom_modules', '../../node_modules', '../../source/client']
	},
	resolveLoader: {
		modulesDirectories: ['../../custom_modules', '../../node_modules']
	},
	externals: {
	},
	module: {
		loaders: [
			{ test: /\.htm/, loader: "html" },
			{ test: /\.js?$/, loader: 'babel', query: babelSettings, exclude: /node_modules/ },
			{ test: /\.css$/, loader: cssLoader },
			{ test: /\.(png|gif|jpe?g|ico)(\?.*)?$/, loader: 'url?limit=8182' },
			{ test: /\.(svg|ttf|woff|eot)(\?.*)?$/, loader: 'file' }
		],
		postLoaders: [
			{test: /linebreak/, loader: "transform?brfs"}
		],
		noParse: /\.min\.js/
	},
	plugins: plugins
};
