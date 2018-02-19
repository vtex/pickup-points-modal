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
    extractText: {
      allChunks: true,
      filename: 'styles.css',
    },
  },
}
