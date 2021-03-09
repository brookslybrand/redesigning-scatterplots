import { Config } from 'remotion'

Config.Output.setCodec('h264')
Config.Output.setImageSequence(false)
Config.Rendering.setImageFormat('jpeg')
Config.Bundling.overrideWebpackConfig((config) => {
  const rules = config.module?.rules ?? []
  rules.push({
    test: /\.svg$/,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: {
              removeViewBox: false,
            },
          },
        },
      },
    ],
  })
  return {
    ...config,
    module: {
      ...config.module,
      rules,
    },
  }
})
