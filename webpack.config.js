const { ReproductionPlugin } = require("./plugins/reproduction-plugin");
const path = require("node:path");

/** @type {import('webpack').Configuration}*/
module.exports = {
    context: __dirname,
    mode: "development",
    devtool: false,
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "out"),
    },
    module: {
        rules: [
            {
                test: /\.?(svg|html)$/,
                resourceQuery: /\?loadResource/,
                type: "asset/source",
            },
        ],
    },
    plugins: [new ReproductionPlugin()],
};
