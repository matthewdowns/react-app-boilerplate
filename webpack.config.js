const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { join, resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const { DefinePlugin } = require('webpack');
const { dependencies } = require('./package.json');

const publicPath = resolve(__dirname, './public');
const srcPath = resolve(__dirname, './src');
const distPath = resolve(__dirname, './dist');

module.exports = ({ NODE_ENV }) => {
    const isProd = NODE_ENV === 'production';

    return {
        mode: NODE_ENV,
        target: 'web',
        entry: {
            main: join(srcPath, 'index.tsx')
        },
        output: {
            filename: isProd ? '[name].[chunkhash].js' : '[name].js',
            path: distPath,
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        'ts-loader'
                    ]
                }
            ]
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react-router-dom': 'ReactRouterDOM'
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: publicPath, to: distPath }
                ]
            }),
            new DefinePlugin({
                'process.env.ENVIRONMENT': JSON.stringify(NODE_ENV)
            }),
            new HtmlPlugin({
                template: join(srcPath, 'index.ejs'),
                templateParameters: {
                    cdnReact: `https://unpkg.com/react@${dependencies['react'].match(/(\d+\.?)+/g)[0]}/umd/react${isProd ? '.production.min' : '.development'}.js`,
                    cdnReactDom: `https://unpkg.com/react-dom@${dependencies['react-dom'].match(/(\d+\.?)+/g)[0]}/umd/react-dom${isProd ? '.production.min' : '.development'}.js`
                }
            })
        ],
        resolve: {
            extensions: ['.js', '.json', '.ts', '.tsx'],
            plugins: [
                new TsconfigPathsPlugin()
            ]
        },
        optimization: {
            minimizer: [
                new TerserPlugin()
            ],
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            // get the name. E.g. node_modules/packageName/not/this/part.js
                            // or node_modules/packageName
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                            // npm package names are URL-safe, but some servers don't like @ symbols
                            return `vendor~${packageName.replace('@', '')}`;
                        },
                    }
                }
            },
        },
        devtool: 'source-map',
        devServer: {
            contentBase: '/',
            disableHostCheck: true,
            historyApiFallback: true,
            port: 3000,
            publicPath: '/'
        }
    };
}