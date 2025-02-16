const { Reproduction } = require("./plugins/reproduction");
const path = require("node:path");

/** @type {import('webpack').Configuration}*/
module.exports = {
    context: __dirname,
    mode: "development",
    entry: "./standalone/index.js",
    output: {
        path: path.join(__dirname, "out"),
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: "raw-loader",
            },
        ],
    },
    plugins: [new Reproduction()],
};
