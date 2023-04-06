import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';

import pkg from '../package.json' assert { type: 'json' };

const banner = `/*!
* ${pkg.name} ${pkg.version}
* Licensed under MIT
*/
`;

export default {
    input: "src/index.js",
    output: {
        file: "dist/index.js",
        format: 'cjs',
        name: pkg.name,
        banner: banner
    },
    treeshake: false,
    plugins: [
        json(),
        nodeResolve({ preferBuiltins: true, browser: false }),
        commonjs({
            ignoreDynamicRequires: true
        }),
        babel(),
    ],
    onwarn(warning, warn) {
        if (warning.code == 'EVAL') return;
        warn(warning);
    }
}