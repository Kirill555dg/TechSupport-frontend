const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: {
      index: path.resolve(__dirname, 'src', 'scripts', 'index.js'),
      login: path.resolve(__dirname, 'src', 'scripts', 'login.js'),
      support: path.resolve(__dirname, 'src', 'scripts', 'support.js'),
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].bundle.js',
        publicPath: ''
    },
    mode: 'development',
    devServer: {
        static: path.resolve(__dirname, 'build'),
        compress: true,
        port: 8008,
        open: 'login.html'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/,
                type: 'asset/resource'
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader'
                ]
            },

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: path.resolve(__dirname, 'src', 'index.html'),
          chunks: ['index'], // Указываем, какой JS использовать
        }),
        new HtmlWebpackPlugin({
          filename: 'login.html',
          template: path.resolve(__dirname, 'src', 'login.html'),
          chunks: ['login'],
        }),
        new HtmlWebpackPlugin({
          filename: 'support.html',
          template: path.resolve(__dirname, 'src', 'support.html'),
          chunks: ['support'],
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
    ]
}
