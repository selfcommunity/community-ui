const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
	const mode = argv.mode || 'development'; // dev mode by default
	return {
		mode,
		entry: {
			'react-templates': './src/index.ts'
		},
		output: {
			path: path.join(__dirname, './lib/umd'),
			filename: '[name].js',
			library: 'SelfCommunityReactTemplates',
			libraryTarget: 'umd'
		},
		module: {
			rules: [{
				test: /\.(j|t)sx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						rootMode: 'upward',
						presets: [
							'@babel/preset-env',
							'@babel/preset-react',
							'@babel/preset-typescript'
						]
					}
				}
			}, {
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}]
		},
		resolve: {
			extensions: ['.js', '.ts', '.tsx', '.json']
		},
		externals: [
			/^react/,
			/^react-dom/,
			/^react-intl/,
			/^@emotion\/[\/a-zA-Z]*/,
			/^@mui\/[\/a-zA-Z]*/
		],
		optimization: {
			splitChunks: {
				chunks: 'all'
			}
		},
		performance: {
			hints: false
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			new webpack.BannerPlugin({
				banner: '(c) 2023 - present: Quentral Srl | https://github.com/selfcommunity/community-js/blob/master/LICENSE.md',
				entryOnly: true
			})
		]
	};
};
