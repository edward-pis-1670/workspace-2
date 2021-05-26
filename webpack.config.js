var path = require('path');
//Thư mục sẽ chứa tập tin được biên dịch
var BUILD_DIR = path.resolve(__dirname, 'public/javascripts');
//Thư mục chứa dự án - các component React
var APP_DIR = path.resolve(__dirname, 'client');

module.exports = {
    entry: APP_DIR + '/index.js',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: [
                    path.resolve(__dirname, "node_modules"),
                ],
                include: APP_DIR,
query:
                {
                    presets: ['react']
                }
            },
        ]
    }
};
