import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';

import { terser } from 'rollup-plugin-terser';  

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
    treeshake: true,
    plugins: [
        json(),
        nodeResolve({ preferBuiltins: true, browser: false }),
        commonjs({
            ignoreDynamicRequires: true
        }),
        babel(),
        terser() // 使用 Terser 进行压缩  
    ],
    onwarn(warning, warn) {
        if (warning.code == 'EVAL') return;
        warn(warning);
    }
}