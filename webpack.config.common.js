const path = require('path')
const user = require('./scripts/utils/format-config')(require('./main.config.js'))
const { EnvironmentPlugin, DefinePlugin } = require('webpack')
const pkg = require('./package.json')

const CSSLoaders = [
  {
    loader: 'css-loader',
    options: {
      url: !!(user.appEnv === 'development'),
      sourceMap: true
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true
    }
  }
]

if (user.css.preprocessorLoader) {
  CSSLoaders.push(
    {
      loader: user.css.preprocessorLoader,
      options: {
        sourceMap: true
      }
    }
  )
}

const webpack = {
  output: {
    publicPath: user.paths.basepath,
    // we bundle from the www folder to avoid messing with the webpack dev middleware
    // all entries src/dest path are converted through scripts/utils/format-config.js
    path: user.paths.www,
    filename: '[name]',
    chunkFilename: '[name].[id].chunk.js'
  },
  resolve: {
    alias: {
      abstractions: path.join(user.paths.src, 'abstractions'),
      components: path.join(user.paths.src, 'components'),
      controllers: path.join(user.paths.src, 'controllers'),
      utils: path.join(user.paths.src, 'utils'),
      views: path.join(user.paths.src, 'views')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  plugins: [
    new EnvironmentPlugin(['NODE_ENV']),
    new DefinePlugin({
      PACKAGE_NAME: JSON.stringify(pkg['name']),
      PACKAGE_VERSION: JSON.stringify(pkg['version'])
    })
  ]
}

module.exports = { CSSLoaders, webpack, user }
