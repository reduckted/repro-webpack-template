const { ResourceLoader } = require("./resource-loader");

const PLUGIN_NAME = "reproduction";

class ReproductionPlugin {
    apply(/** @type {import('webpack').Compiler} */ compiler) {
        const state = {};
        compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
            state.resourceLoader ??= new ResourceLoader();
            state.resourceLoader.setCompilation(compilation);

            compilation.hooks.finishModules.tapPromise(
                PLUGIN_NAME,
                async () => {
                    compilation
                        .getLogger("reproduction")
                        .info(
                            "template: '" +
                                (await state.resourceLoader.get(
                                    "./src/template.html"
                                )) +
                                "'"
                        );

                    state.resourceLoader.setCompilation(undefined);
                }
            );
        });
    }
}

module.exports = { ReproductionPlugin };
