module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          browsers: 'defaults'
        },
        loose: true
      }
    ],
    '@babel/preset-react'
  ]
}
