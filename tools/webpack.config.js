import { resolve } from 'path';
import webpack from 'webpack';

const config = {
    entry: [process.cwd() + '/lib/index.js'],
    output: {
        path: './',
        filename: 'index.js',
        libraryTarget: 'commonjs2',
        sourcePrefix: '    '
    },
    target: 'node',
    stats: {
        colors: true
    },
    plugins: [],
    externals: [/^[a-z\-0-9]+$/],
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: [resolve(process.cwd(), 'lib')],
                loader: 'babel-loader',
                query: {
                    'babelrc': false,
                    'plugins': [
                        ['transform-runtime', { polyfill: false }],
                        'babel-plugin-transform-es2015-template-literals',
                        'babel-plugin-transform-es2015-literals',
                        'babel-plugin-transform-es2015-function-name',
                        'babel-plugin-transform-es2015-arrow-functions',
                        'babel-plugin-transform-es2015-block-scoped-functions',
                        'babel-plugin-transform-es2015-classes',
                        'babel-plugin-transform-es2015-object-super',
                        'babel-plugin-transform-es2015-shorthand-properties',
                        'babel-plugin-transform-es2015-computed-properties',
                        'babel-plugin-transform-es2015-for-of',
                        'babel-plugin-transform-es2015-sticky-regex',
                        'babel-plugin-transform-es2015-unicode-regex',
                        'babel-plugin-check-es2015-constants',
                        'babel-plugin-transform-es2015-spread',
                        'babel-plugin-transform-es2015-parameters',
                        'babel-plugin-transform-es2015-destructuring',
                        'babel-plugin-transform-es2015-block-scoping',
                        'babel-plugin-transform-es2015-typeof-symbol',
                        'babel-plugin-transform-es2015-modules-commonjs'
                    ]
                }
            }
        ]
    }
};

export default config;
