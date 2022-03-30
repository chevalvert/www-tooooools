const path = require('path')
const webpack = require('webpack')

const root = path.join(__dirname, '..')

module.exports = {
  entry: {
    'assets/builds/common.js': [path.join(root, 'src', 'templates', 'common.js')],
    'assets/builds/home.js': [path.join(root, 'src', 'templates', 'home.js')],
    'assets/builds/project.js': [path.join(root, 'src', 'templates', 'project.js')],
    'assets/builds/bundle.css': [path.join(root, 'src', 'index.scss')]
  },

  output: {
    publicPath: '/',
    path: path.join(root, 'www'),
    filename: '[name]',
    chunkFilename: '[name].[id].chunk.js'
  },

  resolve: {
    alias: {
      abstractions: path.join(root, 'src', 'abstractions'),
      components: path.join(root, 'src', 'components'),
      controllers: path.join(root, 'src', 'controllers'),
      utils: path.join(root, 'src', 'utils'),
      views: path.join(root, 'src', 'views')
    }
  },

  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        include: path.join(root, 'src')
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'ifdef-loader',
        options: { DEVELOPMENT: process.env.NODE_ENV !== 'production' }
      },
      {
        test: /\.svg$/i,
        use: 'raw-loader'
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      h: [path.join(root, 'src', 'utils', 'jsx'), 'h']
    })
  ]
}
