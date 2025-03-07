import * as path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import type { Configuration } from '@rspack/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mainTsFiles = glob.sync('./src/**/main.ts').map((filePath) => path.posix.normalize(filePath));

const entry = mainTsFiles.reduce((acc: Record<string, string>, filePath) => {
    const entryName = path.basename(path.dirname(filePath));
    acc[entryName] = './' + filePath;
    return acc;
}, {});

const config: Configuration = {
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    entry,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },

    resolve: {
        extensions: ['.ts', '.js'],
        tsConfig: {
            configFile: path.resolve(__dirname, 'tsconfig.json'),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'builtin:swc-loader',
                options: {
                    sourceMap: true,
                    jsc: {
                        parser: {
                            syntax: 'typescript',
                        },
                    },
                },
                type: 'javascript/auto',
            },
        ],
    },
    optimization: {
        // Remain unminized in case any users send errors.
        // This keeps line numbers and variable names usable.
        // In the future, when rspack implements beautify: true in SwcJsMinimizerRspackPlugin,
        // this can be changed.
        minimize: false,
        // This may be needed if issues arise with module not merging correctly
        // concatenateModules: false
    },
};

export default config;
