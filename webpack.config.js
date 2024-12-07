const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: {
      new_task: path.resolve(__dirname, 'src', 'scripts', 'new_task.js'),
      login: path.resolve(__dirname, 'src', 'scripts', 'login.js'),
      kanban_desk: path.resolve(__dirname, 'src', 'scripts', 'kanban_desk.js'),
      assigned_tasks: path.resolve(__dirname, 'src', 'scripts', 'assigned_tasks.js'),
      submited_tasks: path.resolve(__dirname, 'src', 'scripts', 'submited_tasks.js'),
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
          filename: 'new_task.html',
          template: path.resolve(__dirname, 'src', 'new_task.html'),
          chunks: ['new_task'], // Указываем, какой JS использовать
        }),
        new HtmlWebpackPlugin({
          filename: 'login.html',
          template: path.resolve(__dirname, 'src', 'login.html'),
          chunks: ['login'],
        }),
        new HtmlWebpackPlugin({
          filename: 'kanban_desk.html',
          template: path.resolve(__dirname, 'src', 'kanban_desk.html'),
          chunks: ['kanban_desk'],
        }),
        new HtmlWebpackPlugin({
          filename: 'assigned_tasks.html',
          template: path.resolve(__dirname, 'src', 'assigned_tasks.html'),
          chunks: ['assigned_tasks'],
        }),
        new HtmlWebpackPlugin({
          filename: 'submited_tasks.html',
          template: path.resolve(__dirname, 'src', 'submited_tasks.html'),
          chunks: ['submited_tasks'],
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
    ]
}
