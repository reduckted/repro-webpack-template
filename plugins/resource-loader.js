const vm = require("node:vm");

class ResourceLoader {
    _parentCompilation;

    setCompilation(value) {
        this._parentCompilation = value;
    }

    async get(filePath) {
        if (!this._parentCompilation) {
            throw new Error("parentCompilation not set.");
        }

        const { context, webpack } = this._parentCompilation.compiler;
        const { EntryPlugin, library, node, sources } = webpack;

        const childCompiler = this._parentCompilation.createChildCompiler(
            "reproduction:resource",
            {
                filename: filePath,
                library: { type: "var", name: "resource" },
            },
            [
                new node.NodeTemplatePlugin(),
                new node.NodeTargetPlugin(),
                new EntryPlugin(context, `${filePath}?loadResource`, {
                    name: "resource",
                }),
                new library.EnableLibraryPlugin("var"),
            ]
        );

        childCompiler.hooks.thisCompilation.tap(
            "resource-loader",
            (compilation) => {
                compilation.hooks.additionalAssets.tap(
                    "resource-loader",
                    () => {
                        const asset = compilation.assets[filePath];

                        if (!asset) {
                            return;
                        }

                        compilation.assets[filePath] = new sources.RawSource(
                            this._evaluate(filePath, asset.source().toString())
                        );
                    }
                );
            }
        );

        let finalContent;

        childCompiler.hooks.compilation.tap(
            "resource-loader",
            (childCompilation) => {
                childCompilation.hooks.processAssets.tap(
                    {
                        name: "resource-loader",
                        stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
                    },
                    () => {
                        finalContent = childCompilation.assets[filePath]
                            ?.source()
                            .toString();
                    }
                );
            }
        );

        return new Promise((resolve, reject) => {
            childCompiler.runAsChild((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(finalContent ?? "");
                }
            });
        });
    }

    _evaluate(filename, source) {
        const context = {};

        vm.runInNewContext(source, context, { filename });

        if (typeof context.resource === "string") {
            return context.resource;
        } else {
            throw new Error(`The loader "${filename}" didn't return a string.`);
        }
    }
}

module.exports = { ResourceLoader };
