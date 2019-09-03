const path = require('path');

module.exports = {
    entry: './examples/scripts/demo.ts',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'demo.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.glsl$/,
                loader: 'ts-shader-loader'
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'examples'),
        port: 8080
    }
}