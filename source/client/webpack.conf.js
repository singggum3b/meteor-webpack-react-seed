var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var autoprefixer = require("autoprefixer");
var poststylus = require("poststylus");

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

var plugins = [
	new webpack.optimize.DedupePlugin(),
	new webpack.PrefetchPlugin(undefined, "jquery"),
	new webpack.PrefetchPlugin(undefined, "react"),
	new webpack.PrefetchPlugin(undefined, "react-router"),
	new webpack.PrefetchPlugin(undefined, "react-canvas"),
	new webpack.PrefetchPlugin(undefined, "history"),
	new webpack.PrefetchPlugin(undefined, "nuclear-js"),
	new webpack.optimize.CommonsChunkPlugin({
		name: ["common-vendor"],
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

var browserSupport = [
	"last 2 Chrome versions",
	"ff >= 25",
	"last 2 iOS versions",
	"last 2 Safari versions",
	"ie >= 10"
];

var postCSS = [autoprefixer({browsers: browserSupport})];

var cssLoader;
if (process.env.NODE_ENV === 'production') {
	plugins.push(new ExtractTextPlugin('style.css', { allChunks: true }));
	cssLoader = ExtractTextPlugin.extract('style', 'css?sourceMap!stylus');
} else {
	cssLoader = 'style?sourceMap!css?sourceMap!stylus'
}

module.exports = {
	//entry has to be an object with format like this :
	/*{
		main: './entry', - required
		common-*": ["jquery"] - common prefix for common chunk [optional]
		other : './altenative' [optional]
	}*/
	devtool: "cheap-module-eval-source-map",
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
			{ test: /\.styl$/, loader: cssLoader },
			{ test: /\.(png|gif|jpe?g|ico)(\?.*)?$/, loader: 'url?limit=8182' },
			{ test: /\.(svg|ttf|woff|eot)(\?.*)?$/, loader: 'file' }
		],
		postLoaders: [
			{test: /linebreak/, loader: "transform?brfs"}
		],
		noParse: /\.min\.js/
	},
	stylus: {
		"include css": true,
		sourceMap:{
			"comment": true,
			basePath: __dirname
		},
		filename: "style.styl",
		use: [require("jeet")(), require("kouto-swiss")(), poststylus(postCSS)]
	},
	plugins: plugins
};
