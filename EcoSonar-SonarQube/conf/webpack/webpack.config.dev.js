const webpack = require('webpack');
const config = require('./webpack.config');

config.devtool = 'eval';

config.mode = 'development'

config.plugins = [new webpack.HotModuleReplacementPlugin()];

module.exports = config;
