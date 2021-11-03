const { appEnv } = require('./main.config')

const config = {
  plugins: {}
}

// Add css nano for production
if (appEnv === 'production') {
  config.plugins.cssnano = { preset: 'default' }
}

module.exports = config
