// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  configureWebpack: config => {
    const base = {
      resolve: {
        alias: {
          settings: path.join(__dirname, '/src/scss/element-variables.scss')
        }
      }
    }
    return base
  },
  devServer: {
    proxy: {
      '/api': {
        changeOrigin: true,
        target: 'https://sigmanek.net/',
        ws: true
      }
    }
  }
}
