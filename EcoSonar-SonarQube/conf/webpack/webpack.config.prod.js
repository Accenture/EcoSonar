const webpack = require('webpack');
const config = require('./webpack.config');
const getClientEnvironment = require('../env');

// Get environment variables to inject into our app.
const env = getClientEnvironment();

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
if (env['process.env.NODE_ENV'] !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

config.mode = 'production'

// Don't attempt to continue if there are any errors.
config.bail = true;

config.plugins = [
  // Makes some environment variables available to the JS code, for example:
  // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
  // It is absolutely essential that NODE_ENV was set to production here.
  // Otherwise React will be compiled in the very slow development mode.
  new webpack.DefinePlugin(env)
];



config.module.rules =  [
  {
    test: /\.s[ac]ss$/i,
    use: [
      // Creates `style` nodes from JS strings
      "style-loader",
      // Translates CSS into CommonJS
      "css-loader",
      // Compiles Sass to CSS
      "sass-loader",
    ],
  }, {
    test: /\.js?$/,
    exclude: /(node_modules)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react']
      }
    }
  }, {test: /\.svg/,
    type: 'asset/inline'}
]

 



module.exports = config;
