module.exports = {
  type: 'react-component',
  devServer: {
    host: 'qamarketplace.vtexlocal.com.br',
    proxy: {
      '*': 'http://qamarketplace.vtexcommercestable.com.br:80',
    },
  },
  karma: {
    testFiles: ['**/__mock__/**', '*.spec.js', '*.test.js', '*-test.js'],
  },
  npm: {
    esModules: false,
  },
  webpack: {
    rules: {
      css: {
        modules: true,
        localIdentName:
          process.env.NODE_ENV === 'production'
            ? '[path][name]-[local]-[hash:base64:5]'
            : '[hash:base64:5]',
      },
    },
  },
}
