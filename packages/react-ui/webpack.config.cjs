const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
	const mode = argv.mode || 'development'; // dev mode by default
	return {
		mode,
		entry: {
			'react-ui': './src/index.ts'
		},
		output: {
			path: path.join(__dirname, './lib/umd'),
			filename: '[name].js',
			library: 'SelfCommunityReactUI',
			libraryTarget: 'umd'
		},
		module: {
			rules: [
				{
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
				},
				{
					test: /\.css$/,
					use: [
						'style-loader',
						'css-loader'
					]
				},
				{
					test: /\.(svg)(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								outputPath: 'assets/'
							}
						}
					]
				}
			]
		},
		resolve: {
			extensions: ['.js', '.ts', '.tsx', '.json']
		},
		optimization: {
			splitChunks: {
				chunks: 'all'
			}
		},
		performance: {
			hints: false
		},
		externals: [
			/^react/,
			/^react-dom/,
			/^react-intl/,
			/^notistack\/[\/a-zA-Z]*/,
			/^@rpldy\/[\/a-zA-Z]*/,
			/^@emotion\/[\/a-zA-Z]*/,
			/^@mui\/[\/a-zA-Z]*/,
			/^pdfjs-dist\/[\/a-zA-Z]*/,
			/^notistack/
		],
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
