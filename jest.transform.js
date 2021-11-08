const babelJest = require('babel-jest')

module.exports = babelJest.default.createTransformer({
  presets: [
    require.resolve('@babel/preset-env'),
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-typescript'),
  ],
  babelrc: false,
  configFile: false,
})
