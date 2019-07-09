import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import LiveReloadPlugin from 'webpack-livereload-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import WebpackShellPlugin from 'webpack-shell-plugin';
import OpenBrowserPlugin from 'open-browser-webpack-plugin';

export default (env, argv) => {
  const common = {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          include: [path.resolve(__dirname, 'src')],
          query: {
            presets: [
              'env',
              'stage-2',
              'react'
            ]
          }
        },
        {
          test: /\.scss/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader?url=false',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new LiveReloadPlugin({ delay: 500 })
    ]
  }

  const clientConfig = {
    ...common,
    name: 'client',
    target: 'web',
    optimization: {
        minimizer: [new OptimizeCssAssetsPlugin({})],
    },
    entry: {
      client: [
        'babel-polyfill',
        './src/client.js',
        './src/style/main.scss'
      ]
    },

    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main-[hash].js'
    },

    plugins: [
      ...common.plugins,
      new MiniCssExtractPlugin({
       filename: 'style-[hash].css'
      }),
      new HtmlWebpackPlugin({
        template: 'views/main-page.handlebars',
        filename: 'views/main-page.handlebars'
      }),
      new CleanWebpackPlugin({
        dry: false,
        cleanOnceBeforeBuildPatterns: ['main-*.js', 'main-*.css'],
        cleanAfterEveryBuildPatterns: ['main-*.js', 'main-*.css']
      })
    ],

    devtool: argv.mode === 'development' ? 'cheap-module-source-map' : 'none',

    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    }
  }

  const serverConfig = {
    ...common,

    name: 'server',
    target: 'node',
    externals: [nodeExternals()],

    entry: {
      server: [
        'babel-polyfill',
        path.resolve(__dirname, 'src', 'server.js')
      ]
    },

    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'server.js'
    },

    devtool: argv.mode === 'development' ? 'cheap-module-source-map' : 'none',

    node: {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false,
    },

    plugins: [
      ...common.plugins,
      ...(argv.mode === 'development' ? [new WebpackShellPlugin({ onBuildEnd: ['nodemon --watch ./build ./build/server.js'] })] : []),
      new OpenBrowserPlugin({ url: 'http://localhost:3000', delay: 1000 })
    ]
  }

  return [clientConfig, serverConfig];
}
