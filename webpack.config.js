const path = require('path');

module.exports = {
    entry: {
        'barrel':   './examples/barrel/scripts/app.ts',
        'terrain':  './examples/terrain/scripts/app.ts'
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(glsl|obj)$/,
                use: 'raw-loader'
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,  
                use: 'url-loader'
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